"use client";
import React from 'react';
import { Search, Cpu, BarChart2, Shield } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            id: "01",
            title: "Data Collection",
            subtitle: "Smart Data Intake",
            icon: Search,
            description: "Automated FIR processing, multi-source data integration, quality validation & real-time streaming.",
            color: "blue"
        },
        {
            id: "02",
            title: "AI Analysis",
            subtitle: "Intelligent Processing",
            icon: Cpu,
            description: "Machine learning pattern recognition, hotspot identification, bias detection & resource optimization.",
            color: "purple"
        },
        {
            id: "03",
            title: "Actionable Intelligence",
            subtitle: "Smart Recommendations",
            icon: BarChart2,
            description: "Real-time hotspot mapping, patrol deployment optimization, emergency coordination & analytics.",
            color: "indigo"
        },
        {
            id: "04",
            title: "Field Execution",
            subtitle: "Mobile Operations",
            icon: Shield,
            description: "Officer mobile app deployment, GPS-enabled tracking, incident reporting & backup coordination.",
            color: "green"
        }
    ];

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 lg:px-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                        Simple Process, <span className="text-indigo-600">Powerful Results</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Our end-to-end workflow transforms raw data into field-ready intelligence in seconds.
                    </p>
                </div>

                <div className="relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-${step.color}-50 text-${step.color}-600 group-hover:bg-${step.color}-600 group-hover:text-white transition-colors duration-300`}>
                                    <step.icon className="w-7 h-7" />
                                </div>

                                <div className="absolute top-6 right-6 text-4xl font-bold text-gray-100 select-none group-hover:text-gray-50 transition-colors">
                                    {step.id}
                                </div>

                                <h4 className="text-sm font-semibold text-indigo-600 mb-2 uppercase tracking-wider">{step.subtitle}</h4>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
