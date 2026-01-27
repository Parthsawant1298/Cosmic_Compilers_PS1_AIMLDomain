'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Camera, User, Mail, Calendar, ArrowLeft, LogOut, Upload, X, Check, ShieldCheck, Activity } from 'lucide-react';
import Navbar from './Navbar';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/user', { credentials: 'include' });
      if (!response.ok) { router.push('/login'); return; }
      const data = await response.json();
      setUser(data.user);
      if (data.user.profilePicture) { setImagePreview(data.user.profilePicture); }
    } catch (error) { router.push('/login'); } finally { setLoading(false); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { setError('Image size should not exceed 5MB'); return; }
      setError(''); setSuccess(''); setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!profileImage) { setError('Please select an image first'); return; }
    setUploading(true); setError(''); setSuccess('');
    try {
      const formData = new FormData();
      formData.append('profileImage', profileImage);
      const response = await fetch('/api/user/update-profile-picture', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload image');
      const data = await response.json();
      setUser(prev => ({ ...prev, profilePicture: data.profilePicture }));
      setProfileImage(null);
      setSuccess('Profile picture updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) { setError(error.message); } finally { setUploading(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen text-slate-900">
      <Navbar />

      {/* 1. HERO SECTION (Consistent with About/FAQ) */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: `linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)`, backgroundSize: '50px 50px' }}></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-[0.2em]">
              Personnel File
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
              Operator <span className="text-green-500 italic">Profile</span>
            </h1>
            <button
              onClick={() => router.push('/main')}
              className="flex items-center space-x-2 text-slate-400 hover:text-green-400 transition-colors text-sm font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Command Center</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. PROFILE DOSSIER */}
      <section className="py-20 px-6 max-w-4xl mx-auto -mt-16 relative z-20">
        <div className="bg-white border border-slate-200 shadow-2xl rounded-[2.5rem] overflow-hidden">
          
          {/* Header Area */}
          <div className="bg-slate-50 p-8 border-b border-slate-100 flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl overflow-hidden bg-slate-200 border-4 border-white shadow-lg">
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" alt="User" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400"><User size={48} /></div>
                )}
              </div>
              <label htmlFor="profile-upload" className="absolute -bottom-2 -right-2 bg-green-600 hover:bg-green-700 p-2.5 rounded-xl cursor-pointer text-white shadow-lg transition-all">
                <Camera size={18} />
              </label>
              <input type="file" id="profile-upload" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>

            <div className="text-center md:text-left space-y-1">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{user?.name}</h2>
              <p className="text-slate-500 font-medium">{user?.email}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={12} /> Access Level: Operator
              </div>
            </div>
          </div>

          {/* Upload Status Messages */}
          {profileImage && (
            <div className="p-6 bg-green-50 border-b border-green-100 flex items-center justify-between animate-in slide-in-from-top">
              <p className="text-sm font-bold text-green-800 uppercase tracking-tighter">New biometric photo detected</p>
              <div className="flex gap-3">
                <button onClick={() => setProfileImage(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                <button onClick={handleUpload} disabled={uploading} className="bg-green-600 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase shadow-md hover:bg-green-700">
                  {uploading ? 'Processing...' : 'Update File'}
                </button>
              </div>
            </div>
          )}

          {error && <div className="p-4 bg-red-50 text-red-600 text-center font-bold text-xs uppercase tracking-widest">{error}</div>}
          {success && <div className="p-4 bg-green-50 text-green-600 text-center font-bold text-xs uppercase tracking-widest">{success}</div>}

          {/* Information Grid */}
          <div className="p-10 grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Designation</label>
                <div className="flex items-center gap-3 text-slate-900 font-bold">
                  <User size={18} className="text-green-500" />
                  {user?.name}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Service ID</label>
                <div className="flex items-center gap-3 text-slate-900 font-bold tracking-widest">
                  <Activity size={18} className="text-green-500" />
                  SC-{user?.id?.slice(-6).toUpperCase()}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Comms Node</label>
                <div className="flex items-center gap-3 text-slate-900 font-bold">
                  <Mail size={18} className="text-green-500" />
                  {user?.email}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Commission Date</label>
                <div className="flex items-center gap-3 text-slate-900 font-bold">
                  <Calendar size={18} className="text-green-500" />
                  {new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Authorized use only</p>
            <button className="flex items-center gap-2 text-red-600 hover:text-red-700 font-black text-xs uppercase tracking-[0.2em] transition-all">
              <LogOut size={16} /> Terminate Session
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}