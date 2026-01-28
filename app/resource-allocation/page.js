"use client";
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Navbar from '@/components/Navbar';
import { 
  Shield, Users, Car, DollarSign, TrendingUp, AlertTriangle, 
  MapPin, Activity, ChevronRight, RefreshCw, Target, Zap 
} from 'lucide-react';
import { resourceAllocationData, budgetSummary, districtSummary, equipmentInventory } from '@/lib/resourceAllocationData';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FyYWtzaGltIiwiYSI6ImNtZXg2bWlxNjB3dmgyaXNkbTJ5dmIzemEifQ.I7tLL6rIWutt8ef9WpN-qg';

export default function ResourceAllocation() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [viewMode, setViewMode] = useState('all');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [72.8777, 19.0760],
      zoom: 11,
      pitch: 45,
      bearing: -17
    });

    map.current.on('load', () => {
      renderResourceMarkers();
    });

    return () => map.current?.remove();
  }, []);

  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      renderResourceMarkers();
    }
  }, [viewMode, filterDistrict]);

  const renderResourceMarkers = () => {
    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    let filteredData = resourceAllocationData;

    if (filterDistrict !== 'all') {
      filteredData = filteredData.filter(d => d.district === filterDistrict);
    }

    if (viewMode !== 'all') {
      const zoneTypeMap = {
        'stations': ['Borivali', 'Bandra', 'Andheri', 'Kurla', 'Ghatkopar'],
        'accidents': ['Accident Hotspot'],
        'checkpoints': ['Strategic Checkpoint'],
        'commercial': ['Commercial Hub'],
        'critical': ['Critical Infrastructure']
      };
      
      if (viewMode === 'stations') {
        filteredData = filteredData.filter(d => !d.zone_type);
      } else if (zoneTypeMap[viewMode]) {
        filteredData = filteredData.filter(d => 
          zoneTypeMap[viewMode].some(type => d.zone_type?.includes(type))
        );
      }
    }

    filteredData.forEach(resource => {
      const deficit = resource.recommended_officers - resource.officers;
      const efficiencyColor = resource.patrol_efficiency >= 80 ? '#10b981' : 
                             resource.patrol_efficiency >= 70 ? '#f59e0b' : '#ef4444';
      
      const markerColor = deficit > 15 ? '#ef4444' : deficit > 5 ? '#f59e0b' : '#10b981';

      const el = document.createElement('div');
      el.className = 'resource-marker';
      el.innerHTML = `
        <div class="flex flex-col items-center cursor-pointer group">
          <div class="relative">
            <div class="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-125" 
                 style="background: ${markerColor}; box-shadow: 0 0 20px ${markerColor}">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            ${deficit > 5 ? `<div class="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">!</div>` : ''}
          </div>
          <div class="mt-1 px-2 py-1 bg-black/90 rounded text-[8px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            ${resource.officers}/${resource.recommended_officers} Officers
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ 
        offset: 25, 
        closeButton: false, 
        maxWidth: '400px',
        className: 'resource-popup'
      }).setHTML(`
        <div class="p-0 overflow-hidden rounded-xl bg-[#0a0a0b] text-white border border-white/10 shadow-2xl">
          <div class="h-1.5 w-full" style="background: linear-gradient(90deg, ${markerColor}, ${efficiencyColor})"></div>
          <div class="p-5">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-sm font-black uppercase tracking-tight text-white">${resource.location}</h3>
                <p class="text-[10px] text-gray-400 font-medium mt-1">${resource.district} • ${resource.zone_type || 'Police Station'}</p>
              </div>
              <span class="px-2 py-1 rounded-lg text-[9px] font-black uppercase" style="background: ${markerColor}20; color: ${markerColor}">
                ${resource.crime_density} Crime
              </span>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="bg-white/5 p-3 rounded-lg border border-white/5">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[9px] text-gray-400 uppercase tracking-wider">Officers</span>
                  <svg class="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p class="text-xl font-black text-white">${resource.officers}</p>
                <p class="text-[9px] text-gray-400 mt-1">Need: <span class="text-orange-400 font-bold">${resource.recommended_officers}</span> (${deficit > 0 ? '-' : '+'}${Math.abs(deficit)})</p>
              </div>

              <div class="bg-white/5 p-3 rounded-lg border border-white/5">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[9px] text-gray-400 uppercase tracking-wider">Vehicles</span>
                  <svg class="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <p class="text-xl font-black text-white">${resource.vehicles}</p>
                <p class="text-[9px] text-gray-400 mt-1">Need: <span class="text-orange-400 font-bold">${resource.recommended_vehicles}</span></p>
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                <span class="text-[9px] text-gray-400 uppercase tracking-wider">Budget Allocated</span>
                <span class="text-xs font-black text-green-400">₹${(resource.budget / 100000).toFixed(1)}L</span>
              </div>
              <div class="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                <span class="text-[9px] text-gray-400 uppercase tracking-wider">Equipment Score</span>
                <span class="text-xs font-black text-blue-400">${resource.equipment_score}/100</span>
              </div>
              <div class="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                <span class="text-[9px] text-gray-400 uppercase tracking-wider">Patrol Efficiency</span>
                <div class="flex items-center gap-2">
                  <div class="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div class="h-full transition-all duration-500" style="width: ${resource.patrol_efficiency}%; background: ${efficiencyColor}"></div>
                  </div>
                  <span class="text-xs font-black" style="color: ${efficiencyColor}">${resource.patrol_efficiency}%</span>
                </div>
              </div>
            </div>

            ${deficit > 5 ? `
            <div class="mt-4 p-3 bg-red-600/10 border border-red-600/20 rounded-lg">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p class="text-[10px] font-bold text-red-400 uppercase tracking-wide">Critical Shortage</p>
                  <p class="text-[9px] text-gray-400 mt-1">Immediate deployment of ${deficit} officers recommended</p>
                </div>
              </div>
            </div>
            ` : ''}
          </div>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([resource.longitude, resource.latitude])
        .setPopup(popup)
        .addTo(map.current);

      el.addEventListener('click', () => setSelectedZone(resource));
      markersRef.current.push(marker);
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <div className="pt-24 px-6 pb-6">
        {/* Header */}
        <div className="max-w-[1800px] mx-auto mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Shield className="text-blue-600" size={36} />
                Resource Allocation Command
              </h1>
              <p className="text-slate-500 font-medium mt-2">Police Force Distribution & Budget Optimization Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-600 animate-pulse" />
                <span className="text-xs font-black text-green-600 uppercase tracking-wider">System Active</span>
              </div>
              <button className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm">
                <RefreshCw className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Budget Overview Cards */}
        <div className="max-w-[1800px] mx-auto mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <DollarSign className="w-8 h-8 text-blue-600" />
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Total Budget</span>
              </div>
              <p className="text-3xl font-black text-slate-900">₹{(budgetSummary.total_budget / 10000000).toFixed(1)}Cr</p>
              <p className="text-xs text-slate-500 mt-1">Allocated: ₹{(budgetSummary.allocated / 10000000).toFixed(1)}Cr ({((budgetSummary.allocated / budgetSummary.total_budget) * 100).toFixed(1)}%)</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-8 h-8 text-green-600" />
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Officers</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{budgetSummary.total_officers}</p>
              <p className="text-xs text-red-600 mt-1 font-bold">Deficit: {budgetSummary.officer_deficit} officers needed</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <Car className="w-8 h-8 text-purple-600" />
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Vehicles</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{budgetSummary.total_vehicles}</p>
              <p className="text-xs text-orange-600 mt-1 font-bold">Need: {budgetSummary.vehicle_deficit} more vehicles</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="w-8 h-8 text-amber-600" />
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Avg Efficiency</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{budgetSummary.average_efficiency}%</p>
              <p className="text-xs text-slate-500 mt-1">Across all {resourceAllocationData.length} zones</p>
            </div>
          </div>
        </div>

        <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Resource Distribution Map</h2>
                <div className="flex gap-2">
                  {['all', 'stations', 'accidents', 'checkpoints', 'commercial', 'critical'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                        viewMode === mode 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              <div ref={mapContainer} className="h-[600px] w-full" />
            </div>

            {/* District Summary */}
            <div className="mt-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-4">District-wise Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {districtSummary.map(district => (
                  <div key={district.district} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:bg-white hover:shadow-md transition-all cursor-pointer"
                       onClick={() => setFilterDistrict(filterDistrict === district.district ? 'all' : district.district)}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-black text-slate-900">{district.district}</h4>
                      <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${
                        district.crime_density === 'Very High' ? 'bg-red-100 text-red-700 border border-red-200' :
                        district.crime_density === 'High' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                        'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {district.crime_density}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-slate-500 text-[10px] uppercase">Officers</p>
                        <p className="text-slate-900 font-black">{district.officers}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] uppercase">Vehicles</p>
                        <p className="text-slate-900 font-black">{district.vehicles}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] uppercase">Budget</p>
                        <p className="text-green-600 font-black">₹{(district.budget / 10000000).toFixed(1)}Cr</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] uppercase">Efficiency</p>
                        <p className="text-blue-600 font-black">{district.avg_efficiency}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-4 space-y-6">
            {/* Equipment Inventory */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                <Target className="text-orange-600" size={20} />
                Equipment Gaps
              </h3>
              <div className="space-y-3">
                {equipmentInventory.map(item => {
                  const percentage = (item.current / item.required) * 100;
                  return (
                    <div key={item.category} className="bg-slate-50 border border-slate-200 rounded-xl p-3 hover:bg-white transition-all">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-900">{item.category}</span>
                        <span className="text-[10px] text-slate-500">{item.current}/{item.required}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                        <div 
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            background: percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444'
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-red-600 font-bold">Gap: {item.gap} units</span>
                        <span className="text-[9px] text-slate-500">₹{(item.total_cost / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Critical Zones */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                <AlertTriangle className="text-red-600" size={20} />
                Critical Shortages
              </h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {resourceAllocationData
                  .filter(r => (r.recommended_officers - r.officers) > 10)
                  .sort((a, b) => (b.recommended_officers - b.officers) - (a.recommended_officers - a.officers))
                  .slice(0, 10)
                  .map(zone => {
                    const deficit = zone.recommended_officers - zone.officers;
                    return (
                      <div key={zone.id} className="bg-red-50 border border-red-200 rounded-xl p-3 hover:bg-red-100 transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-xs font-bold text-slate-900">{zone.location}</p>
                            <p className="text-[10px] text-slate-500">{zone.district}</p>
                          </div>
                          <span className="px-2 py-1 bg-red-600 rounded-lg text-[9px] font-black text-white">-{deficit}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-slate-500">Current: <span className="text-slate-900 font-bold">{zone.officers}</span></span>
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-500">Need: <span className="text-orange-600 font-bold">{zone.recommended_officers}</span></span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.7);
        }
      `}</style>
    </div>
  );
}
