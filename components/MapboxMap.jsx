'use client';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  Banknote, Link as LinkIcon, Home, Hand, HelpCircle, 
  Monitor, Ban, Skull, Siren, MapPin, Activity, ShieldAlert
} from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FyYWtzaGltIiwiYSI6ImNtZXg2bWlxNjB3dmgyaXNkbTJ5dmIzemEifQ.I7tLL6rIWutt8ef9WpN-qg';

export default function MapboxMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('hybrid'); 
  const [stats, setStats] = useState([]);

  // Refined Logic: Icon + Color + Intensity Level (1-10)
  const crimeConfig = {
    'Murder': { icon: <Skull />, color: '#ff0000', intensity: 10 },
    'Rape': { icon: <Ban />, color: '#ff1493', intensity: 9 },
    'Robbery': { icon: <Siren />, color: '#ef4444', intensity: 8 },
    'Assault': { icon: <Hand />, color: '#ff6b6b', intensity: 7 },
    'Burglary': { icon: <Home />, color: '#f59e0b', intensity: 6 },
    'Chain Snatching': { icon: <LinkIcon />, color: '#fbbf24', intensity: 5 },
    'Theft': { icon: <Banknote />, color: '#fbbf24', intensity: 4 },
    'Cybercrime': { icon: <Monitor />, color: '#3b82f6', intensity: 4 },
    'Fraud': { icon: <HelpCircle />, color: '#a855f7', intensity: 3 },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [firsRes, statsRes] = await Promise.all([
          fetch('http://localhost:8000/firs/heatmap'),
          fetch('http://localhost:8000/stats')
        ]);
        const firsData = await firsRes.json();
        setFirs(firsData.features);
        setStats(await statsRes.json());
        setLoading(false);
      } catch (err) {
        console.error('❌ Sync failed:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || firs.length === 0) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [72.8777, 19.0760],
      zoom: 11.5,
      pitch: 50,
      bearing: -10,
      antialias: true
    });

    map.current.on('load', renderCurrentView);
    return () => map.current?.remove();
  }, [firs]);

  const renderCurrentView = () => {
    if (!map.current) return;

    // Clean Layers
    if (map.current.getLayer('firs-heatmap')) map.current.removeLayer('firs-heatmap');
    if (map.current.getSource('firs')) map.current.removeSource('firs');
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    map.current.addSource('firs', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: firs }
    });

    // 1. Refined Heatmap (Higher Detail)
    if (viewMode === 'heatmap' || viewMode === 'hybrid') {
      map.current.addLayer({
        id: 'firs-heatmap',
        type: 'heatmap',
        source: 'firs',
        paint: {
          'heatmap-weight': ['interpolate', ['linear'], ['get', 'intensity'], 1, 0.5, 10, 2],
          'heatmap-intensity': 1.5,
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0,0,0,0)', 0.2, '#1e3a8a', 0.4, '#9333ea', 0.6, '#ef4444', 0.8, '#facc15', 1, '#ffffff'
          ],
          'heatmap-radius': 35,
          'heatmap-opacity': viewMode === 'heatmap' ? 0.85 : 0.4
        }
      });
    }

    // 2. Refined Markers (Telling the "Intensity" and "Story")
    if (viewMode === 'markers' || viewMode === 'hybrid') {
      firs.forEach(feature => {
        const props = feature.properties;
        const cfg = crimeConfig[props.crime_type] || { icon: <MapPin />, color: '#fff', intensity: 2 };
        
        // Logical Scaling: Larger icons for higher intensity
        const iconSize = 18 + (cfg.intensity * 1.5);
        const glowStrength = cfg.intensity * 2;

        const el = document.createElement('div');
        el.className = 'marker-container flex flex-col items-center group cursor-pointer';
        
        // The Icon with Intensity Glow
        const iconWrapper = document.createElement('div');
        iconWrapper.style.color = cfg.color;
        iconWrapper.style.filter = `drop-shadow(0 0 ${glowStrength}px ${cfg.color})`;
        iconWrapper.className = 'transition-all duration-300 transform group-hover:scale-125 group-hover:z-50';
        iconWrapper.innerHTML = renderToStaticMarkup(cfg.icon);
        iconWrapper.style.width = `${iconSize}px`;
        iconWrapper.style.height = `${iconSize}px`;

        // Intensity Label (Shows on hover)
        const label = document.createElement('span');
        label.className = 'absolute -top-8 px-2 py-1 bg-black/90 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/20';
        label.innerText = `${props.crime_type} (Lv. ${cfg.intensity})`;

        el.appendChild(label);
        el.appendChild(iconWrapper);

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false, maxWidth: '300px' }).setHTML(`
          <div class="p-0 overflow-hidden rounded-xl bg-[#0f0f12] text-white border border-white/10 shadow-2xl">
            <div class="h-1 w-full" style="background: ${cfg.color}"></div>
            <div class="p-4">
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-sm font-black uppercase tracking-tighter" style="color: ${cfg.color}">${props.crime_type}</h3>
                <span class="text-[10px] text-gray-500 font-mono">ID: ${props.fir_number}</span>
              </div>
            
              <div class="grid grid-cols-2 gap-2 text-[10px] bg-white/5 p-2 rounded-lg">
                <div><span class="text-gray-500 block">STATION</span>${props.police_station}</div>
                <div><span class="text-gray-500 block">STATUS</span><span class="text-green-400 font-bold">${props.status}</span></div>
                <div><span class="text-gray-500 block">DATE</span>${props.incident_date}</div>
                <div><span class="text-gray-500 block">TIME</span>${props.incident_time}</div>
              </div>
            </div>
          </div>
        `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat(feature.geometry.coordinates)
          .setPopup(popup)
          .addTo(map.current);
        
        markersRef.current.push(marker);
      });
    }
  };

  useEffect(() => {
    if (map.current) renderCurrentView();
  }, [viewMode]);

  if (loading) return (
    <div className="w-screen h-screen bg-[#050507] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white font-black tracking-[0.3em] text-xs animate-pulse">ESTABLISHING SECURE CONNECTION...</p>
      </div>
    </div>
  );

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden font-sans antialiased">
      {/* HEADER LOGO */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10">
        <ShieldAlert className="text-red-600 animate-pulse" />
        <h1 className="text-white text-sm font-black tracking-widest uppercase">Mumbai Real-Time Crime Network</h1>
      </div>

      {/* VIEW CONTROLS */}
      <div className="absolute top-6 left-6 z-30 flex flex-col gap-4">
        <div className="flex p-1 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
          {['heatmap', 'markers', 'hybrid'].map((m) => (
            <button key={m} onClick={() => setViewMode(m)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-wider ${
                viewMode === m ? 'bg-red-600 text-white shadow-lg shadow-red-600/40' : 'text-gray-500 hover:text-white'
              }`}>
              {m}
            </button>
          ))}
        </div>

        {/* INTENSITY LEGEND */}
        <div className="p-5 bg-black/80 backdrop-blur-xl rounded-3xl border border-white/10 w-64 shadow-2xl">
          <p className="text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-widest">Intensity Mapping</p>
          <div className="space-y-3">
             {Object.entries(crimeConfig).slice(0, 5).map(([name, cfg]) => (
               <div key={name} className="flex items-center justify-between group">
                 <div className="flex items-center gap-3">
                   <span style={{ color: cfg.color }} className="group-hover:scale-125 transition-transform">{cfg.icon}</span>
                   <span className="text-xs text-gray-300 font-medium">{name}</span>
                 </div>
                 <div className="flex gap-0.5">
                   {[...Array(5)].map((_, i) => (
                     <div key={i} className={`h-1 w-2 rounded-full ${i < cfg.intensity/2 ? '' : 'bg-gray-800'}`} 
                          style={{ backgroundColor: i < cfg.intensity/2 ? cfg.color : '' }}></div>
                   ))}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* ANALYTICS PANEL */}
      <div className="absolute top-6 right-6 z-30 w-80 bg-black/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-black text-lg tracking-tighter">METRICS</h2>
          <Activity className="text-green-500" size={16} />
        </div>
        <div className="space-y-4">
          {stats.map(stat => (
            <div key={stat._id} className="relative overflow-hidden group p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
              <div className="flex justify-between items-center relative z-10">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{stat._id}</span>
                <span className="text-2xl font-black text-white">{stat.count}</span>
              </div>
              <div className="absolute bottom-0 left-0 h-1 bg-red-600 transition-all duration-500" style={{ width: `${(stat.count / firs.length) * 100}%` }}></div>
            </div>
          ))}
        </div>
      </div>

      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
    </div>
  );
}