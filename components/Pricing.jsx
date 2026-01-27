"use client";
import React, { useState } from 'react';
import { Check, ArrowRight, Calculator } from 'lucide-react';

export default function Pricing() {
    const [calculation, setCalculation] = useState({
        crimeReduction: 1.5,
        efficiencyGains: 0.8,
        manualWorkReduction: 0.7
    });

    const totalSavings = (calculation.crimeReduction + calculation.efficiencyGains + calculation.manualWorkReduction).toFixed(1);

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 md:px-8 lg:px-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                        Flexible Plans for <span className="text-green-600">Every Need</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose the right deployment model for your jurisdiction.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {/* Pilot Program */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow relative">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">PILOT PROGRAM</h3>
                        <p className="text-sm text-gray-500 mb-6">Perfect for Testing</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-gray-900">₹10 Lakhs</span>
                            <span className="text-gray-500">/ 3 months</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {['2-3 police stations', '50 officers training', 'Basic AI features', 'Mobile app access', '24/7 support'].map((item, i) => (
                                <li key={i} className="flex items-center text-gray-700">
                                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 rounded-lg border-2 border-green-600 text-green-600 font-semibold hover:bg-green-50 transition-colors">
                            Start Pilot
                        </button>
                    </div>

                    {/* City Deployment */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-500 transform md:-translate-y-4 relative z-10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                            MOST POPULAR
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">CITY DEPLOYMENT</h3>
                        <p className="text-sm text-gray-500 mb-6">Full City Coverage</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-gray-900">₹50 Lakhs</span>
                            <span className="text-gray-500">/ year</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {['Complete city coverage', 'Unlimited officers', 'Advanced AI & analytics', 'Custom integrations', 'Dedicated support'].map((item, i) => (
                                <li key={i} className="flex items-center text-gray-700">
                                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
                            Contact Sales
                        </button>
                    </div>

                    {/* State Rollout */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">STATE ROLLOUT</h3>
                        <p className="text-sm text-gray-500 mb-6">Enterprise Scale</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-gray-900">Custom</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {['State-wide deployment', 'Multi-city coordination', 'Premium features', 'Training programs', 'Strategic partnership'].map((item, i) => (
                                <li key={i} className="flex items-center text-gray-700">
                                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 rounded-lg border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-50 transition-colors">
                            Request Quote
                        </button>
                    </div>
                </div>

                {/* ROI Calculator */}
                <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 text-green-600 font-bold mb-4 bg-green-50 px-4 py-2 rounded-full">
                                <Calculator className="w-5 h-5" />
                                ROI Calculator
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-6">Calculate Your Potential Savings</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                    <span className="text-gray-700">Crime Reduction Impact</span>
                                    <span className="font-bold text-gray-900">₹1.5 Cr / yr</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                    <span className="text-gray-700">Operational Efficiency</span>
                                    <span className="font-bold text-gray-900">₹80 Lakhs / yr</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                    <span className="text-gray-700">Manual Work Reduction</span>
                                    <span className="font-bold text-gray-900">₹70 Lakhs / yr</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left bg-gradient-to-br from-green-600 to-green-800 p-8 rounded-2xl text-white">
                            <p className="text-green-100 mb-2">Total Expected Annual Savings</p>
                            <h4 className="text-5xl font-bold mb-6">₹{totalSavings} Cr</h4>
                            <p className="text-green-100 mb-8 text-sm">Expected ROI: 300% within 12 months based on standard city deployment metrics.</p>
                            <button className="bg-white text-green-700 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition-colors inline-flex items-center gap-2">
                                Download Full Report
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
