"use client";
import React from 'react';

export default function TechStack() {
    const categories = [
        {
            title: "Artificial Intelligence",
            icon: "🤖",
            items: [
                { name: "Machine Learning", desc: "RandomForest, Gradient Boosting, DBSCAN" },
                { name: "Deep Learning", desc: "Neural Networks for pattern recognition" },
                { name: "Bias Detection", desc: "Fairness algorithms & equity monitoring" },
                { name: "Natural Language", desc: "Multi-language processing capabilities" }
            ]
        },
        {
            title: "Data & Analytics",
            icon: "📊",
            items: [
                { name: "Real-time Processing", desc: "Stream processing for live updates" },
                { name: "Geospatial Analysis", desc: "Advanced GIS and mapping algorithms" },
                { name: "Predictive Modeling", desc: "Statistical forecasting with confidence intervals" },
                { name: "Performance Metrics", desc: "KPI tracking and optimization analytics" }
            ]
        },
        {
            title: "Platform Architecture",
            icon: "💻",
            items: [
                { name: "Cloud-Native", desc: "Scalable microservices architecture" },
                { name: "Mobile-First", desc: "PWA with offline capability" },
                { name: "API-Driven", desc: "RESTful services for integration" },
                { name: "Security", desc: "End-to-end encryption and audit trails" }
            ]
        }
    ];

    return (
        <section className="py-20 bg-slate-900 text-white">
            <div className="container mx-auto px-4 md:px-8 lg:px-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Built with <span className="text-green-400">Cutting-Edge Technology</span>
                    </h2>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        Leveraging the latest in AI, cloud computing, and data science to deliver a robust, scalable policing platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((category, idx) => (
                        <div key={idx} className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-green-500/50 transition-colors">
                            <div className="text-4xl mb-6">{category.icon}</div>
                            <h3 className="text-2xl font-bold mb-8">{category.title}</h3>

                            <div className="space-y-6">
                                {category.items.map((item, i) => (
                                    <div key={i} className="group">
                                        <h4 className="text-lg font-semibold text-green-400 mb-1 group-hover:text-green-300 transition-colors">
                                            {item.name}
                                        </h4>
                                        <p className="text-sm text-slate-400 leading-snug">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
