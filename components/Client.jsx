"use client";
import React from 'react';

const ClientsSection = () => {
  const logos = [
    { name: "Government of India", src: "/images/Logo_1.png" },
    { name: "Ministry of Home Affairs", src: "/images/Logo_2.png" },
    { name: "Delhi Police", src: "/images/Logo_3.png" },
    { name: "Mumbai Police", src: "/images/Logo_4.png" },
    { name: "NCRB", src: "/images/Logo_5.png" },
    { name: "UP Police", src: "/images/Logo_6.png" },
    { name: "Karnataka State Police", src: "/images/Logo_7.png" },
    { name: "CCTNS", src: "/images/Logo_8.png" },
  ];

  return (
    <section className="py-12 bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-500 font-semibold uppercase tracking-widest mb-8 text-sm">
          Trusted by Premier Law Enforcement Agencies
        </p>

        <div className="relative overflow-hidden">
          {/* Gradient Masks */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

          <div className="flex gap-12 animate-scroll">
            {/* First Set */}
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-32 h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-12 max-w-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerText = logo.name; // Fallback text
                    e.target.parentElement.className = "flex-shrink-0 w-32 h-16 text-xs text-center font-bold text-gray-400 flex items-center justify-center border rounded";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default ClientsSection;
