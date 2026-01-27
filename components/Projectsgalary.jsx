"use client";
import React from 'react';
import { Building2, MousePointer, Siren, Home } from 'lucide-react';

export default function ProjectGallery() {
  const useCases = [
    {
      title: "Urban Crime Prevention",
      subtitle: "Smart City Safety",
      description: "Monitor high-density areas like markets and transport hubs. Predict and prevent theft, assault, and fraud incidents.",
      icon: Building2,
      image: "/images/smart_city.jpg",
      points: [
        "Optimize patrol routes for maximum coverage",
        "Coordinate emergency response across multiple zones",
        "Real-time crowd monitoring"
      ],
      color: "blue"
    },
    {
      title: "Traffic Safety Management",
      subtitle: "Accident Prevention",
      description: "Identify accident-prone intersections and highways. Weather-based risk assessment and emergency response optimization.",
      icon: MousePointer,
      image: "/images/traffic_safety.jpg",
      points: [
        "Emergency response optimization",
        "Integration with traffic management systems",
        "Predictive accident hotspotting"
      ],
      color: "amber"
    },
    {
      title: "Community Policing",
      subtitle: "Neighborhood Safety",
      description: "Local crime pattern analysis and prevention. Community engagement through mobile reporting and feedback loops.",
      icon: Home,
      image: "/images/community.jpg",
      points: [
        "Bias-free policing in diverse communities",
        "Trust-building through transparent operations",
        "Direct citizen-police connection"
      ],
      color: "green"
    },
    {
      title: "Emergency Response",
      subtitle: "Crisis Management",
      description: "Real-time emergency alert coordination and multi-agency response optimization for critical incidents.",
      icon: Siren,
      image: "/images/emergency.jpg",
      points: [
        "Officer safety and backup management",
        "Critical incident tracking and resolution",
        "Multi-agency command center"
      ],
      color: "red"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Real-World <span className="text-green-600">Applications</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how SafeCity adapts to diverse policing scenarios to ensure safety everywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={useCase.image}
                  alt={useCase.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${useCase.color}-500/20 backdrop-blur-md border border-${useCase.color}-400/30 text-${useCase.color}-100 text-xs font-semibold mb-3 w-fit`}>
                    <useCase.icon className="w-3 h-3" />
                    {useCase.subtitle}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{useCase.title}</h3>
                  <p className="text-gray-200 text-sm line-clamp-2">{useCase.description}</p>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Key Benefits</h4>
                <ul className="space-y-2">
                  {useCase.points.map((point, i) => (
                    <li key={i} className="flex items-start text-gray-600 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2 flex-shrink-0"></div>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
