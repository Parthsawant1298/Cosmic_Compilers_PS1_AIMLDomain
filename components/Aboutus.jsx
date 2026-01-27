"use client";
import React from 'react';
import Testimonials from "@/components/Testimonial";
import { Shield, Brain, Zap, Fingerprint, Map, Users, BarChart } from "lucide-react";

export default function RedesignedAboutUs() {
  return (
    <div className="bg-white text-slate-900 font-sans">
      
      {/* 1. IMPERATIVE HERO SECTION */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: `radial-gradient(#22c55e 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-bold tracking-widest uppercase mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            The Future of Public Safety
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tight">
            DECODING <span className="text-green-500">CRIME</span><br/>
            BEFORE IT HAPPENS.
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Tribal Connect isn't just a software company. We are a collective of data scientists, 
            former law enforcement officers, and engineers building the world’s most accurate 
            predictive policing engine.
          </p>
        </div>
      </section>

      {/* 2. THE PROBLEM & SOLUTION (Split Section) */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold tracking-tight">
              Why we exist: <br/>
              <span className="text-slate-400">Reactive policing is no longer enough.</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
                  <Fingerprint size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">The Legacy Problem</h4>
                  <p className="text-slate-600">Police departments are overwhelmed by fragmented data, leading to delayed response times and resource exhaustion.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                  <Brain size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-green-700">The AI Evolution</h4>
                  <p className="text-slate-600">We transform raw incident reports into a living "Crime Map" that updates every 2 seconds to predict high-risk clusters.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-green-500/10 rounded-full blur-3xl"></div>
            
          </div>
        </div>
      </section>

      {/* 3. CORE PILLARS (The "How It Works") */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Technology Stack</h2>
            <p className="text-slate-500">Built on three pillars of modern intelligence.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Map className="text-green-500" />, 
                title: "Spatial Intelligence", 
                desc: "Real-time mapping of terrain, socioeconomic factors, and historical patterns to identify 'hot-zones'." 
              },
              { 
                icon: <Zap className="text-green-500" />, 
                title: "Temporal Prediction", 
                desc: "Forecasting not just where, but WHEN. Our model predicts crime windows within a 2-hour accuracy margin." 
              },
              { 
                icon: <Shield className="text-green-500" />, 
                title: "Resource Optimization", 
                desc: "Automatically suggesting patrol routes that maximize visibility while minimizing fuel and time waste." 
              }
            ].map((pillar, idx) => (
              <div key={idx} className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="mb-6">{pillar.icon}</div>
                <h3 className="text-xl font-bold mb-4">{pillar.title}</h3>
                <p className="text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE IMPACT (Statistics Section) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-slate-950 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 blur-[120px]"></div>
             
             <div className="grid md:grid-cols-2 gap-12 items-center">
               <div>
                 <h2 className="text-4xl font-bold mb-6">Quantifiable Safety.</h2>
                 <p className="text-slate-400 mb-8">Our platform has been pressure-tested across diverse urban landscapes, delivering results that redefine department KPIs.</p>
                 <button className="bg-green-500 hover:bg-green-600 text-slate-950 font-bold px-8 py-4 rounded-full transition-colors">
                   Download Impact Report
                 </button>
               </div>
               <div className="grid grid-cols-2 gap-8">
                 <div className="border-l-2 border-green-500 pl-6">
                   <div className="text-4xl font-black mb-1">87%</div>
                   <div className="text-slate-500 text-sm uppercase tracking-widest">Prediction Accuracy</div>
                 </div>
                 <div className="border-l-2 border-green-500 pl-6">
                   <div className="text-4xl font-black mb-1">23%</div>
                   <div className="text-slate-500 text-sm uppercase tracking-widest">Crime Reduction</div>
                 </div>
                 <div className="border-l-2 border-green-500 pl-6">
                   <div className="text-4xl font-black mb-1">30%</div>
                   <div className="text-slate-500 text-sm uppercase tracking-widest">Resource Savings</div>
                 </div>
                 <div className="border-l-2 border-green-500 pl-6">
                   <div className="text-4xl font-black mb-1">15K+</div>
                   <div className="text-slate-500 text-sm uppercase tracking-widest">Stations Ready</div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. TEAM/VALUES SECTION */}
      <section className="py-24 container mx-auto px-6 text-center">
        <Users className="mx-auto text-green-500 mb-6" size={48} />
        <h2 className="text-4xl font-bold mb-12">Driven by Ethics & Evidence</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 text-left">
          <div className="space-y-4">
            <h4 className="font-bold text-xl">Privacy First</h4>
            <p className="text-slate-600 text-sm">Our AI models are built with strict adherence to data privacy laws. We anonymize personal identifiers to ensure policing is based on patterns, not profiling.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-xl">Unbiased Intelligence</h4>
            <p className="text-slate-600 text-sm">We use "Double-Blind" verification processes to ensure our algorithms do not inherit systemic human biases, promoting fair and just enforcement.</p>
          </div>
        </div>
      </section>

      <Testimonials />
    </div>
  );
}