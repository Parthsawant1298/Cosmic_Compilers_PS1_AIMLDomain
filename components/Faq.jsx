"use client";
import React, { useState } from "react";
import Testimonials from "@/components/Testimonial";
import { Plus, Minus, Cpu, Shield, Lock, UserCheck, HelpCircle, Activity } from "lucide-react";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      category: "Core Intelligence",
      icon: <Cpu className="w-5 h-5" />,
      question: "How does the AI actually predict crime hotspots?",
      answer: "Our engine uses Spatio-Temporal Propagation. It analyzes 10+ years of historical FIR data, weather patterns, local events, and socio-economic indicators. It doesn't just look at where crime happened, but 'why' and 'when' the conditions are right for it to happen again."
    },
    {
      category: "Performance",
      icon: <Activity className="w-5 h-5" />,
      question: "How accurate are these predictions in a real-world setting?",
      answer: "In our latest deployments, we achieved an 87% accuracy rate. This means that 8.7 times out of 10, the high-risk zones identified by SafeCity actually saw a crime incident or suspicious activity that was prevented by proactive patrol presence."
    },
    {
      category: "Ethics & Integrity",
      icon: <UserCheck className="w-5 h-5" />,
      question: "How do you ensure the AI doesn't introduce systemic bias?",
      answer: "We use 'Double-Blind' algorithmic training. We intentionally exclude sensitive demographic data from the training set. Furthermore, our 'Fairness Audit' tool flags any predictive clustering that seems to deviate from purely criminal patterns to ensure equitable policing."
    },
    {
      category: "Security Protocol",
      icon: <Lock className="w-5 h-5" />,
      question: "Is sensitive police data safe on your servers?",
      answer: "Data is protected by AES-256 military-grade encryption. We offer 'On-Premise' deployment for sensitive departments, meaning the data stays on your physical police headquarters' servers and never touches the public cloud."
    },
    {
      category: "Interoperability",
      icon: <Shield className="w-5 h-5" />,
      question: "Can this work with our existing Dial 100/112 systems?",
      answer: "Yes. SafeCity features a 'Universal API' that plugs directly into existing Emergency Response Support Systems (ERSS), CCTV networks, and legacy CCTNS databases without requiring a hardware overhaul."
    },
    {
      category: "Field Readiness",
      icon: <Activity className="w-5 h-5" />,
      question: "Does the mobile app work in low-connectivity areas?",
      answer: "Absolutely. The SafeCity mobile app is designed for field use. It functions fully offline, allowing officers to access predicted maps and file reports, syncing automatically once connectivity is restored."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. HERO SECTION (As requested) */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: `linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)`, backgroundSize: '50px 50px' }}></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-[0.2em]">
              Intelligence Briefing 01
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
              DATA TO <span className="text-green-500 italic">DEFENSE.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-2xl max-w-3xl font-light leading-relaxed">
              We are a team of data scientists and law enforcement experts building 
              the infrastructure for a crime-free tomorrow.
            </p>
          </div>
        </div>
      </section>

      {/* 2. LOGICAL FAQ DOSSIER */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Deployment & Support FAQ</h2>
          <div className="h-1 w-12 bg-green-500 mx-auto mt-4"></div>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`transition-all duration-300 rounded-2xl bg-white border ${
                openIndex === index 
                ? "border-green-500 shadow-xl shadow-green-100/30" 
                : "border-slate-200 hover:border-green-200 shadow-sm"
              }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-start justify-between p-6 text-left focus:outline-none"
              >
                <div className="flex gap-4">
                  <div className={`mt-1 p-2 rounded-lg transition-colors ${
                    openIndex === index ? "bg-green-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {faq.icon}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                      {faq.category}
                    </span>
                    <h3 className={`text-xl font-bold ${openIndex === index ? "text-slate-900" : "text-slate-700"}`}>
                      {faq.question}
                    </h3>
                  </div>
                </div>
                
                <div className={`mt-2 p-1 rounded-full transition-all ${
                  openIndex === index ? "bg-green-100 text-green-600 rotate-180" : "bg-slate-50 text-slate-400"
                }`}>
                  {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-8 ml-14">
                  <div className="h-px bg-slate-100 w-full mb-6" />
                  <p className="text-slate-600 text-lg leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FINAL TECH SUPPORT BLOCK */}
      {/* <section className="pb-24 px-6 text-center max-w-3xl mx-auto">
        <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
          <HelpCircle className="mx-auto mb-4 text-green-500" size={40} />
          <h2 className="text-2xl font-bold mb-4 tracking-tight">Additional Briefing Required?</h2>
          <p className="text-slate-400 mb-8">
            For department-specific API integration or to schedule a field pilot, 
            contact our intelligence support team.
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl font-bold transition-all">
            Secure Support Channel
          </button>
        </div>
      </section> */}
    </div>
  );
};

export default FAQPage;