'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Camera, User, Mail, Calendar, ArrowLeft, LogOut, Upload, X, Check } from 'lucide-react';
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
      const response = await fetch('/api/auth/user', {
        credentials: 'include'
      });

      if (!response.ok) {
        router.push('/login');
        return;
      }

      const data = await response.json();
      setUser(data.user);
      if (data.user.profilePicture) {
        setImagePreview(data.user.profilePicture);
      }
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should not exceed 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }

      setError('');
      setSuccess('');
      setProfileImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!profileImage) {
      setError('Please select an image first');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('profileImage', profileImage);

      const response = await fetch('/api/user/update-profile-picture', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();

      setUser(prev => ({
        ...prev,
        profilePicture: data.profilePicture
      }));

      setImagePreview(data.profilePicture);
      setProfileImage(null);
      setSuccess('Profile picture updated successfully!');

      setTimeout(() => setSuccess(''), 3000);

      const fileInput = document.getElementById('profile-upload');
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setProfileImage(null);
    setError('');
    setSuccess('');
    setImagePreview(user?.profilePicture || null);

    const fileInput = document.getElementById('profile-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-16 sm:py-20 md:py-24 relative z-10">
        {/* Navigation */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.push('/main')}
            className="flex items-center space-x-1.5 sm:space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-sm sm:text-base">Back to Dashboard</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-[#111]/60 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl border border-white/10 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 border-b border-white/10 px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
            <div className="flex flex-col items-center">
              {/* Profile Picture */}
              <div className="relative mb-4 sm:mb-5 md:mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-purple-600/20 p-1 border border-purple-400/50">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#1a1a1a] flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt={`${user.name}'s profile picture`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-purple-400" />
                    )}
                  </div>
                  {profileImage && (
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-purple-600 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                      New
                    </div>
                  )}
                </div>

                {/* Camera Button */}
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-[#1a1a1a] border border-white/10 rounded-full p-1.5 sm:p-2 shadow-lg cursor-pointer hover:bg-[#252525] transition-colors"
                >
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                </label>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 text-center">{user.name}</h2>
              <p className="text-sm sm:text-base text-purple-200 text-center">{user.email}</p>
            </div>
          </div>

          {/* Upload Controls */}
          {profileImage && (
            <div className="px-8 py-4 bg-[#0a0a0a] border-b border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-300">Ready to update your profile picture?</p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancelUpload}
                    disabled={uploading}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-300 bg-[#1a1a1a] border border-white/10 rounded-lg hover:bg-[#252525] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Save Photo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {error && (
            <div className="px-8 py-4 bg-red-500/10 border-b border-red-500/20">
              <div className="flex items-center space-x-2 text-red-400">
                <X className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="px-8 py-4 bg-green-500/10 border-b border-green-500/20">
              <div className="flex items-center space-x-2 text-green-400">
                <Check className="w-5 h-5" />
                <span className="text-sm">{success}</span>
              </div>
            </div>
          )}

          {/* Profile Information */}
          <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-7 md:py-8">
            <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-5 md:mb-6">Profile Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-400 mb-1">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Full Name</span>
                </div>
                <p className="text-white font-medium text-sm sm:text-base">{user.name}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-400 mb-1">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Email Address</span>
                </div>
                <p className="text-white font-medium text-sm sm:text-base">{user.email}</p>
              </div>

              <div className="space-y-1 md:col-span-2">
                <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-400 mb-1">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Member Since</span>
                </div>
                <p className="text-white font-medium text-sm sm:text-base">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Upload Guidelines */}
          <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-[#0a0a0a] border-t border-white/10">
            <p className="text-xs sm:text-sm text-gray-400">
              <strong className="text-white">Photo Guidelines:</strong> Upload JPG, PNG, WebP, or GIF files up to 5MB. Square images work best for profile pictures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}