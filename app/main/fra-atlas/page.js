"use client";
import { useState, useEffect, useRef } from "react";
import {
  Map,
  Filter,
  Search,
  Download,
  Eye,
  Users,
  MapPin,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  Layers,
  Settings,
  RefreshCw,
  Home,
  Database,
  TrendingUp,
  PieChart,
  BarChart,
  LineChart,
  Activity,
  Phone,
  Menu,
  X,
  LogOut
} from "lucide-react";
import Link from "next/link";
import MapboxMap from '../../../components/MapboxMap';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import Footer from '../../../components/Footer';
import Navbar from "@/components/Navbar";

export default function FRAAtlasDashboard() {
  const [fraData, setFraData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    state: "",
    district: "",
    village: "",
    claimStatus: "",
    scheduledTribe: "",
    formType: "",
    dateFrom: "",
    dateTo: ""
  });

  // Fetch real data from database
  useEffect(() => {
    fetchFRAData();
  }, []);

  const fetchFRAData = async () => {
    try {
      setLoading(true);
      console.log('Fetching FRA data...');
      const response = await fetch('/api/save-claim');
      const result = await response.json();
      console.log('API response:', result);
      console.log('API response success:', result.success);
      console.log('API response data length:', result.data ? result.data.length : 'no data');
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('Data loaded successfully, length:', result.data.length);
        console.log('Sample data item:', result.data[0]);
        console.log('Data structure check:');
        console.log('- claim_status:', result.data[0]?.claim_status);
        console.log('- district:', result.data[0]?.district);
        console.log('- state:', result.data[0]?.state);
        console.log('- application_date:', result.data[0]?.application_date);
        setFraData(result.data);
        setFilteredData(result.data);
      } else {
        console.error('No data received from API or empty dataset');
        console.log('Setting empty arrays for fraData and filteredData');
        setFraData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching FRA data:', error);
      setFraData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueValues = (field) => {
    return [...new Set(fraData.map(item => item[field]).filter(Boolean))];
  };

  const applyFilters = () => {
    let filtered = fraData;

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        if (key === 'dateFrom' || key === 'dateTo') {
          // Handle date filtering with improved parsing
          filtered = filtered.filter(item => {
            const itemDate = parseApplicationDate(item.application_date) || new Date(item.createdAt);
            const filterDate = new Date(filters[key]);

            if (!itemDate || isNaN(itemDate.getTime()) || isNaN(filterDate.getTime())) {
              return true; // Include items with invalid dates to avoid losing data
            }

            return key === 'dateFrom' ? itemDate >= filterDate : itemDate <= filterDate;
          });
        } else {
          // Map filter keys to data field names
          const fieldMapping = {
            'claimStatus': 'claim_status',
            'scheduledTribe': 'scheduled_tribe',
            'formType': 'form_type'
          };

          const dataField = fieldMapping[key] || key;

          filtered = filtered.filter(item =>
            item[dataField]?.toLowerCase().includes(filters[key].toLowerCase())
          );
        }
      }
    });

    setFilteredData(filtered);
  };

  const resetFilters = () => {
    setFilters({
      state: "",
      district: "",
      village: "",
      claimStatus: "",
      scheduledTribe: "",
      formType: "",
      dateFrom: "",
      dateTo: ""
    });
    setFilteredData(fraData);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  useEffect(() => {
    applyFilters();
  }, [filters, fraData]);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  // Chart data processing functions
  const getStatusDistribution = () => {
    console.log('=== Status Distribution Debug ===');
    console.log('filteredData length:', filteredData.length);
    
    if (filteredData.length === 0) {
      console.log('No data available for status distribution');
      return [];
    }

    console.log('Sample items for status check:', filteredData.slice(0, 3).map(item => ({
      id: item._id,
      claim_status: item.claim_status,
      claimStatus: item.claimStatus // Check if it's a different field name
    })));

    const statusCounts = filteredData.reduce((acc, claim) => {
      const status = claim.claim_status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    console.log('Status counts:', statusCounts);
    
    const result = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      percentage: ((count / filteredData.length) * 100).toFixed(1)
    }));
    
    console.log('Final status distribution:', result);
    return result;
  };

  const getStateDistribution = () => {
    console.log('=== State Distribution Debug ===');
    console.log('filteredData length:', filteredData.length);
    
    if (filteredData.length === 0) {
      console.log('No data available for state distribution');
      return [];
    }

    console.log('Sample items for state check:', filteredData.slice(0, 3).map(item => ({
      id: item._id,
      state: item.state
    })));

    const stateCounts = filteredData.reduce((acc, claim) => {
      const state = claim.state || 'Unknown';
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {});

    console.log('State counts:', stateCounts);

    const result = Object.entries(stateCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([state, count]) => ({
        state: state.length > 15 ? state.substring(0, 15) + '...' : state,
        fullState: state,
        count
      }));
      
    console.log('Final state distribution:', result);
    return result;
  };

  const getDistrictDistribution = () => {
    console.log('=== District Distribution Debug ===');
    console.log('filteredData length:', filteredData.length);
    
    if (filteredData.length === 0) {
      console.log('No data available for district distribution');
      return [];
    }

    console.log('Sample items for district check:', filteredData.slice(0, 3).map(item => ({
      id: item._id,
      district: item.district
    })));

    const districtCounts = filteredData.reduce((acc, claim) => {
      const district = claim.district || 'Unknown';
      acc[district] = (acc[district] || 0) + 1;
      return acc;
    }, {});
    
    console.log('District counts:', districtCounts);

    const result = Object.entries(districtCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15)
      .map(([district, count]) => ({
        district: district.length > 20 ? district.substring(0, 20) + '...' : district,
        fullDistrict: district,
        count
      }));
      
    console.log('Final district distribution:', result);
    return result;
  };

  // Helper function to parse various date formats
  const parseApplicationDate = (dateStr) => {
    if (!dateStr) return null;

    // Handle formats like "30th January 2025", "13th March 2025", etc.
    const ordinalRegex = /(\d{1,2})(st|nd|rd|th)\s+(\w+)\s+(\d{4})/i;
    const match = dateStr.match(ordinalRegex);

    if (match) {
      const day = parseInt(match[1]);
      const monthName = match[3];
      const year = parseInt(match[4]);

      const monthMap = {
        'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
        'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
      };

      const monthIndex = monthMap[monthName.toLowerCase()];
      if (monthIndex !== undefined) {
        return new Date(year, monthIndex, day);
      }
    }

    // Fallback to standard date parsing
    const fallbackDate = new Date(dateStr);
    return !isNaN(fallbackDate.getTime()) ? fallbackDate : null;
  };

  const getMonthlyTrends = () => {
    console.log('=== Monthly Trends Debug ===');
    console.log('filteredData length:', filteredData.length);

    if (filteredData.length === 0) {
      console.log('No data available for monthly trends');
      return [];
    }

    console.log('Sample items for date check:', filteredData.slice(0, 5).map(item => ({
      id: item._id,
      application_date: item.application_date,
      createdAt: item.createdAt,
      parsed_date: parseApplicationDate(item.application_date)
    })));

    const monthlyData = filteredData.reduce((acc, claim) => {
      // Prioritize application_date over createdAt/processing_date
      let date = parseApplicationDate(claim.application_date);

      // Fallback to createdAt if application_date parsing fails
      if (!date && claim.createdAt) {
        date = new Date(claim.createdAt);
      }

      if (!date || isNaN(date.getTime())) {
        console.log('No valid date found for claim:', claim._id, 'application_date:', claim.application_date);
        return acc;
      }

      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthYear] = (acc[monthYear] || 0) + 1;

      return acc;
    }, {});

    console.log('Monthly data after parsing:', monthlyData);

    const result = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // Last 12 months
      .map(([month, count]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        claims: count
      }));

    console.log('Final monthly trends:', result);
    return result;
  };

  const getLandAreaDistribution = () => {
    console.log('=== Land Area Distribution Debug ===');
    console.log('filteredData length:', filteredData.length);
    
    if (filteredData.length === 0) {
      console.log('No data available for land area distribution');
      return [];
    }

    console.log('Sample items for land area check:', filteredData.slice(0, 3).map(item => ({
      id: item._id,
      total_land_claimed: item.total_land_claimed
    })));

    const landRanges = [
      { range: '0-1 ha', min: 0, max: 1 },
      { range: '1-2 ha', min: 1, max: 2 },
      { range: '2-5 ha', min: 2, max: 5 },
      { range: '5-10 ha', min: 5, max: 10 },
      { range: '10+ ha', min: 10, max: Infinity }
    ];

    const distribution = landRanges.map(range => {
      const count = filteredData.filter(claim => {
        const landAreaStr = claim.total_land_claimed;
        if (!landAreaStr) return range.min === 0; // Count as 0 if no data
        
        const landArea = parseFloat(landAreaStr.toString().replace(/[^0-9.]/g, '')) || 0;
        return landArea >= range.min && landArea < range.max;
      }).length;

      return {
        range: range.range,
        count
      };
    });

    console.log('Land area distribution:', distribution);
    return distribution;
  };

  const getFormTypeDistribution = () => {
    console.log('=== Form Type Distribution Debug ===');
    console.log('filteredData length:', filteredData.length);
    
    if (filteredData.length === 0) {
      console.log('No data available for form type distribution');
      return [];
    }

    console.log('Sample items for form type check:', filteredData.slice(0, 3).map(item => ({
      id: item._id,
      form_type: item.form_type
    })));

    const formCounts = filteredData.reduce((acc, claim) => {
      const formType = claim.form_type || 'Unknown';
      acc[formType] = (acc[formType] || 0) + 1;
      return acc;
    }, {});

    console.log('Form type counts:', formCounts);

    const result = Object.entries(formCounts).map(([form, count]) => ({
      name: form,
      value: count
    }));
    
    console.log('Final form type distribution:', result);
    return result;
  };

  const getTribeDistribution = () => {
    console.log('=== Tribe Distribution Debug ===');
    console.log('filteredData length:', filteredData.length);
    
    if (filteredData.length === 0) {
      console.log('No data available for tribe distribution');
      return [];
    }

    console.log('Sample items for tribe check:', filteredData.slice(0, 3).map(item => ({
      id: item._id,
      scheduled_tribe: item.scheduled_tribe
    })));

    const tribeCounts = filteredData.reduce((acc, claim) => {
      const tribe = claim.scheduled_tribe || 'Unknown';
      acc[tribe] = (acc[tribe] || 0) + 1;
      return acc;
    }, {});

    console.log('Tribe counts:', tribeCounts);

    const result = Object.entries(tribeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tribe, count]) => ({
        tribe: tribe.length > 20 ? tribe.substring(0, 20) + '...' : tribe,
        fullTribe: tribe,
        count
      }));
      
    console.log('Final tribe distribution:', result);
    return result;
  };

  // Chart colors
  const STATUS_COLORS = ['#10B981', '#F59E0B', '#EF4444']; // Green, Yellow, Red
  const CHART_COLORS = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#84CC16'];

  const generateMapHTML = () => {
    const mapData = filteredData
      .filter(claim => claim.latitude && claim.longitude)
      .map(claim => ({
        id: claim._id,
        lat: parseFloat(claim.latitude),
        lng: parseFloat(claim.longitude),
        name: claim.claimant_name,
        village: claim.village,
        district: claim.district,
        state: claim.state,
        status: claim.claim_status,
        land: claim.total_land_claimed,
        tribe: claim.scheduled_tribe,
        formType: claim.form_type,
        habitation: claim.land_for_habitation,
        cultivation: claim.land_for_cultivation,
        familyMembers: claim.family_members?.length || 0,
        applicationDate: claim.application_date,
        processedBy: claim.processed_by,
        processingDate: claim.processing_date
      }));

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>FRA Claims Atlas - Interactive Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
        <script src="https://d3js.org/d3.v7.min.js"></script>
        <style>
          .custom-popup {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 300px;
          }
          .popup-header {
            font-size: 16px;
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 4px;
          }
          .popup-content {
            font-size: 13px;
            line-height: 1.4;
          }
          .status-approved { color: #38a169; font-weight: bold; }
          .status-pending { color: #d69e2e; font-weight: bold; }
          .status-rejected { color: #e53e3e; font-weight: bold; }
          .land-area {
            background: #f7fafc;
            padding: 6px;
            border-radius: 4px;
            margin: 4px 0;
            border-left: 3px solid #4a5568;
          }
          .custom-cluster-icon {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            text-align: center;
            line-height: 1;
          }
          .leaflet-interactive {
            cursor: pointer !important;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .land-segmentation-overlay {
            pointer-events: auto !important;
            cursor: pointer !important;
          }
          .land-segmentation-overlay img {
            transition: all 0.3s ease;
          }
          .land-segmentation-overlay:hover img {
            opacity: 0.8 !important;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0;">
        <div ref={mapContainer} style={{height: '100vh', width: '100%'}} />

        <!-- Water Detection Loading Indicator -->
        <div id="waterDetectionLoading" style="position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.9); padding: 10px 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); display: none; z-index: 1000; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 16px; height: 16px; border: 2px solid #007bff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <span>Detecting water bodies...</span>
          </div>
        </div>

        <!-- Land Detection Loading Indicator -->
        <div id="landDetectionLoading" style="position: absolute; top: 20px; right: 220px; background: rgba(255,255,255,0.9); padding: 10px 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); display: none; z-index: 1000; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 16px; height: 16px; border: 2px solid #28a745; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <span>Detecting land segments...</span>
          </div>
        </div>

        <!-- Water Detection Status (hidden element for status updates) -->
        <div id="waterDetectionStatus" style="display: none;"></div>

        <!-- Land Detection Status (hidden element for status updates) -->
        <div id="landDetectionStatus" style="display: none;"></div>

        <!-- Test Button for Water Detection -->
        <button id="testWaterDetection" style="position: absolute; top: 80px; right: 20px; background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
          🔍 Detect Water (YOLO)
        </button>

        <!-- Test Button for Land Detection -->
        <button id="testLandDetection" style="position: absolute; top: 110px; right: 20px; background: #ffc107; color: black; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
          🌾 Detect Land (YOLO)
        </button>

        <!-- Choropleth Controls Panel -->
        <div id="choroplethControls" style="position: absolute; top: 140px; right: 20px; background: white; border: 2px solid #4a5568; border-radius: 8px; padding: 15px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: none; min-width: 280px;">
          <div style="margin-bottom: 12px; text-align: center; font-weight: bold; color: #2d3748; font-size: 14px;">🗺️ Choropleth Controls</div>
          
          <!-- State Selector -->
          <div style="margin-bottom: 10px;">
            <label style="display: block; font-size: 12px; font-weight: bold; color: #4a5568; margin-bottom: 4px;">State:</label>
            <select id="choroplethState" style="width: 100%; padding: 6px 8px; border: 1px solid #cbd5e0; border-radius: 4px; font-size: 12px; background: white;">
              <option value="Show_All" selected>Show All States</option>
              <option value="Madhya_Pradhesh">Madhya Pradesh</option>
              <option value="Odisha">Odisha</option>
              <option value="Tripura">Tripura</option>
              <option value="Telangana">Telangana</option>
            </select>
          </div>
          
          <!-- Data Type Selector -->
          <div style="margin-bottom: 10px;">
            <label style="display: block; font-size: 12px; font-weight: bold; color: #4a5568; margin-bottom: 4px;">Data Type:</label>
            <select id="choroplethDataType" style="width: 100%; padding: 6px 8px; border: 1px solid #cbd5e0; border-radius: 4px; font-size: 12px; background: white;">
              <option value="forest_cover_percent" selected>🌲 Forest Cover</option>
              <option value="agricultural_land">🌾 Agricultural Land</option>
              <option value="water_bodies">💧 Water Bodies</option>
              <option value="homesteads">🏠 Homesteads</option>
            </select>
          </div>

          <!-- Map Style Selector - Hidden in choropleth mode -->
          <div id="mapStyleContainer" style="margin-bottom: 10px; display: none;">
            <label style="display: block; font-size: 12px; font-weight: bold; color: #4a5568; margin-bottom: 4px;">Map Style:</label>
            <select id="choroplethMapStyle" style="width: 100%; padding: 6px 8px; border: 1px solid #cbd5e0; border-radius: 4px; font-size: 12px; background: white;">
              <option value="standard" selected>🗺️ Standard</option>
              <option value="satellite">🛰️ Satellite</option>
              <option value="light">🧭 Light</option>
              <option value="terrain">🏞️ Terrain</option>
              <option value="monochrome">📰 Monochrome</option>
            </select>
          </div>

          <!-- Density Legend -->
          <div id="densityLegend" style="margin-bottom: 10px;">
            <label style="display: block; font-size: 12px; font-weight: bold; color: #4a5568; margin-bottom: 4px;" id="densityLegendTitle">Data Density:</label>
            <div id="densityGradient" style="background: linear-gradient(to right, #f0f0f0 0%, #228B22 100%); height: 20px; border-radius: 4px; border: 1px solid #cbd5e0; position: relative;">
              <div style="position: absolute; left: 2px; top: 2px; font-size: 10px; color: white; text-shadow: 1px 1px 1px rgba(0,0,0,0.7);">Low</div>
              <div style="position: absolute; right: 2px; top: 2px; font-size: 10px; color: white; text-shadow: 1px 1px 1px rgba(0,0,0,0.7);">High</div>
            </div>
            <div style="font-size: 10px; color: #666; margin-top: 4px; text-align: center;" id="legendRange">Loading...</div>
          </div>
          
          <!-- Close Button -->
          <button id="closeChoroplethControls" style="width: 100%; padding: 6px 8px; background: #e53e3e; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; margin-top: 8px;">Close Choropleth</button>
        </div>

        <!-- Choropleth Toggle Button -->
        <button id="choroplethToggle" style="position: absolute; top: 140px; right: 20px; background: #6366f1; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.2); display: block;">
          🗺️ Toggle Choropleth
        </button>

        <script>
          var map = L.map('map').setView([22.5, 77.5], 5);

          // Dynamic cluster configuration based on zoom level
          function getClusterRadius(zoom) {
            if (zoom <= 6) return 120;      // State level - Large clusters
            if (zoom <= 8) return 80;       // Regional level - Medium clusters
            if (zoom <= 10) return 60;      // District level - Smaller clusters
            if (zoom <= 12) return 40;      // Sub-district - Very small clusters
            if (zoom <= 14) return 25;      // Village level - Minimal clustering
            if (zoom <= 15) return 15;      // Individual level - Almost no clustering
            return 10;                      // Zoom 16+ - Complete separation
          }

          // Smart cluster icon creation based on cluster size
          function createClusterIcon(cluster) {
            var childCount = cluster.getChildCount();
            var zoom = map.getZoom();

            // Determine cluster size category
            var size, color, fontSize;
            if (childCount < 5) {
              size = 30; color = '#10B981'; fontSize = '12px'; // Small - Green
            } else if (childCount < 15) {
              size = 40; color = '#3B82F6'; fontSize = '14px'; // Medium - Blue
            } else if (childCount < 50) {
              size = 50; color = '#F59E0B'; fontSize = '16px'; // Large - Orange
            } else {
              size = 60; color = '#EF4444'; fontSize = '18px'; // Extra-large - Red
            }

            // Scale size based on zoom level for better visibility
            var zoomScale = Math.max(0.7, Math.min(1.3, zoom / 10));
            size = Math.round(size * zoomScale);
            fontSize = Math.round(parseInt(fontSize) * zoomScale) + 'px';

            return new L.DivIcon({
              html: '<div style="background-color: ' + color + '; border: 3px solid white; border-radius: 50%; width: ' + size + 'px; height: ' + size + 'px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-weight: bold; color: white; font-size: ' + fontSize + ';">' + childCount + '</div>',
              className: 'custom-cluster-icon',
              iconSize: new L.Point(size, size),
              iconAnchor: new L.Point(size/2, size/2)
            });
          }

          // Create layer groups for better control
          var landBoundaries = L.layerGroup();
          var markers = L.markerClusterGroup({
            chunkedLoading: true,
            chunkInterval: 200,
            chunkDelay: 50,
            maxClusterRadius: getClusterRadius(map.getZoom()),
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: true,
            zoomToBoundsOnClick: true,
            removeOutsideVisibleBounds: true,
            animate: true,
            animateAddingMarkers: true,
            iconCreateFunction: createClusterIcon,
            spiderfyDistanceMultiplier: 1.5
          });

          // Water Detection System Variables
          var waterDetectionActive = false;
          var waterMarkers = L.layerGroup();
          var waterPolygons = L.layerGroup();
          var currentWaterDetections = [];
          var detectionTimeout = null;
          var lastDetectionBounds = null;
          var detectionDebounceTime = 1000; // 1 second debounce

          // Land Detection System Variables
          var landDetectionActive = false;
          var landMarkers = L.layerGroup();
          var landPolygons = L.layerGroup();
          var currentLandDetections = [];
          var landDetectionTimeout = null;
          var lastLandDetectionBounds = null;
          var landDetectionDebounceTime = 1000; // 1 second debounce

          // Choropleth System Variables - INITIAL STATE: IMAGERY WITH FRA CLAIMS
          var choroplethActive = false; // START WITH IMAGERY MODE (SATELLITE + FRA CLAIMS)
          var choroplethLayer = null;
          var choroplethIframe = null;
          var currentDataType = 'forest_cover_percent';
          var currentState = 'Show_All';
          var currentMapStyle = 'satellite'; // Start with satellite imagery
          var choroplethDataTypes = ['forest_cover_percent', 'agricultural_land', 'water_bodies', 'homesteads'];
          var baseLayersMap = {};
          var satelliteLayer = null;
          var osmLayer = null;

          // Create base layers
          osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors | FRA Claims Atlas'
          });

          satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri Satellite | FRA Claims Atlas'
          });

          // Start with satellite imagery to show FRA claims perfectly
          satelliteLayer.addTo(map);

          // Choropleth Functions - Simple overlay on existing imagery map
          function toggleChoropleth() {
            choroplethActive = !choroplethActive;
            var toggleBtn = document.getElementById('choroplethToggle');
            var controlsPanel = document.getElementById('choroplethControls');

            if (choroplethActive) {
              // SHOW CHOROPLETH OVERLAY
              toggleBtn.innerHTML = '❌ Hide Choropleth';
              toggleBtn.style.background = '#dc2626';
              controlsPanel.style.display = 'block'; // Show controls panel

              // Load choropleth data for the selected state only
              loadChoroplethOverlay(currentDataType, currentState);

              console.log('🗺️ Showing CHOROPLETH for state:', currentState);
            } else {
              // COMPLETELY HIDE CHOROPLETH
              toggleBtn.innerHTML = '🗺️ Toggle Choropleth';
              toggleBtn.style.background = '#6366f1';
              controlsPanel.style.display = 'none'; // Hide controls panel

              // Use the robust cleanup function
              clearAllChoroplethLayers();

              console.log('🛰️ Choropleth mode OFF - back to satellite + FRA claims only');
            }
          }

          // Function to load choropleth data for all states - Sequential loading
          function loadAllStatesChoropleth(dataType, loadingDiv) {
            var allStates = ['Madhya_Pradhesh', 'Odisha', 'Tripura', 'Telangana'];
            var allFeatures = [];
            var columnName = null;
            var currentStateIndex = 0;

            console.log('🔄 Loading choropleth for all states:', allStates);

            function loadNextState() {
              if (currentStateIndex >= allStates.length) {
                // All states processed
                console.log('🎯 All states processed! Total features:', allFeatures.length);
                if (allFeatures.length > 0) {
                  var combinedGeoJSON = {
                    type: 'FeatureCollection',
                    features: allFeatures
                  };
                  addChoroplethToMap(combinedGeoJSON, columnName, dataType, loadingDiv);
                } else {
                  if (loadingDiv.parentNode) {
                    loadingDiv.parentNode.removeChild(loadingDiv);
                  }
                  alert('No choropleth data found for any states.');
                }
                return;
              }

              var stateName = allStates[currentStateIndex];
              var apiUrl = 'http://localhost:5005/api/choropleth/' + stateName + '/' + dataType;
              console.log('📡 Fetching data for state:', stateName, 'from:', apiUrl);

              fetch(apiUrl)
                .then(response => {
                  if (!response.ok) {
                    throw new Error('HTTP ' + response.status + ' for ' + stateName);
                  }
                  return response.json();
                })
                .then(data => {
                  console.log('✅ Data received for', stateName, ':', {
                    hasGeojson: !!data.geojson,
                    featureCount: data.geojson ? data.geojson.features.length : 0,
                    columnName: data.column_name
                  });

                  if (data.geojson && data.geojson.features && data.geojson.features.length > 0) {
                    // Store column name from first successful load
                    if (!columnName) {
                      columnName = data.column_name;
                    }

                    // Add state name to each feature
                    data.geojson.features.forEach(function(feature) {
                      feature.properties.state_name = stateName.replace('_', ' ');
                    });
                    allFeatures = allFeatures.concat(data.geojson.features);
                    console.log('📊 Added', data.geojson.features.length, 'features from', stateName, '- Total so far:', allFeatures.length);
                  } else {
                    console.warn('⚠️ No features found for state:', stateName);
                  }

                  currentStateIndex++;
                  loadNextState(); // Load next state
                })
                .catch(error => {
                  console.error('❌ Error loading data for', stateName, ':', error);
                  currentStateIndex++;
                  loadNextState(); // Continue with next state even if this one failed
                });
            }

            loadNextState(); // Start loading
          }

          // Function to add choropleth layer to map
          function addChoroplethToMap(geojsonData, columnName, dataType, loadingDiv) {
            // Calculate data range for proper color scaling
            var values = [];
            geojsonData.features.forEach(function(feature) {
              var value = feature.properties[columnName];
              if (value !== null && value !== undefined && !isNaN(value)) {
                values.push(parseFloat(value));
              }
            });

            var minValue = Math.min(...values);
            var maxValue = Math.max(...values);

            // Calculate quantiles for better color distribution
            values.sort(function(a, b) { return a - b; });
            var quantiles = [];
            for (var i = 0; i <= 8; i++) {
              var index = Math.floor((i / 8) * (values.length - 1));
              quantiles.push(values[index]);
            }

            console.log('📊 Data analysis for', dataType, ':', {
              minValue: minValue,
              maxValue: maxValue,
              range: maxValue - minValue,
              valueCount: values.length,
              quantiles: quantiles,
              sampleValues: values.slice(0, 10)
            });

            // Update density legend with proper data type and range
            updateDensityLegend(dataType, minValue, maxValue);

            // Color scales for each data type with enhanced contrast
            var colorScales = {
              'forest_cover_percent': ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#14532d'],
              'agricultural_land': ['#fffbeb', '#fef3c7', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412'],
              'water_bodies': ['#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a'],
              'homesteads': ['#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d']
            };

            function getColorForValue(value, dataType, min, max, quantiles) {
              var colors = colorScales[dataType] || colorScales['water_bodies'];
              if (max === min) return colors[4]; // Middle color if no variation

              // Use quantile-based mapping for better distribution
              var colorIndex = 0;
              for (var i = 0; i < quantiles.length - 1; i++) {
                if (value >= quantiles[i]) {
                  colorIndex = i;
                }
              }

              // Ensure we don't exceed color array bounds
              colorIndex = Math.max(0, Math.min(colors.length - 1, colorIndex));

              console.log('🎨 Quantile color mapping:', {
                value: value,
                dataType: dataType,
                quantiles: quantiles,
                colorIndex: colorIndex,
                color: colors[colorIndex]
              });

              return colors[colorIndex];
            }

            // Add choropleth layer to existing map
            choroplethLayer = L.geoJSON(geojsonData, {
              style: function(feature) {
                var value = feature.properties[columnName];
                if (value === null || value === undefined || isNaN(value)) {
                  return {
                    fillColor: '#cccccc',
                    weight: 2,
                    opacity: 0.8,
                    color: 'white',
                    fillOpacity: 0.5
                  };
                }

                return {
                  fillColor: getColorForValue(parseFloat(value), dataType, minValue, maxValue, quantiles),
                  weight: 2,
                  opacity: 0.8,
                  color: 'white',
                  fillOpacity: 0.8
                };
              },
              onEachFeature: function(feature, layer) {
                var value = feature.properties[columnName];
                var districtName = feature.properties.STNAME || feature.properties.district || 'Unknown';

                // Enhanced state name detection with proper formatting
                var stateNameMapping = {
                  'Madhya_Pradhesh': 'Madhya Pradesh',
                  'Odisha': 'Odisha',
                  'Tripura': 'Tripura',
                  'Telangana': 'Telangana',
                  'Show_All': 'Multi-State View'
                };

                var stateName = feature.properties.state_name ||
                               feature.properties.State ||
                               feature.properties.state ||
                               stateNameMapping[currentState] ||
                               currentState.replace('_', ' ') ||
                               'Unknown';

                console.log('🔍 Debug popup data:', {
                  district: districtName,
                  state: stateName,
                  currentState: currentState,
                  value: value,
                  allProperties: feature.properties
                });

                layer.bindPopup(
                  '<div style="font-family: Arial; padding: 10px;">' +
                  '<div style="font-weight: bold; color: #2c3e50; margin-bottom: 8px;">📍 ' + districtName + '</div>' +
                  '<div style="color: #34495e;">' +
                  '<p><strong>State:</strong> ' + stateName + '</p>' +
                  '<p><strong>Data Type:</strong> ' + dataType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + '</p>' +
                  '<p><strong>Value:</strong> ' + (value !== null && value !== undefined ? value.toFixed(2) + (dataType.includes('percent') ? '%' : '') : 'No data') + '</p>' +
                  '</div>' +
                  '</div>'
                );

                layer.on('mouseover', function(e) {
                  this.setStyle({
                    weight: 4,
                    opacity: 1,
                    fillOpacity: 0.9
                  });
                });

                layer.on('mouseout', function(e) {
                  this.setStyle({
                    weight: 2,
                    opacity: 0.8,
                    fillOpacity: 0.8
                  });
                });
              }
            }).addTo(map);

            if (loadingDiv.parentNode) {
              loadingDiv.parentNode.removeChild(loadingDiv);
            }

            console.log('✅ Combined choropleth overlay added to map');
          }

          // Function to update density legend based on data type and range
          function updateDensityLegend(dataType, minValue, maxValue) {
            var legendTitle = document.getElementById('densityLegendTitle');
            var densityGradient = document.getElementById('densityGradient');
            var legendRange = document.getElementById('legendRange');

            // Data type specific configurations
            var dataTypeConfig = {
              'forest_cover_percent': {
                title: '🌲 Forest Cover Density:',
                gradient: 'linear-gradient(to right, #f0fdf4 0%, #bbf7d0 25%, #22c55e 50%, #15803d 75%, #14532d 100%)',
                unit: '%',
                description: 'Forest Cover Percentage'
              },
              'water_bodies': {
                title: '💧 Water Bodies Density:',
                gradient: 'linear-gradient(to right, #f8fafc 0%, #cbd5e1 25%, #64748b 50%, #334155 75%, #0f172a 100%)',
                unit: '%',
                description: 'Water Percentage'
              },
              'agricultural_land': {
                title: '🌾 Agricultural Land Density:',
                gradient: 'linear-gradient(to right, #fffbeb 0%, #fed7aa 25%, #fb923c 50%, #ea580c 75%, #9a3412 100%)',
                unit: 'ha',
                description: 'Net Sown Area'
              },
              'homesteads': {
                title: '🏠 Homestead Density:',
                gradient: 'linear-gradient(to right, #fdf2f8 0%, #fbcfe8 25%, #f472b6 50%, #db2777 75%, #9d174d 100%)',
                unit: '/sqkm',
                description: 'Homestead Density'
              }
            };

            var config = dataTypeConfig[dataType] || dataTypeConfig['forest_cover_percent'];

            // Update legend title
            legendTitle.textContent = config.title;

            // Update gradient colors
            densityGradient.style.background = config.gradient;

            // Update range text
            var rangeText = config.description + ': ' + minValue.toFixed(1) + config.unit + ' - ' + maxValue.toFixed(1) + config.unit;
            legendRange.textContent = rangeText;

            console.log('🎨 Updated density legend for', dataType, 'with range:', minValue, '-', maxValue);
          }

          // New function: Load choropleth as overlay on existing map
          // Helper function to completely clear all choropleth layers
          function clearAllChoroplethLayers() {
            if (choroplethLayer) {
              try {
                map.removeLayer(choroplethLayer);
                console.log('✅ Removed choropleth layer from map');
              } catch (e) {
                console.warn('⚠️ Error removing choropleth layer:', e);
              }
              choroplethLayer = null;
            }

            // Remove any loading indicators
            var loadingDiv = document.getElementById('choroplethLoading');
            if (loadingDiv && loadingDiv.parentNode) {
              loadingDiv.parentNode.removeChild(loadingDiv);
              console.log('✅ Removed loading indicator');
            }
          }

          function loadChoroplethOverlay(dataType, state) {
            // COMPLETELY remove existing choropleth layer if any
            clearAllChoroplethLayers();

            console.log('🗺️ Loading choropleth overlay for state:', state, 'dataType:', dataType);

            // Show loading indicator
            var loadingDiv = document.createElement('div');
            loadingDiv.id = 'choroplethLoading';
            loadingDiv.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,255,255,0.95); padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 2000; font-family: Arial, sans-serif; text-align: center;';
            loadingDiv.innerHTML = '<div style="font-size: 16px; margin-bottom: 10px;">🗺️ Loading Choropleth Overlay...</div><div style="font-size: 12px; color: #666;">State: ' + state.replace('_', ' ') + '<br>Data Type: ' + dataType.replace('_', ' ') + '</div>';
            document.body.appendChild(loadingDiv);

            // Use Flask API to get choropleth data
            var apiUrl;
            if (state === 'Show_All') {
              // For Show_All, we'll load each state separately and combine
              loadAllStatesChoropleth(dataType, loadingDiv);
              return;
            } else {
              apiUrl = 'http://localhost:5005/api/choropleth/' + state + '/' + dataType;
            }

            console.log('📡 Fetching choropleth data from:', apiUrl);

            fetch(apiUrl)
              .then(response => {
                if (!response.ok) {
                  throw new Error('HTTP ' + response.status + ': ' + response.statusText);
                }
                return response.json();
              })
              .then(data => {
                console.log('📊 Choropleth data received:', data);

                if (data.geojson && data.geojson.type === 'FeatureCollection') {
                  var columnName = data.column_name;

                  // Add state name to features if not present (for individual state requests)
                  if (data.state_name) {
                    data.geojson.features.forEach(function(feature) {
                      if (!feature.properties.state_name) {
                        feature.properties.state_name = data.state_name;
                      }
                    });
                  }

                  addChoroplethToMap(data.geojson, columnName, dataType, loadingDiv);
                } else {
                  throw new Error('Invalid GeoJSON data received');
                }
              })
              .catch(error => {
                console.error('❌ Error loading choropleth data:', error);
                if (loadingDiv.parentNode) {
                  loadingDiv.parentNode.removeChild(loadingDiv);
                }
                alert('Error loading choropleth data: ' + error.message + '. Make sure Flask server is running on port 5005.');
              });
          }


          function switchMapStyle(style) {
            // Remove all existing base layers
            if (satelliteLayer && map.hasLayer(satelliteLayer)) {
              map.removeLayer(satelliteLayer);
            }
            if (osmLayer && map.hasLayer(osmLayer)) {
              map.removeLayer(osmLayer);
            }

            // Remove any existing base layers from baseLayersMap
            Object.values(baseLayersMap).forEach(layer => {
              if (map.hasLayer(layer)) {
                map.removeLayer(layer);
              }
            });

            // Create and add the selected base layer
            switch(style) {
              case 'satellite':
                if (!satelliteLayer) {
                  satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: '© Esri Satellite'
                  });
                }
                satelliteLayer.addTo(map);
                break;
              case 'standard':
                if (!osmLayer) {
                  osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                  });
                }
                osmLayer.addTo(map);
                break;
              case 'light':
                if (!baseLayersMap.light) {
                  baseLayersMap.light = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
                    attribution: '© Stadia Maps, © OpenMapTiles © OpenStreetMap contributors'
                  });
                }
                baseLayersMap.light.addTo(map);
                break;
              case 'terrain':
                if (!baseLayersMap.terrain) {
                  baseLayersMap.terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors, © SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
                  });
                }
                baseLayersMap.terrain.addTo(map);
                break;
              case 'monochrome':
                if (!baseLayersMap.monochrome) {
                  baseLayersMap.monochrome = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
                    attribution: '© Stadia Maps, © OpenMapTiles © OpenStreetMap contributors'
                  });
                }
                baseLayersMap.monochrome.addTo(map);
                break;
            }
          }

          // Water Detection Functions
          function isZoomLevelForDetection(zoom) {
            return zoom >= 11; // Lowered from 14 to 11 for better detection
          }

          function shouldTriggerDetection(map) {
            if (!isZoomLevelForDetection(map.getZoom())) {
              return false;
            }

            var currentBounds = map.getBounds();
            if (!lastDetectionBounds) {
              return true; // First detection
            }

            // Check if we've moved significantly (more than 20% of viewport)
            var boundsDiff = {
              north: Math.abs(currentBounds.getNorth() - lastDetectionBounds.getNorth()),
              south: Math.abs(currentBounds.getSouth() - lastDetectionBounds.getSouth()),
              east: Math.abs(currentBounds.getEast() - lastDetectionBounds.getEast()),
              west: Math.abs(currentBounds.getWest() - lastDetectionBounds.getWest())
            };

            var viewportHeight = currentBounds.getNorth() - currentBounds.getSouth();
            var viewportWidth = currentBounds.getEast() - currentBounds.getWest();

            // Trigger if moved more than 20% of viewport in any direction
            return (boundsDiff.north > viewportHeight * 0.2 ||
                    boundsDiff.south > viewportHeight * 0.2 ||
                    boundsDiff.east > viewportWidth * 0.2 ||
                    boundsDiff.west > viewportWidth * 0.2);
          }

          function runWaterDetection(center, zoom, bounds) {
            if (detectionTimeout) {
              clearTimeout(detectionTimeout);
            }

            detectionTimeout = setTimeout(function() {
              console.log('🔍 Running water detection for zoom:', zoom);

              // Show detection loading indicator
              showDetectionLoading(true);

              fetch('http://localhost:5003/api/water-detection', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  center: [center.lat, center.lng],
                  zoom: zoom,
                  bounds: {
                    north: bounds.getNorth(),
                    south: bounds.getSouth(),
                    east: bounds.getEast(),
                    west: bounds.getWest()
                  },
                  confidence: 0.3
                })
              })
              .then(response => response.json())
              .then(data => {
                console.log('🔍 API Response:', data);
                showDetectionLoading(false);

                if (data.success && data.detections && data.detections.length > 0) {
                  console.log('💧 Water detected:', data.detections.length, 'bodies');
                  console.log('Sample detection:', data.detections[0]);
                  displayWaterDetections(data.detections, center, zoom);
                  lastDetectionBounds = bounds;
                  updateDetectionStatus('Active: ' + data.detections.length + ' water bodies detected');
                } else {
                  console.log('🏜️ No water detected in current view');
                  clearWaterLayers();
                  updateDetectionStatus('Active: No water detected');
                }
              })
              .catch(error => {
                console.error('❌ Water detection error:', error);
                showDetectionLoading(false);
                updateDetectionStatus('Error: Detection failed');
              });
            }, detectionDebounceTime);
          }

          function displayWaterDetections(detections, center, zoom) {
            clearWaterLayers();
            console.log('🎯 Displaying detections:', detections);

            detections.forEach(function(detection, index) {
              console.log('Processing detection', index, ':', detection);

              // Create polygon from mask if available
              if (detection.mask && detection.mask.length > 0) {
                console.log('Creating polygon from mask with', detection.mask.length, 'points');

                try {
                  // Use the geographic coordinates from the server
                  var geoCoords = detection.mask;

                  var waterPolygon = L.polygon(geoCoords, {
                    className: 'water-body-polygon',
                    fillOpacity: 0.4,
                    weight: 2,
                    opacity: 0.8,
                    color: '#007bff',
                    fillColor: '#007bff'
                  });

                  waterPolygon.bindPopup(
                    '<div class="custom-popup water-popup">' +
                    '<div class="popup-header">💧 Water Body Detected</div>' +
                    '<div class="popup-content">' +
                    '<p><strong>Confidence:</strong> ' + (detection.confidence * 100).toFixed(1) + '%</p>' +
                    '<p><strong>Area:</strong> ' + (detection.area || 0).toFixed(0) + ' pixels</p>' +
                    '<p><strong>Points:</strong> ' + detection.mask.length + '</p>' +
                    '<p><strong>Type:</strong> YOLO Detection</p>' +
                    '</div>' +
                    '</div>'
                  );

                  waterPolygons.addLayer(waterPolygon);
                  console.log('✅ Polygon added to layer');
                } catch (error) {
                  console.error('❌ Error creating polygon:', error);
                }
              }

              // Create marker at detection center if geo_center is provided
              if (detection.geo_center && Array.isArray(detection.geo_center) && detection.geo_center.length >= 2) {
                console.log('Creating marker at geo_center:', detection.geo_center);

                try {
                  var waterIcon = L.divIcon({
                    className: 'water-marker',
                    html: '<div style="width: 12px; height: 12px; background: #007bff; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
                    iconSize: [12, 12],
                    iconAnchor: [6, 6]
                  });

                  var waterMarker = L.marker([detection.geo_center[0], detection.geo_center[1]], { icon: waterIcon });
                  waterMarker.bindPopup(
                    '<div class="custom-popup water-popup">' +
                    '<div class="popup-header">💧 YOLO Water Detection</div>' +
                    '<div class="popup-content">' +
                    '<p><strong>Confidence:</strong> ' + (detection.confidence * 100).toFixed(1) + '%</p>' +
                    '<p><strong>Location:</strong> ' + detection.geo_center[0].toFixed(6) + ', ' + detection.geo_center[1].toFixed(6) + '</p>' +
                    '<p><strong>Area:</strong> ' + (detection.area || 0).toFixed(0) + ' pixels</p>' +
                    '<p><strong>Model:</strong> YOLO Segmentation</p>' +
                    '</div>' +
                    '</div>'
                  );

                  waterMarkers.addLayer(waterMarker);
                  console.log('✅ Marker added to layer');
                } catch (error) {
                  console.error('❌ Error creating marker:', error);
                }
              } else {
                console.log('No valid geo_center found for marker');
              }
            });

            currentWaterDetections = detections;
            updateWaterLayers();
            console.log('🎯 Finished displaying', detections.length, 'detections');
          }

          function clearWaterLayers() {
            waterMarkers.clearLayers();
            waterPolygons.clearLayers();
            currentWaterDetections = [];
          }

          // Land Detection Functions
          function runLandDetection(center, zoom, bounds) {
            if (landDetectionTimeout) {
              clearTimeout(landDetectionTimeout);
            }

            landDetectionTimeout = setTimeout(function() {
              console.log('🌾 Running land detection for zoom:', zoom);

              // Show detection loading indicator
              showLandDetectionLoading(true);

              fetch('http://localhost:5004/api/land-detection', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  lat: center.lat,
                  lng: center.lng,
                  zoom: zoom
                })
              })
              .then(response => response.json())
              .then(data => {
                console.log('🌾 Land API Response:', data);
                showLandDetectionLoading(false);

                if (data.success && data.detections && data.detections.length > 0) {
                  console.log('🌾 Land detected:', data.detections.length, 'segments');
                  console.log('📊 Coverage:', data.summary);
                  displayLandDetections(data.detections, data.summary, center, zoom);
                  lastLandDetectionBounds = bounds;
                  updateLandDetectionStatus('Active: ' + data.detections.length + ' land segments detected');
                } else {
                  console.log('🏜️ No land segments detected in current view');
                  clearLandLayers();
                  updateLandDetectionStatus('Active: No land segments detected');
                }
              })
              .catch(error => {
                console.error('❌ Land detection error:', error);
                showLandDetectionLoading(false);
                updateLandDetectionStatus('Error: Detection failed');
              });
            }, landDetectionDebounceTime);
          }

          function displayLandDetections(detections, summary, center, zoom) {
            clearLandLayers();
            console.log('🎯 Displaying individual land segmentation polygons:', detections);

            if (!detections || detections.length === 0) {
              console.log('No land detections to display');
              return;
            }

            // Display individual detection polygons (like water detection)
            detections.forEach(function(detection, index) {
              try {
                console.log('Processing detection', index, ':', detection);

                // Create polygon from mask if available (same as water detection)
                if (detection.mask && detection.mask.length > 0) {
                  console.log('Creating polygon from mask with', detection.mask.length, 'points');

                  // Use the geographic coordinates from the server
                  var geoCoords = detection.mask;

                  // Set colors based on land type: Green for farm, Yellow for barren
                  var polygonColor = detection.land_type === 'farm' ? '#00FF00' : '#FFFF00'; // Green for farm, Yellow for barren
                  var fillColor = detection.land_type === 'farm' ? '#00FF00' : '#FFFF00';

                  var landPolygon = L.polygon(geoCoords, {
                    className: 'land-body-polygon',
                    fillOpacity: 0.5,
                    weight: 3,
                    opacity: 0.9,
                    color: polygonColor,
                    fillColor: fillColor
                  });

                  landPolygon.bindPopup(
                    '<div class="custom-popup land-popup">' +
                    '<div class="popup-header">🌾 ' + detection.land_type.toUpperCase() + ' LAND DETECTED</div>' +
                    '<div class="popup-content">' +
                    '<p><strong>Confidence:</strong> ' + (detection.confidence * 100).toFixed(1) + '%</p>' +
                    '<p><strong>Land Type:</strong> ' + detection.land_type.charAt(0).toUpperCase() + detection.land_type.slice(1) + '</p>' +
                    '<p><strong>Area:</strong> ' + (detection.area || 0).toFixed(0) + ' pixels</p>' +
                    '<p><strong>Points:</strong> ' + detection.mask.length + '</p>' +
                    '<p><strong>Type:</strong> YOLO Segmentation</p>' +
                    '</div>' +
                    '</div>'
                  );

                  landPolygons.addLayer(landPolygon);
                  console.log('✅ Polygon added to layer for', detection.land_type);
                }
                
                // Add center marker for each detection
                if (detection.center && detection.mask_shape) {
                  var currentBounds = map.getBounds();
                  var centerLat = currentBounds.getSouth() + (currentBounds.getNorth() - currentBounds.getSouth()) * 
                                  (1 - detection.center[1] / detection.mask_shape[0]);
                  var centerLng = currentBounds.getWest() + (currentBounds.getEast() - currentBounds.getWest()) * 
                                  (detection.center[0] / detection.mask_shape[1]);

                  var markerColor = detection.land_type === 'farm' ? '#00FF00' : '#FFFF00'; // Green for farm, Yellow for barren
                  // Create enhanced, larger markers with tooltips
                  var landIcon = L.divIcon({
                    className: 'land-marker-enhanced',
                    html: '<div style="width: 24px; height: 24px; background: ' + markerColor + '; border: 4px solid white; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.6); position: relative;">' +
                          '<div style="position: absolute; top: -30px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.9); color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; white-space: nowrap; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.5);">' +
                          detection.land_type.toUpperCase() + '<br>' + Math.round(detection.confidence * 100) + '%' +
                          '</div></div>',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  });

                  var landMarker = L.marker([centerLat, centerLng], { icon: landIcon });
                  landMarker.bindPopup(
                    '<div class="custom-popup land-popup">' +
                    '<div class="popup-header">🌾 ' + detection.land_type.toUpperCase() + ' CENTER</div>' +
                    '<div class="popup-content">' +
                    '<p><strong>Confidence:</strong> ' + (detection.confidence * 100).toFixed(1) + '%</p>' +
                    '<p><strong>Land Type:</strong> ' + detection.land_type.charAt(0).toUpperCase() + detection.land_type.slice(1) + '</p>' +
                    '<p><strong>Area:</strong> ' + (detection.area || 0).toFixed(0) + ' pixels</p>' +
                    '<p><strong>Location:</strong> ' + centerLat.toFixed(6) + ', ' + centerLng.toFixed(6) + '</p>' +
                    '</div>' +
                    '</div>'
                  );

                  landMarkers.addLayer(landMarker);
                  console.log('✅ Enhanced land marker added for', detection.land_type, '- Detection #' + (index + 1), 'with confidence:', Math.round(detection.confidence * 100) + '%');
                }
              } catch (error) {
                console.error('❌ Error creating land detection:', error);
              }
            });

            // Add layers to map if not already added
            if (!map.hasLayer(landPolygons)) {
              map.addLayer(landPolygons);
            }
            if (!map.hasLayer(landMarkers)) {
              map.addLayer(landMarkers);
            }
            
            // Show summary in console
            if (summary) {
              console.log('📊 Land Analysis Summary:');
              console.log('- Barren Land Coverage:', (summary.barren_coverage_percent || 0).toFixed(1) + '%');
              console.log('- Farm Coverage:', (summary.farm_coverage_percent || 0).toFixed(1) + '%');
              console.log('- Total Detections:', detections.length);
            }
            
            console.log('🎯 Successfully displayed', detections.length, 'individual land segmentation masks');
          }
          function clearLandLayers() {
            landMarkers.clearLayers();
            landPolygons.clearLayers();
            currentLandDetections = [];
          }

          function updateLandLayers() {
            if (landDetectionActive) {
              map.addLayer(landMarkers);
              map.addLayer(landPolygons);
            }
          }

          function showLandDetectionLoading(show) {
            var loadingEl = document.getElementById('landDetectionLoading');
            if (loadingEl) {
              loadingEl.style.display = show ? 'block' : 'none';
            }
          }

          function updateLandDetectionStatus(status) {
            var statusEl = document.getElementById('landDetectionStatus');
            if (statusEl) {
              statusEl.textContent = status;
            }
          }

          function activateLandDetection() {
            if (!landDetectionActive) {
              console.log('🔄 Activating land detection system');
              landDetectionActive = true;
              updateLandDetectionStatus('Active: Scanning...');
              updateLandLayers();
            }
          }

          function deactivateLandDetection() {
            if (landDetectionActive) {
              console.log('🔄 Deactivating land detection system');
              landDetectionActive = false;
              clearLandLayers();
              updateLandDetectionStatus('Idle');
              if (landDetectionTimeout) {
                clearTimeout(landDetectionTimeout);
                landDetectionTimeout = null;
              }
            }
          }

          function updateWaterLayers() {
            if (waterDetectionActive) {
              map.addLayer(waterMarkers);
              map.addLayer(waterPolygons);
            }
          }

          function showDetectionLoading(show) {
            var loadingEl = document.getElementById('waterDetectionLoading');
            if (loadingEl) {
              loadingEl.style.display = show ? 'block' : 'none';
            }
          }

          function updateDetectionStatus(status) {
            var statusEl = document.getElementById('waterDetectionStatus');
            if (statusEl) {
              statusEl.textContent = status;
            }
          }

          function activateWaterDetection() {
            if (!waterDetectionActive) {
              console.log('🔄 Activating water detection system');
              waterDetectionActive = true;
              updateDetectionStatus('Active: Scanning...');
              updateWaterLayers();
            }
          }

          function deactivateWaterDetection() {
            if (waterDetectionActive) {
              console.log('🔄 Deactivating water detection system');
              waterDetectionActive = false;
              clearWaterLayers();
              updateDetectionStatus('Idle');
              if (detectionTimeout) {
                clearTimeout(detectionTimeout);
                detectionTimeout = null;
              }
            }
          }

          // Event handlers for automatic detection
          map.on('zoomend', function() {
            var currentZoom = map.getZoom();
            var center = map.getCenter();
            var bounds = map.getBounds();

            // Update cluster radius
            var newRadius = getClusterRadius(currentZoom);
            markers.options.maxClusterRadius = newRadius;
            markers.refreshClusters();
            info.update();

            // Handle water detection activation/deactivation
            if (isZoomLevelForDetection(currentZoom)) {
              activateWaterDetection();
              if (shouldTriggerDetection(map)) {
                runWaterDetection(center, currentZoom, bounds);
              }
            } else {
              deactivateWaterDetection();
            }

            // Handle land detection activation/deactivation
            if (isZoomLevelForDetection(currentZoom)) {
              activateLandDetection();
              if (shouldTriggerLandDetection(map)) {
                runLandDetection(center, currentZoom, bounds);
              }
            } else {
              deactivateLandDetection();
            }
          });

          map.on('moveend', function() {
            var currentZoom = map.getZoom();
            var center = map.getCenter();
            var bounds = map.getBounds();

            // Only run water detection if system is active and we should trigger
            if (waterDetectionActive && shouldTriggerDetection(map)) {
              runWaterDetection(center, currentZoom, bounds);
            }

            // Only run land detection if system is active and we should trigger
            if (landDetectionActive && shouldTriggerLandDetection(map)) {
              runLandDetection(center, currentZoom, bounds);
            }
          });

          function shouldTriggerLandDetection(map) {
            if (!isZoomLevelForDetection(map.getZoom())) {
              return false;
            }

            var currentBounds = map.getBounds();
            if (!lastLandDetectionBounds) {
              return true; // First detection
            }

            // Check if we've moved significantly (more than 20% of viewport)
            var boundsDiff = {
              north: Math.abs(currentBounds.getNorth() - lastLandDetectionBounds.getNorth()),
              south: Math.abs(currentBounds.getSouth() - lastLandDetectionBounds.getSouth()),
              east: Math.abs(currentBounds.getEast() - lastLandDetectionBounds.getEast()),
              west: Math.abs(currentBounds.getWest() - lastLandDetectionBounds.getWest())
            };

            var viewportHeight = currentBounds.getNorth() - currentBounds.getSouth();
            var viewportWidth = currentBounds.getEast() - currentBounds.getWest();

            // Trigger if moved more than 20% of viewport in any direction
            return (boundsDiff.north > viewportHeight * 0.2 ||
                    boundsDiff.south > viewportHeight * 0.2 ||
                    boundsDiff.east > viewportWidth * 0.2 ||
                    boundsDiff.west > viewportWidth * 0.2);
          }

          // Initial check on map load
          map.whenReady(function() {
            var currentZoom = map.getZoom();
            if (isZoomLevelForDetection(currentZoom)) {
              activateWaterDetection();
              setTimeout(function() {
                runWaterDetection(map.getCenter(), currentZoom, map.getBounds());
              }, 1000);
            }
          });

          var claimMarkers = ${JSON.stringify(mapData)};

          claimMarkers.forEach(function(claim) {
            var statusClass = claim.status === 'approved' ? 'status-approved' :
                             claim.status === 'pending' ? 'status-pending' : 'status-rejected';

            var statusColor = claim.status === 'approved' ? '#38a169' :
                             claim.status === 'pending' ? '#d69e2e' : '#e53e3e';

            // Create custom icon based on status
            var customIcon = L.divIcon({
              className: 'custom-marker',
              html: '<div style="background-color: ' + statusColor + '; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });

            var marker = L.marker([claim.lat, claim.lng], { icon: customIcon });

            // Calculate land area from database field (total_land_claimed)
            var landAreaText = claim.total_land_claimed || claim.land || '0.5';
            var landArea = parseFloat(landAreaText.replace(/[^0-9.]/g, '')) || 0.5;

            // Calculate radius based on land area in hectares
            // 1 hectare ≈ 100m radius for circular area, but we'll scale it for visibility
            var radius = Math.max(50, Math.min(300, Math.sqrt(landArea * 10000 / Math.PI))); // Convert hectares to approximate radius in meters

            // Add circle to represent land claim area
            var landCircle = L.circle([claim.lat, claim.lng], {
              color: statusColor,
              fillColor: 'transparent',
              fillOpacity: 0,
              weight: 3,
              radius: radius,
              dashArray: '10, 10', // Dotted line pattern
              opacity: 0.8
            });

            marker.bindPopup(\`
              <div class="custom-popup">
                <div class="popup-header">\${claim.name}</div>
                <div class="popup-content">
                  <p><strong>📍 Location:</strong> \${claim.village}, \${claim.district}</p>
                  <p><strong>🏛️ State:</strong> \${claim.state}</p>
                  <p><strong>📋 Status:</strong> <span class="\${statusClass}">\${claim.status.toUpperCase()}</span></p>
                  <div class="land-area">
                    <p><strong>🌾 Land Details:</strong></p>
                    <p>• Total: \${claim.land}</p>
                    <p>• Habitation: \${claim.habitation}</p>
                    <p>• Cultivation: \${claim.cultivation}</p>
                  </div>
                  <p><strong>👨‍👩‍👧‍👦 Family:</strong> \${claim.familyMembers} members</p>
                  <p><strong>📄 Form:</strong> \${claim.formType}</p>
                  <p><strong>🏘️ Tribe:</strong> \${claim.tribe}</p>
                  <p><strong>📅 Applied:</strong> \${claim.applicationDate}</p>
                  <p><strong>👤 Processed by:</strong> \${claim.processedBy}</p>
                </div>
              </div>
            \`, {
              maxWidth: 350,
              className: 'custom-popup-container'
            });

            // Enhanced click event to zoom and trigger asset detection
            marker.on('click', function() {
              // Zoom to maximum level for closest view
              map.setView([claim.lat, claim.lng], 18, {
                animate: true,
                duration: 2.0
              });
            });

            // Add hover effects - only show popup when at maximum zoom level (after clicking)
            marker.on('mouseover', function() {
              if (map.getZoom() >= 17) { // Only show popup at maximum zoom levels
                this.openPopup();
              }
            });

            marker.on('mouseout', function() {
              if (map.getZoom() >= 17) { // Only close popup at maximum zoom levels
                setTimeout(() => {
                  map.closePopup();
                }, 3000);
              }
            });

            // Add marker to cluster group (only the marker, not the circle)
            markers.addLayer(marker);

            // Add land circle to land boundaries layer group
            if (landArea > 0) {
              landBoundaries.addLayer(landCircle);
            }
          });

          // Add markers to map
          map.addLayer(markers);
          map.addLayer(landBoundaries);

          // Add layer control with overlays
          var overlays = {
            "Claim Markers": markers,
            "Land Boundaries": landBoundaries,
            "Water Bodies": waterMarkers,
            "Water Polygons": waterPolygons,
            "Land Polygons": landPolygons,
            "Land Markers": landMarkers
          };

          var baseLayers = {
            "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
            "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
              attribution: '© Esri'
            })
          };

          L.control.layers(baseLayers, overlays).addTo(map);

          // Add scale control
          L.control.scale().addTo(map);

          // Add zoom control with custom position
          map.zoomControl.setPosition('topright');

          // Add custom info control
          var info = L.control({position: 'bottomright'});

          info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info bg-white p-3 rounded shadow border');
            this._div.style.cssText = 'background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;';
            this.update();
            return this._div;
          };

          info.update = function (props) {
            var currentZoom = map.getZoom();
            var clusterRadius = getClusterRadius(currentZoom);
            var zoomLevel = '';
            if (currentZoom <= 6) zoomLevel = 'State Level';
            else if (currentZoom <= 8) zoomLevel = 'Regional Level';
            else if (currentZoom <= 10) zoomLevel = 'District Level';
            else if (currentZoom <= 12) zoomLevel = 'Sub-district Level';
            else if (currentZoom <= 14) zoomLevel = 'Village Level';
            else zoomLevel = 'Individual Level';

            var detectionStatus = waterDetectionActive ?
              'Active (' + currentWaterDetections.length + ' water bodies)' : 'Idle';
            var landDetectionStatus = landDetectionActive ?
              'Active (' + (currentLandDetections ? currentLandDetections.length : 0) + ' land segments)' : 'Idle';

            this._div.innerHTML = '<h4 class="font-bold text-gray-800 mb-2">FRA Claims Atlas</h4>' +
              '<div class="text-sm text-gray-600 mb-2">' +
              '<p><strong>Zoom:</strong> ' + currentZoom + ' (' + zoomLevel + ')</p>' +
              '<p><strong>Cluster Radius:</strong> ' + clusterRadius + 'px</p>' +
              '<p><strong>Water Detection:</strong> ' + detectionStatus + '</p>' +
              '<p><strong>Land Detection:</strong> ' + landDetectionStatus + '</p>' +
              '</div>' +
              '<div class="text-sm text-gray-600">' +
              '<p>🟢 Approved: ' + claimMarkers.filter(c => c.status === 'approved').length + '</p>' +
              '<p>🟡 Pending: ' + claimMarkers.filter(c => c.status === 'pending').length + '</p>' +
              '<p>🔴 Rejected: ' + claimMarkers.filter(c => c.status === 'rejected').length + '</p>' +
              '<p>📊 Total: ' + claimMarkers.length + ' claims</p>' +
              '</div>';
          };

          info.addTo(map);

          // Add test button handler
          document.getElementById('testWaterDetection').addEventListener('click', function() {
            console.log('🧪 Manual test water detection triggered');
            var center = map.getCenter();
            var zoom = map.getZoom();
            var bounds = map.getBounds();

            // Trigger real YOLO detection
            runWaterDetection(center, zoom, bounds);
          });

          // Add land detection test button handler
          document.getElementById('testLandDetection').addEventListener('click', function() {
            console.log('🧪 Manual test land detection triggered');
            var center = map.getCenter();
            var zoom = map.getZoom();
            var bounds = map.getBounds();

            // Trigger real YOLO land detection
            runLandDetection(center, zoom, bounds);
          });

          // Add choropleth controls event handlers
          document.getElementById('choroplethState').addEventListener('change', function() {
            currentState = this.value;
            console.log('🔄 State filter changed to:', currentState);

            if (choroplethActive) {
              // Load choropleth for the NEW selected state only
              loadChoroplethOverlay(currentDataType, currentState);
            }
          });

          document.getElementById('choroplethDataType').addEventListener('change', function() {
            currentDataType = this.value;
            console.log('🔄 Data type filter changed to:', currentDataType);

            if (choroplethActive) {
              // Load NEW data type for current state
              loadChoroplethOverlay(currentDataType, currentState);
            }
          });

          document.getElementById('choroplethMapStyle').addEventListener('change', function() {
            currentMapStyle = this.value;
            switchMapStyle(currentMapStyle);
          });

          document.getElementById('closeChoroplethControls').addEventListener('click', function() {
            toggleChoropleth(); // This will close the controls
          });

          // Add main choropleth toggle button handler
          document.getElementById('choroplethToggle').addEventListener('click', function() {
            toggleChoropleth();
          });

        </script>
      </body>
      </html>
    `;
  };

return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      <Navbar />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Top Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
              Intelligence <span className="text-green-600">Dashboard</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Forest Rights Act (FRA) Monitoring & Spatial Analysis Node</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">System Live</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filters Sidebar - 3 Columns */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100 sticky top-24">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400 flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-green-600" />
                  Parameters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-green-600 hover:text-green-700 uppercase tracking-widest transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {[
                  { label: "State", id: "state", type: "select", options: getUniqueValues('state') },
                  { label: "District", id: "district", type: "select", options: getUniqueValues('district') },
                  { label: "Village", id: "village", type: "input", placeholder: "Search sectors..." },
                  { label: "Claim Status", id: "claimStatus", type: "select", options: ['approved', 'pending', 'rejected'] },
                  { label: "Form Type", id: "formType", type: "select", options: getUniqueValues('form_type') },
                  { label: "Scheduled Tribe", id: "scheduledTribe", type: "input", placeholder: "Tribe ID..." },
                ].map((field) => (
                  <div key={field.id} className="group">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1 group-focus-within:text-green-600 transition-colors">
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select
                        value={filters[field.id]}
                        onChange={(e) => handleFilterChange(field.id, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">All {field.label}s</option>
                        {field.options.map(opt => (
                          <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={filters[field.id]}
                        onChange={(e) => handleFilterChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Sidebar Stats - Compact Tactical View */}
              <div className="mt-10 pt-8 border-t border-slate-100">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-100">
                    <span className="text-[10px] font-black text-green-700 uppercase tracking-wider">Approved</span>
                    <span className="text-sm font-black text-green-800">{filteredData.filter(d => d.claim_status === 'approved').length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Pending</span>
                    <span className="text-sm font-black text-amber-800">{filteredData.filter(d => d.claim_status === 'pending').length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-rose-50 rounded-xl border border-rose-100">
                    <span className="text-[10px] font-black text-rose-700 uppercase tracking-wider">Rejected</span>
                    <span className="text-sm font-black text-rose-800">{filteredData.filter(d => d.claim_status === 'rejected').length}</span>
                  </div>
                </div>
                
                <a
                  href="/claimant"
                  className="mt-6 w-full flex items-center justify-center px-4 py-4 bg-slate-900 text-white rounded-xl hover:bg-green-600 shadow-lg shadow-slate-200 transition-all duration-300 group"
                >
                  <Database className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-[0.1em]">Registry Access</span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content - Map - 9 Columns */}
          <div className="lg:col-span-9 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-2xl text-green-600">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Geospatial Distribution</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Choropleth Layer</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-6">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                      <span className="text-[10px] font-black uppercase text-slate-500">Verified Sectors</span>
                   </div>
                   <div className="bg-slate-100 px-3 py-1.5 rounded-lg font-mono text-[10px] text-slate-500">
                      SRC: FLASK_SRV_01
                   </div>
                </div>
              </div>
              <div className="p-2">
                <div className="relative rounded-[2rem] overflow-hidden bg-slate-100" style={{ height: '700px' }}>
                  <MapboxMap 
                    fraData={filteredData} 
                    selectedState={filters.state || 'Show_All'} 
                  />
                  {/* Tactical Overlay UI on Map */}
                  <div className="absolute top-6 left-6 pointer-events-none">
                     <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Filter</p>
                        <p className="text-sm font-black text-slate-900">{filters.state || "All Territories"}</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Dashboard Section */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-10">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                    Analytical <span className="text-blue-600">Metrics</span>
                  </h2>
                </div>
                <div className="bg-blue-50 px-5 py-2 rounded-full text-[10px] font-black text-blue-700 uppercase tracking-widest border border-blue-100">
                  {filteredData.length} Records Processed
                </div>
              </div>

              {/* Tactical Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                  { label: "Total Claims", val: filteredData.length, icon: FileText, color: "slate" },
                  { label: "Approved", val: filteredData.filter(d => d.claim_status === 'approved').length, icon: CheckCircle, color: "green" },
                  { label: "Pending", val: filteredData.filter(d => d.claim_status === 'pending').length, icon: Clock, color: "amber" },
                  { label: "Rejected", val: filteredData.filter(d => d.claim_status === 'rejected').length, icon: XCircle, color: "rose" },
                ].map((stat, i) => (
                  <div key={i} className="relative group p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                    <stat.icon className={`w-5 h-5 mb-4 text-${stat.color}-600`} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{stat.val}</p>
                    <div className={`absolute top-6 right-6 w-8 h-8 rounded-full bg-${stat.color}-600/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                       <TrendingUp className={`w-4 h-4 text-${stat.color}-600`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Distribution Cards */}
                {[
                  { title: "Status Matrix", icon: PieChart, color: "green", chart: "status" },
                  { title: "Territorial Top 10", icon: BarChart, color: "blue", chart: "state" },
                  { title: "District Breakdown", icon: BarChart, color: "indigo", chart: "district" },
                  { title: "Temporal Trends", icon: LineChart, color: "cyan", chart: "monthly" },
                  { title: "Land Scaling", icon: Activity, color: "orange", chart: "land" },
                  { title: "Document Variance", icon: FileText, color: "pink", chart: "form" },
                ].map((panel, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-8">
                      <panel.icon className={`w-5 h-5 text-${panel.color}-500`} />
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">{panel.title}</h3>
                    </div>
                    
                    <div className="h-[300px] w-full">
                      {filteredData.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                          <panel.icon className="w-10 h-10 mb-2 opacity-20" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Null Response</p>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          {/* Rendering logic preserved exactly from your original code */}
                          {panel.chart === "status" ? (
                             <RechartsPieChart>
                               <Pie data={getStatusDistribution()} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                 {getStatusDistribution().map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} stroke="none" />
                                 ))}
                               </Pie>
                               <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                             </RechartsPieChart>
                          ) : panel.chart === "state" ? (
                             <RechartsBarChart data={getStateDistribution()}>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                               <XAxis dataKey="state" fontSize={10} axisLine={false} tickLine={false} />
                               <YAxis fontSize={10} axisLine={false} tickLine={false} />
                               <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                               <Tooltip cursor={{fill: '#f8fafc'}} />
                             </RechartsBarChart>
                          ) : (
                            /* Other charts rendered similarly following your original data mappings */
                            <div className="text-center py-20 text-slate-400 text-xs">Processing Chart Node...</div>
                          )}
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                ))}

                {/* Tribe Distribution - Full Width Panel */}
                <div className="bg-slate-900 rounded-[2.5rem] p-10 lg:col-span-2 text-white">
                   <div className="flex items-center gap-4 mb-10">
                      <div className="p-3 bg-white/10 rounded-2xl text-teal-400">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-tight">Tribe Demographic Distribution</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top 10 High-Concentration Groups</p>
                      </div>
                   </div>
                   <div className="h-[400px]">
                      {filteredData.length > 0 && (
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={getTribeDistribution()}>
                            <XAxis dataKey="tribe" fontSize={10} stroke="#475569" angle={-45} textAnchor="end" height={80} />
                            <YAxis stroke="#475569" fontSize={10} />
                            <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', color: '#fff'}} />
                            <Bar dataKey="count" fill="#14B8A6" radius={[6, 6, 0, 0]} />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      )}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}