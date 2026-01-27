"use client";
import React from 'react';
import { Target, Scale, Smartphone, Zap, Globe, BarChart } from "lucide-react"

export default function Why() {
  const features = [
    {
      title: "Predictive Analytics",
      desc: "Forecast crime hotspots 24 hours in advance with 87% accuracy.",
      icon: Target
    },
    {
      title: "Bias-Free AI",
      desc: "Built-in bias detection & demographic fairness monitoring.",
      icon: Scale
    },
    {
      title: "Offline-First Mobile",
      desc: "Full capability even without internet connectivity.",
      icon: Smartphone
    },
    {
      title: "Real-Time Processing",
      desc: "<2 second response times for live updates.",
      icon: Zap
    },
    {
      title: "Multi-Language",
      desc: "English & Hindi interface tailored for Indian context.",
      icon: Globe
    },
    {
      title: "Resource Optimization",
      desc: "AI-optimized patrol routes for 28% better efficiency.",
      icon: BarChart
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Features That Make the <span className="text-green-600">Difference</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Advanced technology designed specifically for the unique challenges of Indian law enforcement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
