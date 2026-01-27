"use client";
import React, { useState } from "react";
import { Shield, Mail, Phone, Globe, Send, Target, Eye, Radio } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    badgeNumber: "",
    jurisdiction: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Intelligence Briefing Logged:", formData);
  };

  return (
    <div className="relative min-h-screen bg-white text-gray-900 overflow-hidden pt-32 pb-20">
      {/* --- BACKGROUND TACTICAL ELEMENTS --- */}
      <style jsx global>{`
        .bg-dot-pattern {
          background-image: radial-gradient(#16a34a 1.5px, transparent 1.5px);
          background-size: 32px 32px;
        }
      `}</style>
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.05] z-0" />
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-600/5 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4 z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* --- HEADER SECTION --- */}
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 font-black text-[10px] uppercase tracking-[0.25em] shadow-sm">
            <Radio size={14} className="text-green-600 animate-pulse" />
            Crime Intelligence Liaison Office
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter uppercase text-gray-900">
            Report <span className="text-green-600">Intel.</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
            Establish a secure connection with the SafeCity Command Suite for crime data 
            integration, threat analysis, and predictive deployment requests.
          </p>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto">
          
          {/* LEFT COLUMN: TACTICAL INFO */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-gray-50 border border-gray-100 p-8 rounded-3xl space-y-8">
              <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">
                Command <span className="text-green-600">Nodes</span>
              </h3>

              <div className="space-y-6">
                {[
                  { icon: Target, label: "Precision Ops", val: "Strategic Analysis Unit", sub: "Priority Crime Vectoring" },
                  { icon: Eye, label: "Surveillance Comms", val: "surveillance@safecity.gov.in", sub: "Live Feed & Pattern Requests" },
                  { icon: Globe, label: "Jurisdictional Range", val: "National Grid", sub: "Inter-agency Data Sync Active" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <div className="p-3 rounded-xl bg-white shadow-sm border border-gray-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                      <p className="text-lg font-bold text-gray-900">{item.val}</p>
                      <p className="text-xs text-gray-500">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* TACTICAL METRIC */}
              <div className="pt-6 border-t border-gray-200 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Network Load: <span className="text-gray-900">Normal</span> // <span className="text-green-600">Secure</span>
                </p>
              </div>
            </div>

            {/* ORIGINAL MAP DESIGN */}
            <div className="mt-6 sm:mt-8">
              <div 
                className="w-full h-64 sm:h-80 md:h-96 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg"
                style={{
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)'
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562064619232!2d77.2090212!3d28.6139391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b71db311542!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Command Center Locations"
                ></iframe>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CONTACT FORM */}
          <div className="lg:col-span-7 bg-white border border-gray-200 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-100/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Officer Name</label>
                  <input
                    type="text" name="firstName" placeholder="Full Name / Rank"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/10 focus:border-green-600 transition-all font-medium placeholder:text-gray-300"
                    onChange={handleInputChange} required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Badge / ID Number</label>
                  <input
                    type="text" name="badgeNumber" placeholder="Auth Code"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/10 focus:border-green-600 transition-all font-medium placeholder:text-gray-300"
                    onChange={handleInputChange} required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Department / Jurisdiction</label>
                <input
                  type="text" name="jurisdiction" placeholder="e.g. Metro Police Command"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/10 focus:border-green-600 transition-all font-medium placeholder:text-gray-300"
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Incident / Briefing Details</label>
                <textarea
                  name="message" rows={5} placeholder="State the nature of the crime report, data integration request, or threat intelligence briefing..."
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/10 focus:border-green-600 transition-all font-medium resize-none placeholder:text-gray-300"
                  onChange={handleInputChange} required
                />
              </div>

              <button
                type="submit"
                className="group w-full bg-gray-900 hover:bg-green-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-xs transition-all duration-500 shadow-xl shadow-gray-200 flex items-center justify-center gap-3"
              >
                Log Intel Briefing
                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* --- FOOTER STATUS --- */}
        <div className="mt-20 text-center">
          <p className="text-[9px] font-mono text-gray-300 uppercase tracking-widest">
            Protocol: SafeCity_Response_Admin // Node_{new Date().getFullYear()} // Encryption: AES-256
          </p>
        </div>
      </div>
    </div>
  );
}