"use client";
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Rotate3D } from 'lucide-react';

const MapboxMap = ({ fraData = [], selectedState = 'Show_All' }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [mapLoading, setMapLoading] = useState(true);
  const markersRef = useRef([]);
  const tooltipRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });

  // Initialize map
  useEffect(() => {
    // Get Mapbox token from environment variables
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!mapboxgl.accessToken) {
      console.error('Mapbox access token not found. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env file');
      return;
    }

    if (mapContainer.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12', // Satellite style with street labels
        center: [77.5, 22.5], // Center on India
        zoom: 5,
        pitch: 60, // Tilt the map for 3D effect
        bearing: -17.6, // Slight rotation for better 3D perspective
        projection: 'globe', // Globe projection for realistic world view
        antialias: true, // Enable antialiasing for smoother 3D rendering
        attributionControl: false // Disable default attribution control
      });

      // Create tooltip element
      tooltipRef.current = document.createElement('div');
      tooltipRef.current.className = 'mapbox-tooltip';
      tooltipRef.current.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        pointer-events: none;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        max-width: 200px;
        display: none;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      `;
      document.body.appendChild(tooltipRef.current);

      // Add navigation controls
      mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add fullscreen control
      mapRef.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      // Add compact attribution control
      mapRef.current.addControl(
        new mapboxgl.AttributionControl({
          compact: true
        })
      );

      // Add geolocate control
      mapRef.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        }),
        'top-right'
      );

      // Create custom 3D toggle control
      class Toggle3DControl {
        onAdd(map) {
          this._map = map;
          this._container = document.createElement('div');
          this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
          this._container.innerHTML = `
            <button type="button" class="mapboxgl-ctrl-icon" title="Toggle 3D View" style="background-image: none; font-size: 14px;">
              3D
            </button>
          `;
          this._container.addEventListener('click', () => {
            const currentPitch = map.getPitch();
            map.easeTo({
              pitch: currentPitch > 45 ? 0 : 60,
              duration: 1000
            });
          });
          return this._container;
        }
        
        onRemove() {
          this._container.parentNode.removeChild(this._container);
          this._map = undefined;
        }
      }

      // Create custom rotation control  
      class RotateControl {
        onAdd(map) {
          this._map = map;
          this._container = document.createElement('div');
          this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
this._container.innerHTML = `
  <button
    type="button"
    class="mapboxgl-ctrl-icon"
    title="Rotate Map"
    style="background-image:none; font-size:14px; display:flex; align-items:center; justify-content:center;"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 7v6h-6" />
      <path d="M3 17v-6h6" />
      <path d="M21 13a9 9 0 0 0-15-6.7L3 7" />
      <path d="M3 11a9 9 0 0 0 15 6.7L21 17" />
    </svg>
  </button>
