'use client';
import { useState, useEffect, useRef } from 'react';
import { Brain, TrendingUp, AlertTriangle, MapPin, Clock, Target, Loader2, Lightbulb, ShieldAlert, Database, Map as MapIcon, Filter, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FyYWtzaGltIiwiYSI6ImNtZXg2bWlxNjB3dmgyaXNkbTJ5dmIzemEifQ.I7tLL6rIWutt8ef9WpN-qg';

export default function OfficerDSSPage() {
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [analysisDate, setAnalysisDate] = useState('');
  const [totalFirs, setTotalFirs] = useState(0);
  
  // Map and hotspot states
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [hotspots, setHotspots] = useState([]);
  const [hotspotsLoading, setHotspotsLoading] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [districtSummary, setDistrictSummary] = useState({});
  const [showMap, setShowMap] = useState(true);
  const [mapPredictions, setMapPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(true);

  const predictPatterns = async () => {
    try {
      setLoading(true);
      setPredictions([]);
      
      // Call the criminal patterns backend
      const response = await fetch('http://localhost:5003/api/predict-patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success && data.patterns) {
        setPredictions(data.patterns);
        setTotalFirs(data.total_firs);
        setAnalysisDate(new Date().toLocaleString('en-IN', {
          dateStyle: 'full',
          timeStyle: 'short'
        }));
      } else {
        alert('Failed to generate patterns: ' + (data.error || 'Unknown error'));
      }
      
    } catch (error) {
      console.error('Error predicting patterns:', error);
      alert('Failed to connect to pattern analysis server. Make sure it\'s running on port 5003.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch hotspots from backend
  const fetchHotspots = async () => {
    try {
      setHotspotsLoading(true);
      const response = await fetch('http://localhost:5008/api/hotspots');
      const data = await response.json();
      
      if (data.success && data.hotspots) {
        setHotspots(data.hotspots);
        setDistrictSummary(data.district_summary || {});
        
        // Extract unique districts
        const uniqueDistricts = [...new Set(data.hotspots.map(h => h.district))];
        setDistricts(uniqueDistricts);
      } else {
        alert('Failed to load hotspots: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error fetching hotspots:', error);
      alert('Failed to connect to hotspot analysis server. Make sure it\'s running on port 5008.');
    } finally {
      setHotspotsLoading(false);
    }
  };

  // Fetch predictions from backend
  const fetchPredictions = async () => {
    try {
      console.log('🔍 Fetching predictions from http://localhost:5008/api/predictions');
      const response = await fetch('http://localhost:5008/api/predictions');
      const data = await response.json();
      
      console.log('📥 Predictions response:', data);
      
      if (data.success && data.predictions) {
        setMapPredictions(data.predictions);
        console.log(`✅ Loaded ${data.predictions.length} predictions for map`);
      } else {
        console.error('❌ Failed to load predictions:', data);
      }
    } catch (error) {
      console.error('❌ Error fetching predictions:', error);
    }
  };

  // Refresh predictions - trigger pattern analysis and reload
  const refreshPredictions = async () => {
    try {
      setLoading(true);
      
      // Call pattern analysis to regenerate and store in DB
      const response = await fetch('http://localhost:5003/api/predict-patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Reload predictions from database
        await fetchPredictions();
        alert('✅ Predictions refreshed and updated on map!');
      } else {
        alert('Failed to refresh predictions: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error refreshing predictions:', error);
      alert('Failed to refresh predictions. Make sure pattern analysis server is running on port 5003.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [72.8777, 19.0760], // Mumbai center
      zoom: 10,
      pitch: 45
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Load hotspots on mount
  useEffect(() => {
    fetchHotspots();
    fetchPredictions();
  }, []);

  // Filter hotspots based on selection
  const getFilteredHotspots = () => {
    let filtered = [...hotspots];

    // Filter by district
    if (selectedDistrict !== 'all') {
      filtered = filtered.filter(h => h.district === selectedDistrict);
    }

    // Filter by risk level
    if (selectedRiskLevel !== 'all') {
      filtered = filtered.filter(h => h.risk_level === selectedRiskLevel);
    }

    return filtered;
  };

  // Render hotspot markers on map
  useEffect(() => {
    console.log('🗺️ Render effect triggered');
    console.log(`   Hotspots: ${hotspots.length}, Predictions: ${mapPredictions.length}`);
    console.log(`   Show predictions: ${showPredictions}`);
    
    if (!map.current) {
      console.log('⚠️ Map not initialized');
      return;
    }

    if (!map.current.isStyleLoaded()) {
      console.log('⚠️ Map style not loaded yet');
      map.current.once('load', () => {
        console.log('✅ Map style loaded, re-triggering render');
      });
      return;
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    console.log('🧹 Cleared existing markers');

    // Get filtered hotspots
    const filteredHotspots = getFilteredHotspots();
    console.log(`📍 Rendering ${filteredHotspots.length} filtered hotspots`);

    // Add markers for filtered hotspots (crime data) - MAPBOX STYLE
    filteredHotspots.forEach(hotspot => {
      // Create marker element with glow effect
      const el = document.createElement('div');
      el.className = 'marker-container flex flex-col items-center group cursor-pointer';
      
      const iconSize = 40;
      const iconWrapper = document.createElement('div');
      iconWrapper.style.width = `${iconSize}px`;
      iconWrapper.style.height = `${iconSize}px`;
      iconWrapper.style.borderRadius = '50%';
      iconWrapper.style.backgroundColor = hotspot.color;
      iconWrapper.style.border = '3px solid white';
      iconWrapper.style.boxShadow = `0 0 20px ${hotspot.color}, 0 4px 12px rgba(0,0,0,0.4)`;
      iconWrapper.style.display = 'flex';
      iconWrapper.style.alignItems = 'center';
      iconWrapper.style.justifyContent = 'center';
      iconWrapper.style.color = 'white';
      iconWrapper.style.fontWeight = 'bold';
      iconWrapper.style.fontSize = '14px';
      iconWrapper.style.transition = 'all 0.3s ease';
      iconWrapper.textContent = hotspot.total_crimes;
      iconWrapper.className = 'group-hover:scale-125 group-hover:shadow-2xl';

      // Add pulse animation for critical zones
      if (hotspot.risk_level === 'Critical') {
        iconWrapper.style.animation = 'pulse 2s infinite';
      }
      
      el.appendChild(iconWrapper);

      // Create popup - Mapbox style
      const topCrimesHtml = hotspot.top_crimes
        .map(c => `<div style="margin: 4px 0;"><span style="color: ${hotspot.color}; font-weight: bold;">${c.type}:</span> ${c.count}</div>`)
        .join('');

      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: false,
        maxWidth: '320px'
      }).setHTML(`
        <div style="padding: 0; overflow: hidden; border-radius: 12px; background: #0f0f12; color: white; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
          <div style="height: 4px; width: 100%; background: ${hotspot.color};"></div>
          <div style="padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
              <h3 style="margin: 0; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px; color: ${hotspot.color};">
                🔍 CRIME HOTSPOT
              </h3>
              <span style="font-size: 10px; color: #666; font-family: monospace;">RANK #${hotspot.rank || '?'}</span>
            </div>
            <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: white;">
              ${hotspot.location}
            </h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; margin-bottom: 12px;">
              <div><span style="color: #999; display: block; font-size: 9px;">DISTRICT</span><strong>${hotspot.district}</strong></div>
              <div><span style="color: #999; display: block; font-size: 9px;">RISK LEVEL</span><strong style="color: ${hotspot.color};">${hotspot.risk_level}</strong></div>
              <div><span style="color: #999; display: block; font-size: 9px;">TOTAL CRIMES</span><strong>${hotspot.total_crimes}</strong></div>
              <div><span style="color: #999; display: block; font-size: 9px;">RECENT (30D)</span><strong style="color: #ef4444;">${hotspot.recent_crimes}</strong></div>
            </div>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
              <div style="color: #999; font-size: 10px; margin-bottom: 6px; font-weight: bold;">TOP CRIME TYPES</div>
              ${topCrimesHtml}
            </div>
          </div>
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([hotspot.longitude, hotspot.latitude])
        .setPopup(popup)
        .addTo(map.current);

      markersRef.current.push(marker);
    });

    // Add markers for AI predictions (if enabled) - MAPBOX STYLE
    if (showPredictions && mapPredictions.length > 0) {
      console.log(`🧠 Adding ${mapPredictions.length} prediction markers`);
      mapPredictions.forEach((pred, idx) => {
        console.log(`   Prediction ${idx + 1}:`, pred.pattern_name, `at (${pred.latitude}, ${pred.longitude})`);
        
        // Create prediction marker with Mapbox style
        const el = document.createElement('div');
        el.className = 'marker-container flex flex-col items-center group cursor-pointer';
        
        const iconSize = 55;
        const iconWrapper = document.createElement('div');
        iconWrapper.style.width = `${iconSize}px`;
        iconWrapper.style.height = `${iconSize}px`;
        iconWrapper.style.borderRadius = '12px';
        iconWrapper.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        iconWrapper.style.border = '4px solid #ffd700';
        iconWrapper.style.boxShadow = '0 0 30px rgba(102, 126, 234, 0.8), 0 8px 20px rgba(0,0,0,0.5)';
        iconWrapper.style.display = 'flex';
        iconWrapper.style.alignItems = 'center';
        iconWrapper.style.justifyContent = 'center';
        iconWrapper.style.color = 'white';
        iconWrapper.style.fontWeight = 'bold';
        iconWrapper.style.fontSize = '22px';
        iconWrapper.style.transition = 'all 0.3s ease';
        iconWrapper.style.animation = 'pulse 3s infinite';
        iconWrapper.textContent = '🧠';
        iconWrapper.className = 'group-hover:scale-125 group-hover:shadow-2xl';
        
        el.appendChild(iconWrapper);

        // Get risk color
        const riskColors = {
          'High': '#ef4444',
          'Medium': '#f59e0b',
          'Low': '#22c55e'
        };
        const riskColor = riskColors[pred.risk_level] || '#3b82f6';

        // Create prediction popup - Mapbox style
        const popup = new mapboxgl.Popup({ 
          offset: 30,
          closeButton: false,
          maxWidth: '380px'
        }).setHTML(`
          <div style="padding: 0; overflow: hidden; border-radius: 16px; background: #0f0f12; color: white; border: 2px solid #ffd700; box-shadow: 0 25px 60px rgba(102, 126, 234, 0.5);">
            <div style="height: 5px; width: 100%; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);"></div>
            <div style="padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="margin: 0; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  🧠 AI PREDICTION #${pred.id}
                </h3>
                <span style="font-size: 10px; color: #666; font-family: monospace;">PATTERN ANALYSIS</span>
              </div>
              <h4 style="margin: 0 0 14px 0; font-size: 17px; font-weight: 900; color: ${riskColor}; line-height: 1.3;">
                ${pred.pattern_name}
              </h4>
              <div style="margin-bottom: 12px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 3px solid ${riskColor};">
                <div style="font-size: 10px; color: #999; margin-bottom: 4px;">RISK ASSESSMENT</div>
                <div style="font-size: 16px; color: ${riskColor}; font-weight: 900;">${pred.risk_level} RISK</div>
              </div>
              <div style="margin-bottom: 12px;">
                <div style="color: #999; font-size: 10px; margin-bottom: 6px; font-weight: bold;">📍 AFFECTED AREAS</div>
                <div style="font-size: 13px; line-height: 1.5; color: #fff;">${pred.affected_areas}</div>
              </div>
              <div style="margin-bottom: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                <div style="color: #999; font-size: 10px; margin-bottom: 6px; font-weight: bold;">📊 PATTERN ANALYSIS</div>
                <div style="font-size: 12px; line-height: 1.6; color: #ddd;">${pred.description}</div>
              </div>
              <div style="margin-top: 14px; padding: 12px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%); border-left: 3px solid #10b981; border-radius: 8px;">
                <div style="color: #10b981; font-size: 10px; margin-bottom: 6px; font-weight: bold;">💡 RECOMMENDED ACTION</div>
                <div style="font-size: 12px; line-height: 1.6; color: #d1fae5; font-weight: 500;">${pred.recommended_action}</div>
              </div>
            </div>
          </div>
        `);

        // Create prediction marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([pred.longitude, pred.latitude])
          .setPopup(popup)
          .addTo(map.current);

        markersRef.current.push(marker);
      });
    }

    // Fit map to show all markers
    const allMarkers = [...filteredHotspots];
    if (showPredictions) {
      allMarkers.push(...mapPredictions);
    }
    
    if (allMarkers.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      allMarkers.forEach(m => {
        bounds.extend([m.longitude, m.latitude]);
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 12 });
    }

  }, [hotspots, mapPredictions, selectedDistrict, selectedRiskLevel, showPredictions]); // Re-render when filters change

  const getRiskColor = (level) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-700 border-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'High': return <ShieldAlert className="w-5 h-5" />;
      case 'Medium': return <AlertTriangle className="w-5 h-5" />;
      case 'Low': return <Target className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Criminal Behavior Pattern Predictor & Crime Hotspots
          </h1>
          <p className="text-gray-600 text-lg">
            AI-Powered Decision Support System for Law Enforcement Officers
          </p>
          {totalFirs > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">Analyzing {totalFirs} FIR Records</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setShowMap(true)}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
              showMap 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            <MapIcon className="w-5 h-5" />
            Crime Hotspot Map
          </button>
          <button
            onClick={() => setShowMap(false)}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
              !showMap 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            <Brain className="w-5 h-5" />
            Pattern Analysis
          </button>
        </div>

        {/* Crime Hotspot Map Section */}
        {showMap && (
          <div className="mb-12">
            {/* Control Buttons */}
            <div className="flex justify-end gap-3 mb-4">
              <button
                onClick={() => setShowPredictions(!showPredictions)}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                  showPredictions 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-300'
                }`}
              >
                <Brain className="w-4 h-4" />
                {showPredictions ? 'Hide' : 'Show'} AI Predictions
              </button>
              <button
                onClick={refreshPredictions}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Refresh Predictions
                  </>
                )}
              </button>
            </div>

            {/* Hotspot Stats Cards */}
            {hotspots.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-600">
                  <div className="text-sm text-gray-600 mb-1">Critical Zones</div>
                  <div className="text-2xl font-bold text-red-600">
                    {hotspots.filter(h => h.risk_level === 'Critical').length}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
                  <div className="text-sm text-gray-600 mb-1">High Risk</div>
                  <div className="text-2xl font-bold text-orange-500">
                    {hotspots.filter(h => h.risk_level === 'High').length}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                  <div className="text-sm text-gray-600 mb-1">Medium Risk</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {hotspots.filter(h => h.risk_level === 'Medium').length}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                  <div className="text-sm text-gray-600 mb-1">Total Hotspots</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {hotspots.length}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow p-4 border-l-4 border-yellow-400">
                  <div className="text-sm text-white mb-1">🧠 AI Predictions</div>
                  <div className="text-2xl font-bold text-white">
                    {mapPredictions.length}
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter Hotspots
                </h3>
                <button
                  onClick={() => {
                    setSelectedDistrict('all');
                    setSelectedRiskLevel('all');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* District Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select District
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Districts</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>

                {/* Risk Level Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Risk Level
                  </label>
                  <select
                    value={selectedRiskLevel}
                    onChange={(e) => setSelectedRiskLevel(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Filter Results Info */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Showing:</strong> {getFilteredHotspots().length} of {hotspots.length} hotspots
                  {selectedDistrict !== 'all' && ` in ${selectedDistrict}`}
                  {selectedRiskLevel !== 'all' && ` with ${selectedRiskLevel} risk`}
                </p>
              </div>
            </div>

            {/* Map Container */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  Crime Hotspot Map - Real-Time Analysis
                </h3>
              </div>
              <div className="relative">
                {hotspotsLoading ? (
                  <div className="h-[600px] flex items-center justify-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div ref={mapContainer} className="h-[600px]" />
                )}
              </div>
            </div>

            {/* District Summary */}
            {Object.keys(districtSummary).length > 0 && (
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">District-wise Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(districtSummary).map(([district, data]) => (
                    <div key={district} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-gray-900 mb-2">{district}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Crimes:</span>
                          <span className="font-semibold">{data.total_crimes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hotspots:</span>
                          <span className="font-semibold">{data.hotspot_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Risk Score:</span>
                          <span className="font-semibold">{data.avg_risk_score}</span>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          {Object.entries(data.risk_levels).map(([level, count]) => (
                            <div key={level} className="flex justify-between text-xs">
                              <span className="text-gray-500">{level}:</span>
                              <span>{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pattern Analysis Section */}
        {!showMap && (
          <div>
            {/* Predict Button */}
            <div className="flex justify-center mb-8">
              <button
                onClick={predictPatterns}
                disabled={loading}
                className={`
                  px-8 py-4 rounded-xl font-semibold text-lg
                  flex items-center gap-3 shadow-lg
                  transition-all duration-300 transform hover:scale-105
                  ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                  }
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Analyzing Crime Data & Generating Patterns...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-6 h-6" />
                    Predict Top 10 Criminal Patterns
                  </>
                )}
              </button>
            </div>

        {/* Analysis Info */}
        {analysisDate && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <p className="text-blue-900">
              <span className="font-semibold">Analysis Generated:</span> {analysisDate}
            </p>
          </div>
        )}

        {/* Predictions Grid */}
        {predictions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Top 10 Predicted Criminal Behavior Patterns
              </h2>
              <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-semibold">
                {predictions.length} Patterns Identified
              </span>
            </div>

            {predictions.map((pattern, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-blue-600"
              >
                {/* Pattern Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {pattern.pattern_name}
                      </h3>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getRiskColor(pattern.risk_level)}`}>
                        {getRiskIcon(pattern.risk_level)}
                        <span className="font-semibold text-sm">{pattern.risk_level} Risk</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pattern Description */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Pattern Analysis</p>
                      <p className="text-gray-700 leading-relaxed">
                        {pattern.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Affected Areas</p>
                      <p className="text-gray-700">
                        {pattern.affected_areas}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg border border-green-200">
                    <Target className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-green-800 mb-1">Recommended Action</p>
                      <p className="text-green-900 font-medium">
                        {pattern.recommended_action}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && predictions.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Brain className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Predictions Generated Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Click the "Predict Top 10 Criminal Patterns" button to analyze crime data and generate behavioral predictions
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-blue-900 leading-relaxed">
                <strong>How it works:</strong> This system analyzes real FIR data from the MongoDB database and uses advanced AI to identify patterns, trends, and potential criminal behaviors. Predictions include risk levels, affected areas, and actionable recommendations for law enforcement officers.
              </p>
            </div>
          </div>
        )}
          </div>
        )}
      </div>
    </div>
  );
}
