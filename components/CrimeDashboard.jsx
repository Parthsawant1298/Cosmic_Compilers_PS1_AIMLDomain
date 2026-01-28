'use client';
import { useState, useEffect } from 'react';
import {
  Shield,
  Upload,
  Map,
  BarChart3,
  FileText,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Users,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function CrimeDashboard() {
  const [stats, setStats] = useState([]);
  const [recentFirs, setRecentFirs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, firsRes] = await Promise.all([
        fetch('http://localhost:8000/stats'),
        fetch('http://localhost:8000/firs/heatmap')
      ]);

      const statsData = await statsRes.json();
      const firsData = await firsRes.json();

      setStats(statsData);

      if (firsData.features) {
        // Get recent 5 FIRs
        const recent = firsData.features
          .sort((a, b) => new Date(b.properties.incident_date) - new Date(a.properties.incident_date))
          .slice(0, 5)
          .map(feature => feature.properties);
        setRecentFirs(recent);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Process FIR Documents',
      description: 'Upload and extract crime data from FIR images',
      icon: Upload,
      href: '/fir-upload',
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    {
      title: 'Crime Atlas',
      description: 'View interactive crime maps and analytics',
      icon: Map,
      href: '/main/fra-atlas',
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Crime statistics and trend analysis',
      icon: BarChart3,
      href: '/main/fra-atlas',
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                SafeCity Crime Intelligence Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Real-time crime monitoring, analysis, and predictive policing
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={`${action.color} ${action.hoverColor} p-6 rounded-xl text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}
            >
              <action.icon className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
              <p className="text-white/90 text-sm">{action.description}</p>
            </Link>
          ))}
        </div>

        {/* Crime Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Crime Stats */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Crime Statistics</h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="animate-pulse bg-gray-200 h-12 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={stat._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-red-500' :
                        index === 1 ? 'bg-orange-500' :
                        index === 2 ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`}></div>
                      <span className="font-medium text-gray-900">{stat._id}</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-700">{stat.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent FIRs */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Recent FIRs</h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentFirs.map((fir, index) => (
                  <div key={fir.fir_number || index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{fir.fir_number}</h4>
                        <p className="text-sm text-gray-600">{fir.crime_type}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        fir.status === 'Accused Arrested' ? 'bg-green-100 text-green-800' :
                        fir.status === 'Under Investigation' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {fir.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {fir.police_station}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {fir.incident_date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">OCR Service</span>
              </div>
              <span className="text-xs text-green-600">Online</span>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-800">Database</span>
              </div>
              <span className="text-xs text-blue-600">Connected</span>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-purple-800">Analytics</span>
              </div>
              <span className="text-xs text-purple-600">Processing</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-800">Mapping</span>
              </div>
              <span className="text-xs text-gray-600">Real-time</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Getting Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span className="font-medium text-blue-900">Upload FIR Documents</span>
              </div>
              <p className="text-blue-700">Use the OCR Processing feature to upload and extract data from FIR images automatically.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span className="font-medium text-blue-900">View Crime Maps</span>
              </div>
              <p className="text-blue-700">Access the Crime Atlas to visualize crime patterns, hotspots, and geographic distribution.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span className="font-medium text-blue-900">Analyze Trends</span>
              </div>
              <p className="text-blue-700">Use analytics dashboard to identify patterns and support predictive policing strategies.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}