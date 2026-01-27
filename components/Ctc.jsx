"use client";
import React from "react";
import { ArrowRight, Phone, Mail, MapPin, ShieldCheck, Lock } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 bg-green-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div style={{ backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)", backgroundSize: "30px 30px" }} className="w-full h-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to Build a <span className="text-green-200">Safer City?</span>
          </h2>
          <p className="text-xl md:text-2xl text-green-50 mb-8 font-medium">
            Join the prediction revolution. Schedule a personalized demo for your department today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-white text-green-700 font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-green-50 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
              Book a Live Demo
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-green-700 text-white font-bold py-4 px-8 rounded-lg border border-green-500 hover:bg-green-800 transition-all duration-300 flex items-center justify-center gap-2">
              Calculate ROI
            </button>
          </div>
        </div>

        {/* Contact Info & Security Badge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Details */}
          <div className="bg-green-700/50 backdrop-blur-sm p-8 rounded-2xl border border-green-500">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5" /> Contact Us
            </h3>
            <div className="space-y-4 text-green-50">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-800 rounded-lg"><MapPin className="w-5 h-5 text-green-300" /></div>
                <div>
                  <p className="font-semibold text-white">Headquarters</p>
                  <p className="text-sm">Tech Park, Sector 5, Bengaluru, Karnataka - 560091</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-800 rounded-lg"><Phone className="w-5 h-5 text-green-300" /></div>
                <div>
                  <p className="font-semibold text-white">Sales & Support</p>
                  <p className="text-sm">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-800 rounded-lg"><Mail className="w-5 h-5 text-green-300" /></div>
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <p className="text-sm">contact@safecity.ai</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-xl">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <ShieldCheck className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Government Certified Security</h3>
            <div className="flex items-center gap-2 text-gray-600 mb-4 bg-gray-50 px-3 py-1 rounded-full text-sm">
              <Lock className="w-4 h-4" /> End-to-End Encrypted
            </div>
            <p className="text-gray-500 text-sm mb-6">
              MeghRaj Cloud Certified • ISO 27001 • AES-256 Encryption
            </p>
            <div className="flex gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
              <img src="/images/Logo_2.png" alt="Cert 1" className="h-8" />
              <img src="/images/Logo_5.png" alt="Cert 2" className="h-8" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CTA;