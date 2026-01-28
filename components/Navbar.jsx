"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Shield, User, LogOut, ChevronDown, Bell } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/user', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setUser(null);
        setIsProfileMenuOpen(false);
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = user ? [
    { name: 'Dashboard', href: '/main' },
    { name: 'OCR Processing', href: '/fir-upload' },
    { name: 'FIR Atlas', href: '/main/fra-atlas' },
    { name: 'Chat', href: '/chat' },
    { name: 'Pattern Analysis', href: '/officer-dss' },
    { name: 'Resource Allocation', href: '/resource-allocation' },
    { name: 'Claimant', href: '/claimant' },
  ] : [
    { name: 'Dashboard', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Support', href: '/contact' },
    { name: 'Protocols', href: '/faq' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO SECTION */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => router.push(user ? '/main' : '/')}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-xl transition-all duration-300 group-hover:bg-green-600 group-hover:rotate-[10deg]">
              <Shield size={22} strokeWidth={2.5} />
            </div>
            {/* Pulsing Status Dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-gray-900 uppercase leading-none">SafeCity</span>
            <span className="text-[9px] font-bold text-green-600 tracking-[0.2em] uppercase leading-none mt-1">Intelligence v2.5</span>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-200 ${
                pathname === link.href ? 'text-green-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* AUTH / PROFILE SECTION */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="animate-pulse bg-gray-100 h-10 w-28 rounded-xl"></div>
          ) : user ? (
            <div className="flex items-center gap-3 profile-menu-container">
              {/* Notification Bell (Tactical addition) */}
              <button className="p-2 text-gray-400 hover:text-green-600 transition-colors hidden sm:block">
                <Bell size={18} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-green-200 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0)
                    )}
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 py-2 overflow-hidden animate-fadeIn">
                    <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 mb-1">
                      <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Active Operator</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    </div>
                    <Link href="/profile" className="flex items-center px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors">
                      <User size={14} className="mr-3" /> COMMAND PROFILE
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50">
                      <LogOut size={14} className="mr-3" /> TERMINATE SESSION
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="bg-gray-900 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-lg hover:-translate-y-0.5"
            >
              Authorization
            </button>
          )}

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-900"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-2xl animate-fadeIn p-6">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-black uppercase tracking-[0.2em] text-gray-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px]"
              >
                Login to System
              </button>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </nav>
  );
};

export default Navbar;