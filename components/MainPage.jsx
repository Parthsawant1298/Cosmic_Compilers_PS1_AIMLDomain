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
    Users
} from 'lucide-react';

const MainPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user data
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
            icon: <Shield className="h-8 w-8 text-blue-500" />,
            href: "/access-portal/district-officer",
            color: "bg-blue-50 border-blue-100 hover:border-blue-300"
        },
        {
            title: "Crime Atlas",
            description: "Visual heatmaps and geospatial analysis of crime incidents.",
            icon: <Map className="h-8 w-8 text-green-500" />,
            href: "/access-portal/crime-atlas", // Assuming this path exists or will be renamed
            color: "bg-green-50 border-green-100 hover:border-green-300"
        },
        {
            title: "DSS Recommendations",
            description: "AI-driven decision support for resource allocation.",
            icon: <Activity className="h-8 w-8 text-purple-500" />,
            href: "/officer-dss",
            color: "bg-purple-50 border-purple-100 hover:border-purple-300"
        },
        {
            title: "Scheme Analysis",
            description: "Analyze government schemes and eligibility matches.",
            icon: <BarChart3 className="h-8 w-8 text-orange-500" />,
            href: "/scheme-analysis",
            color: "bg-orange-50 border-orange-100 hover:border-orange-300"
        },
        {
            title: "Incident Database",
            description: "Access and manage detailed crime reports and claims.",
            icon: <FileText className="h-8 w-8 text-red-500" />,
            href: "/claimant",
            color: "bg-red-50 border-red-100 hover:border-red-300"
        },
        {
            title: "Emergency Response",
            description: "Coordinate rapid response teams (Coming Soon).",
            icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />,
            href: "#",
            color: "bg-yellow-50 border-yellow-100 hover:border-yellow-300"
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Welcome Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Welcome back, {user?.name || 'Officer'}
                            </h1>
                            <p className="text-gray-600">
                                SafeCity Dashboard v2.0 • System Status: <span className="text-green-600 font-medium">Online</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 px-4 py-2 rounded-lg text-center">
                                <p className="text-sm text-green-800 font-medium">Risk Level</p>
                                <p className="text-xl font-bold text-green-600">Low</p>
                            </div>
                            <div className="bg-blue-100 px-4 py-2 rounded-lg text-center">
                                <p className="text-sm text-blue-800 font-medium">Active Units</p>
                                <p className="text-xl font-bold text-blue-600">24</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tools Grid */}
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Command Center Tools
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, index) => (
                        <Link
                            key={index}
                            href={tool.href}
                            className={`block p-6 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${tool.color}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-white rounded-lg shadow-sm">
                                    {tool.icon}
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.title}</h3>
                            <p className="text-gray-600 text-sm">{tool.description}</p>
                        </Link>
                    ))}
                </div>

                {/* Recent Activity (Placeholder) */}
                <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Recent System Activity
                    </h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">New crime report analyzed</p>
                                        <p className="text-xs text-gray-500">2 minutes ago • AI Confidence: 94%</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">ID: #RE-{4920 + i}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MainPage;