`;

          this._container.addEventListener('click', () => {
            map.easeTo({
              bearing: map.getBearing() + 90,
              duration: 1000
            });
          });
          return this._container;
        }
        
        onRemove() {
          this._container.parentNode.removeChild(this._container);
          this._map = undefined;
        }
      }

      // Add custom controls
      mapRef.current.addControl(new Toggle3DControl(), 'top-right');
      mapRef.current.addControl(new RotateControl(), 'top-right');

      mapRef.current.on('load', () => {
        setMapLoading(false);
        console.log('Mapbox map loaded successfully');
        
        // Add atmospheric effects (sky layer for better 3D atmosphere)
        mapRef.current.addLayer({
          'id': 'sky',
          'type': 'sky',
          'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],

          }
        });
        
        // Add fog for depth perception
        // mapRef.current.setFog({
        //   'range': [0.8, 8],
        //   'color': '#dc9f9f',
        //   'horizon-blend': 0.5,
        //   'high-color': '#245bde',
        //   'space-color': '#000000',
        //   'star-intensity': 0.15
        // });
      });

      mapRef.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapLoading(false);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (tooltipRef.current) {
        document.body.removeChild(tooltipRef.current);
        tooltipRef.current = null;
      }
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!mapRef.current || !fraData.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filter data based on selected state
    const filteredData = selectedState === 'Show_All' 
      ? fraData 
      : fraData.filter(item => item.state === selectedState);

    // Add markers for each claim
    filteredData.forEach((claim, index) => {
      const lat = parseFloat(claim.latitude);
      const lng = parseFloat(claim.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        return; // Skip invalid coordinates
      }

      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.cssText = `
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transition: transform 0.2s ease;
        background-color: ${getStatusColor(claim.status)};
      `;

      // Add hover effect and tooltip
      markerElement.addEventListener('mouseenter', (e) => {
        markerElement.style.transform = 'scale(1.5)';
        
        // Show tooltip
        if (tooltipRef.current) {
          const tooltipContent = `
            <div style="font-weight: bold; margin-bottom: 4px;">${claim.claimant_name || 'Unknown Claimant'}</div>
            <div style="font-size: 11px; opacity: 0.9;">
              📍 ${claim.village || 'N/A'}, ${claim.district || 'N/A'}<br/>
              📊 Status: <span style="color: ${getStatusColor(claim.status)}">${(claim.status || 'Unknown').charAt(0).toUpperCase() + (claim.status || 'unknown').slice(1)}</span><br/>
              🌾 Land: ${claim.total_land_claimed || 'Not specified'}
            </div>
          `;
          
          tooltipRef.current.innerHTML = tooltipContent;
          tooltipRef.current.style.display = 'block';
          
          const updateTooltipPosition = (event) => {
            tooltipRef.current.style.left = (event.pageX + 10) + 'px';
            tooltipRef.current.style.top = (event.pageY - 10) + 'px';
          };
          
          updateTooltipPosition(e);
          
          // Update tooltip position on mouse move
          markerElement.addEventListener('mousemove', updateTooltipPosition);
        }
      });

      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)';
        
        // Hide tooltip
        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'none';
        }
      });

      // Create popup content
      const popupContent = createPopupContent(claim);

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeOnClick: true,
        maxWidth: '400px'
      }).setHTML(popupContent);

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers if we have data
    if (filteredData.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredData.forEach(claim => {
        const lat = parseFloat(claim.latitude);
        const lng = parseFloat(claim.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.extend([lng, lat]);
        }
      });

      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 12
        });
      }
    }
  }, [fraData, selectedState]);

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return '#10B981'; // Green
      case 'pending': return '#F59E0B'; // Orange
      case 'rejected': return '#EF4444'; // Red
      default: return '#6B7280'; // Gray
    }
  };

  // Helper function to create popup content
  const createPopupContent = (claim) => {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 8px;">
        <div style="font-weight: bold; color: #2c3e50; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${getStatusColor(claim.status)};"></span>
          ${claim.claimant_name || 'Unknown Claimant'}
        </div>
        <div style="color: #34495e; font-size: 12px; line-height: 1.4;">
          <p style="margin: 4px 0;"><strong>📍 Location:</strong> ${claim.village || 'N/A'}, ${claim.district || 'N/A'}</p>
          <p style="margin: 4px 0;"><strong>🏛️ State:</strong> ${claim.state || 'N/A'}</p>
          <p style="margin: 4px 0;"><strong>📊 Status:</strong> 
            <span style="color: ${getStatusColor(claim.status)}; font-weight: bold;">
              ${(claim.status || 'Unknown').charAt(0).toUpperCase() + (claim.status || 'unknown').slice(1)}
            </span>
          </p>
          <p style="margin: 4px 0;"><strong>🌾 Land Claimed:</strong> ${claim.total_land_claimed || 'Not specified'}</p>
          <p style="margin: 4px 0;"><strong>👥 Family Members:</strong> ${claim.family_members?.length || 0}</p>
          <p style="margin: 4px 0;"><strong>📅 Application Date:</strong> ${claim.application_date || 'N/A'}</p>
          ${claim.coordinates ? `<p style="margin: 4px 0;"><strong>🗺️ Coordinates:</strong> ${claim.latitude}, ${claim.longitude}</p>` : ''}
        </div>
      </div>
    `;
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      {mapLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          background: 'rgba(255,255,255,0.9)',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #10B981',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span>Loading map...</span>
        </div>
      )}
      
      <div 
        ref={mapContainer} 
        style={{ 
          height: '100%', 
          width: '100%',
          borderRadius: '8px'
        }} 
      />

      {/* Map Legend */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(255,255,255,0.95)',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: '12px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#2c3e50' }}>
          FRA Claims Status
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
            <span>Approved</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></div>
            <span>Pending</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }}></div>
            <span>Rejected</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MapboxMap;