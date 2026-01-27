"use client";
import React from 'react';
import { Globe, Cpu, Smartphone } from 'lucide-react';

export default function Services() {
  const solutions = [
    {
      title: "Command Dashboard",
      subtitle: "Real-time Crime Intelligence",
      icon: Globe,
      image: "/images/dashboard_screen.jpg",
      features: [
        "Live crime mapping with AI hotspots",
        "24-hour predictive analytics",
        "Resource optimization recommendations",
        "Emergency alert coordination",
        "Multi-hazard monitoring"
      ]
    },
    {
      title: "AI Engine",
      subtitle: "Advanced Machine Learning",
      icon: Cpu,
      image: "/images/ai_analysis.jpg",
      features: [
        "87% crime prediction accuracy",
        "Bias detection & mitigation",
        "Smart resource allocation",
        "Multi-language data processing",
        "Real-time pattern recognition"
      ]
    },
    {
      title: "Mobile App",
      subtitle: "Field Operations",
      icon: Smartphone,
      image: "/images/mobile_app.jpg",
      features: [
        "Offline FIR registration",
        "Voice recording & evidence upload",
        "GPS tracking & emergency alerts",
        "Multi-language support",
        "Automatic data synchronization"
      ]
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            SafeCity: <span className="text-green-600">Complete AI-Powered Policing Platform</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From crime prediction to fair deployment - one intelligent platform that transforms raw data into actionable intelligence while ensuring ethical AI practices.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={solution.image}
                  alt={solution.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <div className="flex items-center gap-3 text-white">
                    <div className="bg-green-600 p-2 rounded-lg">
                      <solution.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-none mb-1">{solution.title}</h3>
                      <p className="text-xs text-green-300 font-medium uppercase tracking-wider">{solution.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <ul className="space-y-3">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-600 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
