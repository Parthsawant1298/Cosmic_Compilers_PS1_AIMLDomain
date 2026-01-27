"use client";
import { ArrowRight, Zap, Target, Activity, Shield, Globe } from "lucide-react";
import Link from "next/link";

// Tactical Button - Optimized for consistent sizing
function Button({ children, size, variant, className, ...props }) {
  const isOutline = variant === 'outline';

  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-xl font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap
        ${size === 'lg' ? 'px-8 py-4 md:px-10 md:py-5 text-xs' : 'px-5 py-2.5 text-[10px]'}
        ${isOutline 
          ? 'bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-50' 
          : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 hover:-translate-y-0.5'}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center bg-white text-gray-900 overflow-hidden py-12 md:py-20">
      
      {/* Light Tactical Background */}
      <style jsx global>{`
        .bg-dot-pattern {
          background-image: radial-gradient(#22c55e 1.5px, transparent 1.5px);
          background-size: 32px 32px;
        }
      `}</style>
      
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.06] z-0" />
      
      {/* Radial Accents - Adjusted for better containment */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-500/5 blur-[100px] rounded-full translate-x-1/4 -translate-y-1/4 z-0" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-green-600/5 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4 z-0" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        
          {/* 2. Main Headline - Tightened leading and spacing */}
          <div className="space-y-6 mb-10 mt-30">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase text-gray-900">
              Precise. <span className="text-green-600">Predictive.</span><br />
              Public Safety.
            </h1>
            <p className="text-gray-500 text-base md:text-lg lg:text-xl leading-snug max-w-2xl mx-auto font-medium tracking-tight">
              India's premier neural network for law enforcement. 
              Converting multi-vector data into <span className="text-green-600 font-bold uppercase italic tracking-normal">Actionable Intelligence</span>.
            </p>
          </div>

          {/* 3. CTA Buttons - Removed extra padding, fixed alignment */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
            <Link href="/demo" className="w-full sm:w-auto">
              <Button size="lg" variant="default" className="w-full">
                Enter Command Suite
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full">
                Jurisdiction Request
              </Button>
            </Link>
          </div>

          {/* 4. Stats Grid - Fixed centering and gap issues */}
          <div className="w-full border-t border-gray-100">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 md:gap-x-8">
                {[
                  { label: "Predictive Accuracy", val: "87%", icon: Target },
                  { label: "System Latency", val: "1.2ms", icon: Zap },
                  { label: "Active Nodes", val: "15.4K+", icon: Globe },
                  { label: "Prevention Rate", val: "23%", icon: Activity },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center group transition-transform hover:scale-105">
                    <div className="flex items-center justify-center p-3 rounded-2xl bg-green-50 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 mb-3">
                      <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <span className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter">{stat.val}</span>
                    <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-[0.15em] text-gray-400 mt-1">
                      {stat.label}
                    </span>
                  </div>
                ))}
             </div>
          </div>
          
          {/* 5. Minimal Footer - Fixed positioning */}
          <div className="text-[9px] font-mono text-gray-300 uppercase tracking-widest mt-16">
            Protocol: SafeCity_Admin // Secure_Node: {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </section>
  );
}