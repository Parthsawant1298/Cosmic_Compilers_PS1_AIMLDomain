'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Shield,
    Map,
    FileText,
    AlertTriangle,
    BarChart3,
    ArrowRight,
    Activity,
    Users,
    ChevronRight,
    LayoutDashboard
} from 'lucide-react';
import Navbar from './Navbar'; // Assuming Navbar is in the same directory

const MainPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/auth/user');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const tools = [
        {
            title: "Patrol Processing",
            description: "Manage and optimize patrol routes based on real-time data.",
            icon: <Shield className="h-6 w-6 text-green-500" />,
            href: "/access-portal/district-officer",
            color: "hover:border-green-500/50"
        },
        {
            title: "Crime Atlas",
            description: "Visual heatmaps and geospatial analysis of crime incidents.",
            icon: <Map className="h-6 w-6 text-green-500" />,
            href: "/access-portal/crime-atlas",
            color: "hover:border-green-500/50"
        },
        {
            title: "DSS Recommendations",
            description: "AI-driven decision support for resource allocation.",
            icon: <Activity className="h-6 w-6 text-green-500" />,
            href: "/officer-dss",
            color: "hover:border-green-500/50"
        },
        {
            title: "Scheme Analysis",
            description: "Analyze government schemes and eligibility matches.",
            icon: <BarChart3 className="h-6 w-6 text-green-500" />,
            href: "/scheme-analysis",
            color: "hover:border-green-500/50"
        },
        {
            title: "Incident Database",
            description: "Access and manage detailed crime reports and claims.",
            icon: <FileText className="h-6 w-6 text-green-500" />,
            href: "/claimant",
            color: "hover:border-green-500/50"
        },
        {
            title: "Emergency Response",
            description: "Coordinate rapid response teams (Coming Soon).",
            icon: <AlertTriangle className="h-6 w-6 text-slate-400" />,
            href: "#",
            color: "opacity-60 cursor-not-allowed"
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    <p className="text-green-500 text-xs font-black tracking-widest uppercase">Initializing Command...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* 1. TACTICAL HERO HEADER */}
            <section className="relative pt-32 pb-24 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 opacity-10" 
                     style={{ backgroundImage: `linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                System Dashboard v2.0
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                                WELCOME, <span className="text-green-500 italic">{user?.name?.split(' ')[0] || 'OFFICER'}</span>
                            </h1>
                            <p className="text-slate-400 text-lg font-light max-w-xl">
                                Central Intelligence Interface for real-time monitoring and resource deployment.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl min-w-[140px]">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Risk Status</p>
                                <p className="text-2xl font-black text-green-500">SECURE</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl min-w-[140px]">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Units</p>
                                <p className="text-2xl font-black text-white tracking-tighter">24 <span className="text-xs text-slate-500">Deployed</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. COMMAND TOOLS GRID */}
            <section className="py-16 px-6 max-w-7xl mx-auto -mt-12 relative z-20">
                <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                   <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                        <LayoutDashboard className="w-4 h-4 text-green-600" />
                        Operation Modules
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Feed Active</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, index) => (
                        <Link
                            key={index}
                            href={tool.href}
                            className={`group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-1 ${tool.color}`}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-green-50 group-hover:scale-110 transition-all duration-500">
                                    {tool.icon}
                                </div>
                                <div className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-green-600 group-hover:text-white transition-all">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight uppercase">{tool.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">{tool.description}</p>
                        </Link>
                    ))}
                </div>

                {/* 3. RECENT ACTIVITY LOG */}
                <div className="mt-16 bg-slate-950 rounded-[3rem] p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] rounded-full"></div>
                    
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <h2 className="text-xl font-black text-white tracking-tighter flex items-center gap-3 uppercase">
                            <Activity className="w-5 h-5 text-green-500" />
                            System Intelligence Log
                        </h2>
                        <button className="text-[10px] font-black text-green-500 uppercase tracking-widest hover:text-white transition-colors">
                            View Full Archive
                        </button>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {[
                            { msg: "Predictive model updated for Central District", time: "2m ago", conf: "94%" },
                            { msg: "Resource allocation optimized: Zone B4", time: "14m ago", conf: "88%" },
                            { msg: "New incident record synchronized via CCTNS", time: "1h ago", conf: "100%" }
                        ].map((log, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                                <div className="flex items-center gap-6">
                                    <span className="text-[10px] font-mono text-slate-600">0{i+1}</span>
                                    <div>
                                        <p className="text-sm font-bold text-slate-200 group-hover:text-green-400 transition-colors">{log.msg}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">{log.time} • Confidence Score: {log.conf}</p>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 px-4 py-1 rounded-md border border-white/10 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                    Status: Verified
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MainPage;