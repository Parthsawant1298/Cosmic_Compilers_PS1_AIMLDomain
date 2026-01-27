"use client";
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Zap, ArrowRight, Github, Chrome, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Check for success message from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');
    if (message) {
      setSuccessMessage(message);
      // Clear the URL parameter
      window.history.replaceState({}, '', '/login');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to main page after successful login
        router.push('/main');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex relative overflow-hidden">
      
      {/* Global CSS for Dot Pattern */}
      <style jsx global>{`
        .bg-dot-pattern {
          background-image: radial-gradient(#ffffff 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>

      {/* --- LEFT SIDE: FORM --- */}
      {/* Enhanced mobile responsiveness */}
      <div className="w-full xl:w-1/2 flex flex-col min-h-[100dvh] xl:h-screen px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10 py-3 sm:py-4 lg:py-5 xl:py-6">
        
        {/* Mobile Background Elements */}
        <div className="xl:hidden absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
           <div className="absolute top-[-10%] right-[-10%] w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] bg-[#7C3AED]/20 blur-[60px] sm:blur-[80px] md:blur-[100px] rounded-full" />
        </div>

        {/* 1. Header/Logo */}
        {/* Enhanced responsive positioning */}
        <div className="flex-none xl:absolute xl:top-6 xl:left-12 2xl:top-8 2xl:left-16">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center shadow-[0_0_15px_#7C3AED]">
                    <Zap size={14} fill="white" className="text-white sm:hidden" />
                    <Zap size={16} fill="white" className="text-white hidden sm:block md:hidden" />
                    <Zap size={18} fill="white" className="text-white hidden md:block" />
                </div>
                <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight">Supernova</span>
            </div>
        </div>

        {/* 2. Form Container */}
        {/* Enhanced responsive layout */}
        <div className="flex-1 flex flex-col justify-center py-4 sm:py-6 md:py-8">
            <div className="max-w-[320px] sm:max-w-[360px] md:max-w-[400px] w-full mx-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3">Welcome back</h1>
                <p className="text-gray-400 mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm md:text-base">Enter your details to access your data verification platform.</p>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                    <button className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-2.5 bg-[#1A1A1A] hover:bg-[#252525] border border-white/10 rounded-lg py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base font-medium transition-all hover:border-white/20">
                        <Chrome size={14} className="sm:hidden" />
                        <Chrome size={16} className="hidden sm:block" />
                        <span className="hidden xs:block">Google</span>
                        <span className="xs:hidden">G</span>
                    </button>
                    <button className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-2.5 bg-[#1A1A1A] hover:bg-[#252525] border border-white/10 rounded-lg py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base font-medium transition-all hover:border-white/20">
                        <Github size={14} className="sm:hidden" />
                        <Github size={16} className="hidden sm:block" />
                        <span className="hidden xs:block">GitHub</span>
                        <span className="xs:hidden">GH</span>
                    </button>
                </div>

                <div className="relative mb-4 sm:mb-5 md:mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                        <span className="bg-[#050505] px-2 sm:px-3 text-gray-500">Or continue with email</span>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2.5 sm:p-3 md:p-4 mb-3 sm:mb-4">
                    <p className="text-green-400 text-xs sm:text-sm text-center">{successMessage}</p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 sm:p-3 md:p-4 mb-3 sm:mb-4">
                    <p className="text-red-400 text-xs sm:text-sm text-center">{error}</p>
                  </div>
                )}

                {/* Form Fields */}
                <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-1 sm:space-y-1.5">
                        <label className="text-xs sm:text-sm font-medium text-gray-300 ml-1">Email</label>
                        <div className="relative">
                            <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                                <Mail size={14} className="sm:hidden" />
                                <Mail size={16} className="hidden sm:block" />
                            </div>
                            <input
                            type="email"
                            name="email"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#151515] border border-white/10 rounded-lg pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 text-xs sm:text-sm md:text-base text-white placeholder:text-gray-600 focus:outline-none focus:border-[#7C3AED]/50 focus:ring-1 focus:ring-[#7C3AED]/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1 sm:space-y-1.5">
                        <label className="text-xs sm:text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative">
                            <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                                <Lock size={14} className="sm:hidden" />
                                <Lock size={16} className="hidden sm:block" />
                            </div>
                            <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#151515] border border-white/10 rounded-lg pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 text-xs sm:text-sm md:text-base text-white placeholder:text-gray-600 focus:outline-none focus:border-[#7C3AED]/50 focus:ring-1 focus:ring-[#7C3AED]/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm py-2">
                        <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              name="rememberMe"
                              checked={formData.rememberMe}
                              onChange={handleChange}
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded border border-white/20 bg-[#1A1A1A] group-hover:border-[#7C3AED] transition-colors text-[#7C3AED] focus:ring-[#7C3AED]"
                            />
                            <span className="text-gray-400 group-hover:text-gray-300 transition-colors text-xs sm:text-sm">Remember me</span>
                        </label>
                        <a href="#" className="text-[#7C3AED] hover:text-[#6D28D9] font-medium transition-colors text-xs sm:text-sm whitespace-nowrap">Forgot password?</a>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-3.5 md:py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                        <ArrowRight size={14} className="sm:hidden" />
                        <ArrowRight size={16} className="hidden sm:block" />
                    </button>
                </form>


                <p className="mt-4 sm:mt-5 md:mt-6 text-center text-xs sm:text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-white font-medium hover:text-[#7C3AED] transition-colors">Sign up for free</Link>
                </p>
            </div>
        </div>
        
        {/* 3. Footer Links */}
        <div className="flex-none flex gap-4 sm:gap-6 text-[9px] sm:text-[10px] md:text-xs text-gray-600 xl:absolute xl:bottom-6 xl:left-12 2xl:bottom-8 2xl:left-16 justify-center xl:justify-start">
           <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
           <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
        </div>
      </div>

      {/* --- RIGHT SIDE: VISUAL (Hidden on Mobile/Tablet) --- */}
      <div className="hidden xl:flex w-1/2 relative bg-[#0A0A0A] items-center justify-center p-8 lg:p-10 xl:p-12 overflow-hidden border-l border-white/5">
         
         {/* Background Effects */}
         <div className="absolute inset-0 bg-dot-pattern opacity-[0.03]" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7C3AED]/10 blur-[120px] rounded-full" />
         
         {/* Floating Card Visual */}
         <div className="relative w-full max-w-lg">
            {/* Main Glass Card */}
            <div className="relative bg-[#111]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#7C3AED] flex items-center justify-center text-white shadow-lg">
                     <Zap size={24} fill="white" />
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-white">Supernova Intelligence</h3>
                     <p className="text-sm text-[#7C3AED]">Data Verification Platform</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                  {[
                     { label: "Data Integrity Check", status: "Verified", time: "Just now" },
                     { label: "Source Authentication", status: "Verified", time: "2m ago" },
                     { label: "Cross-Reference Scan", status: "Processing...", time: "1m ago" }
                  ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                           <span className="text-sm text-gray-300">{item.label}</span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">{item.time}</span>
                     </div>
                  ))}
               </div>

               <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-gray-400 text-sm italic">
                     "The most reliable tool we've used for verifying complex data streams in real-time."
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-gray-600" />
                     <span className="text-xs text-gray-500">Product Team, TechFlow</span>
                  </div>
               </div>
            </div>

            {/* Decorative Floating Elements */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#7C3AED] rounded-2xl opacity-20 blur-xl animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-600 rounded-full opacity-20 blur-2xl" />
         </div>

      </div>

    </div>
  );
}