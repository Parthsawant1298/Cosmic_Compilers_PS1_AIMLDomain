"use client";
import React from 'react';
import { Target, Users, Shield, Award } from 'lucide-react';

const About = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Pioneering the Future of <span className="text-green-600">Public Safety</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded in 2024 by a team of former law enforcement officers and AI researchers, SafeCity was built with a single mission: to modernize policing without compromising on ethics.
              </p>
              <br />
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that every citizen deserves to feel safe, and every police officer deserves the best tools to do their job. Our platform bridges the gap between data science and street-level operations, creating safer, smarter cities for everyone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-green-50 rounded-lg text-green-600 mt-1">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Our Mission</h4>
                  <p className="text-gray-600 text-sm">To reduce crime through ethical AI and predictive intelligence.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-green-50 rounded-lg text-green-600 mt-1">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Our Promise</h4>
                  <p className="text-gray-600 text-sm">Bias-free algorithms and 100% data privacy compliance.</p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-6 py-2">
              <p className="text-xl font-bold text-gray-900 italic">
                "SafeCity isn't just software; it's a force multiplier for every officer on the street."
              </p>
              <p className="text-gray-500 mt-2 font-medium">– Dr. A.K. Verma, Chief Data Scientist</p>
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 mt-8">
              <img
                src="/images/about_1.jpg"
                alt="Team collaboration"
                className="rounded-2xl shadow-lg w-full h-64 object-cover"
                onError={(e) => { e.target.src = "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800"; }}
              />
              <div className="bg-green-600 rounded-2xl p-6 text-white text-center shadow-lg">
                <div className="text-4xl font-bold mb-1">50+</div>
                <div className="text-sm font-medium opacity-90">Data Scientists</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-2xl p-6 text-white text-center shadow-lg">
                <div className="text-4xl font-bold mb-1">12</div>
                <div className="text-sm font-medium opacity-90">Patents Filed</div>
              </div>
              <img
                src="/images/about_2.jpg"
                alt="Field operations"
                className="rounded-2xl shadow-lg w-full h-64 object-cover"
                onError={(e) => { e.target.src = "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800"; }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;