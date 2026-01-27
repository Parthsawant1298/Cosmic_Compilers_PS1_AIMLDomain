"use client";
import React from 'react';
import { AlertTriangle, Users, FileText, Scale } from 'lucide-react';

export default function ProblemStatement() {
    const stats = [
        {
            value: "66.4 LAKH",
            label: "CRIMES Registered in 2022",
            subtext: "+2.1% increase year-over-year",
            icon: AlertTriangle
        },
        {
            value: "152",
            label: "OFFICERS PER LAKH",
            subtext: "Below UN recommended 222",
            icon: Users
        },
        {
            value: "15,000+",
            label: "MANUAL STATIONS",
            subtext: "Using paper & inconsistent data",
            icon: FileText
        },
        {
            value: "BIAS",
            label: "AMPLIFICATION",
            subtext: "No fairness monitoring in AI",
            icon: Scale
        }
    ];

    const painPoints = [
        "Data Quality Crisis: Manual entry, inconsistent formats, language barriers",
        "Resource Shortage: Understaffed forces, poor patrol optimization",
        "Technology Gaps: Fragmented systems, no real-time intelligence",
        "Bias Issues: Algorithmic discrimination, over-policing in disadvantaged areas",
        "Response Delays: Slow investigation, poor emergency coordination"
    ];

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 md:px-8 lg:px-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                        The Challenge: India's Crime Crisis Needs <span className="text-red-600">Smart Solutions</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Law enforcement agencies face unprecedented challenges in managing crime with limited resources and outdated technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-red-500">
                            <stat.icon className="w-8 h-8 text-red-500 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                            <p className="font-semibold text-gray-800 mb-2">{stat.label}</p>
                            <p className="text-sm text-gray-500">{stat.subtext}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Critical Pain Points</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        {painPoints.map((point, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-red-500 mt-2.5 flex-shrink-0" />
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    <span className="font-semibold text-gray-900">{point.split(':')[0]}:</span>
                                    {point.split(':')[1]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
