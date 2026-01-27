"use client";
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Zap, Shield, Activity, WholeWord, Globe, LightbulbIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Global } from 'recharts';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login?message=Registration successful! Please log in.');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex relative overflow-hidden">
      
      <style jsx global>{`
        .bg-dot-pattern {
          background-image: radial-gradient(#22c55e 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>

      {/* --- LEFT SIDE: VISUAL TACTICAL DISPLAY --- */}
      <div className="hidden xl:flex w-1/2 relative bg-[#080808] items-center justify-center p-12 overflow-hidden border-r border-white/5">
         
         <div className="absolute inset-0 bg-dot-pattern opacity-[0.05]" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 blur-[120px] rounded-full" />
         
         <div className="relative w-full max-w-lg">
            {/* Main Tactical Glass Card */}
            <div className="relative bg-[#111]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-green-600/20 border border-green-500/20 flex items-center justify-center text-green-500 shadow-inner">
                     <Shield size={28} />
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-white tracking-tighter uppercase">Clearance <span className="text-green-500 italic">Level 1</span></h3>
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500/60">New Personnel Enrollment</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                  {[
                      { label: "Encrypted Storage", status: "Enabled", icon: <Lock/> },
                      { label: "Node Access", status: "Global", icon: <Globe/> },
                      { label: "Direct Support", status: "Priority", icon: <LightbulbIcon/> }
                  ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center gap-3">
                           <span className="text-lg">{item.icon}</span>
                           <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{item.label}</span>
                        </div>
                        <span className="text-[10px] font-black text-green-500 uppercase px-2 py-1 bg-green-500/10 rounded-lg">{item.status}</span>
                     </div>
                  ))}
               </div>

               <div className="mt-10 pt-8 border-t border-white/5">
                  <div className="flex -space-x-3 mb-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-[#111] bg-gray-800 overflow-hidden ring-1 ring-white/5">
                           <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-4 border-[#111] bg-green-600 flex items-center justify-center text-[10px] font-black text-white ring-1 ring-white/5">
                        +2K
                      </div>
                  </div>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                     Join the network of verified SafeCity responders.
                  </p>
               </div>
            </div>

            <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
         </div>
      </div>

      {/* --- RIGHT SIDE: REGISTRATION FORM --- */}
      <div className="w-full xl:w-1/2 flex flex-col min-h-[100dvh] xl:h-screen px-4 sm:px-12 relative z-10 py-6">
        
        {/* Branding Small */}
        <div className="flex-none mb-12 xl:mb-0 xl:absolute xl:top-8 xl:right-12">
            <div className="flex items-center gap-2 flex-row-reverse xl:flex-row">
                <span className="text-xl font-bold tracking-tight uppercase">SafeCity <span className="text-green-500 italic text-sm">Enroll</span></span>
                <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                    <Zap size={18} fill="white" className="text-white" />
                </div>
            </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
            <div className="max-w-[400px] w-full mx-auto">
                <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tighter uppercase">Request <span className="text-green-500">Access</span></h1>
                <p className="text-gray-400 mb-8 text-sm font-medium">Register your identity to receive a command token.</p>

                {/* Social Signup */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button className="flex items-center justify-center gap-2 bg-[#111] hover:bg-[#1a1a1a] border border-white/5 rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all">
                        <Chrome size={16} /> Google
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-[#111] hover:bg-[#1a1a1a] border border-white/5 rounded-xl py-3 text-xs font-black uppercase tracking-widest transition-all">
                        <Github size={16} /> GitHub
                    </button>
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
                        <span className="bg-[#050505] px-4 text-gray-500 font-bold">Encrypted Form</span>
                    </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4 text-center">
                    <p className="text-red-400 text-xs font-bold uppercase tracking-tight">{error}</p>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Legal Name</label>
                        <div className="relative">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input
                                type="text"
                                name="name"
                                placeholder="OFFICER NAME"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#0f0f0f] border border-white/5 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-green-500/50 transition-all placeholder:text-gray-700 font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Registry Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input
                                type="email"
                                name="email"
                                placeholder="name@safecity.gov"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#0f0f0f] border border-white/5 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-green-500/50 transition-all placeholder:text-gray-700 font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Access Token</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input
                                type="password"
                                name="password"
                                placeholder="MINIMUM 6 CHARACTERS"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full bg-[#0f0f0f] border border-white/5 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-green-500/50 transition-all placeholder:text-gray-700 font-bold"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-800 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em]"
                        >
                            {isLoading ? 'Processing Request...' : 'Initialize Enrollment'}
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
                    Already registered? <Link href="/login" className="text-white hover:text-green-500 transition-colors">Log In To Dashboard</Link>
                </p>
            </div>
        </div>
        
        <div className="flex-none flex gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-700 justify-center xl:justify-end">
           <a href="#" className="hover:text-green-500 transition-colors">Privacy Protocol</a>
           <a href="#" className="hover:text-green-500 transition-colors">Service Terms</a>
        </div>
      </div>

    </div>
  );
}