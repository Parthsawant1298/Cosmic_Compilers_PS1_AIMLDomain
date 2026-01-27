"use client";
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Zap, ArrowRight, Github, Chrome, Shield, Activity } from 'lucide-react';
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');
    if (message) {
      setSuccessMessage(message);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/main');
      } else {
        setError(data.error || 'Access Denied: Invalid Credentials');
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

      {/* --- LEFT SIDE: LOGIN FORM --- */}
      <div className="w-full xl:w-1/2 flex flex-col min-h-[100dvh] xl:h-screen px-4 sm:px-12 relative z-10 py-6">
        
        {/* Branding Small */}
        <div className="flex-none mb-12 xl:mb-0 xl:absolute xl:top-8 xl:left-12">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                    <Shield size={18} fill="white" className="text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight uppercase">SafeCity <span className="text-green-500 italic text-sm">Auth</span></span>
            </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
            <div className="max-w-[400px] w-full mx-auto">
                <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tighter uppercase">Personnel <span className="text-green-500">Login</span></h1>
                <p className="text-gray-400 mb-8 text-sm font-medium">Enter credentials to access the command dashboard.</p>

                {/* Social Login */}
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
                        <span className="bg-[#050505] px-4 text-gray-500 font-bold">Secure Channel</span>
                    </div>
                </div>

                {successMessage && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-4 text-center">
                    <p className="text-green-400 text-xs font-bold uppercase tracking-tight">{successMessage}</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4 text-center">
                    <p className="text-red-400 text-xs font-bold uppercase tracking-tight">{error}</p>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Registry Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input
                                type="email"
                                name="email"
                                placeholder="officer@safecity.gov"
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
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#0f0f0f] border border-white/5 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-green-500/50 transition-all placeholder:text-gray-700 font-bold"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-2 text-[10px] font-black uppercase tracking-widest">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-white/10 bg-[#111] text-green-600 focus:ring-green-500"
                            />
                            <span className="text-gray-500 group-hover:text-gray-300 transition-colors">Remember Session</span>
                        </label>
                        <a href="#" className="text-green-500 hover:text-green-400">Forgot Access?</a>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-800 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em]"
                    >
                        {isLoading ? 'Verifying...' : 'Establish Connection'}
                        <ArrowRight size={16} />
                    </button>
                </form>

                <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
                    Unauthorized access is monitored. <Link href="/register" className="text-white hover:text-green-500 transition-colors">Apply for clearance</Link>
                </p>
            </div>
        </div>
        
        <div className="flex-none flex gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-700 justify-center xl:justify-start">
           <a href="#" className="hover:text-green-500 transition-colors">Protocol</a>
           <a href="#" className="hover:text-green-500 transition-colors">Legal</a>
        </div>
      </div>

      {/* --- RIGHT SIDE: VISUAL TACTICAL DISPLAY --- */}
      <div className="hidden xl:flex w-1/2 relative bg-[#080808] items-center justify-center p-12 overflow-hidden border-l border-white/5">
         
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
                     <h3 className="text-xl font-black text-white tracking-tighter uppercase">SafeCity <span className="text-green-500 italic">OS</span></h3>
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500/60">Global Intelligence Grid</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                  {[
                      { label: "Neural Link Status", status: "Secure", color: "bg-green-500" },
                      { label: "Active Nodes", status: "24 Units", color: "bg-green-500" },
                      { label: "Resource Grid", status: "Syncing...", color: "bg-yellow-500 animate-pulse" }
                  ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center gap-3">
                           <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                           <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{item.label}</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">{item.status}</span>
                     </div>
                  ))}
               </div>

               <div className="mt-10 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-3 opacity-40">
                      <Activity size={16} className="text-green-500" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        Live System Pulse: 98.4ms
                      </p>
                  </div>
               </div>
            </div>

            {/* Tactical Accents */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
         </div>

      </div>

    </div>
  );
}