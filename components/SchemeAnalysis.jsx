'use client';
import React, { useState, useEffect } from 'react';
import { Upload, FileText, Users, Eye, Download, AlertCircle, CheckCircle, Clock, RefreshCw, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Phone, Menu, X, LogOut } from 'lucide-react';
import Footer from './Footer';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const SchemeAnalysis = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [schemeClaimants, setSchemeClaimants] = useState([]);
  const [uploadResults, setUploadResults] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [schemeName, setSchemeName] = useState('');
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [overallAnalytics, setOverallAnalytics] = useState(null);

  // Flask API URL - hardcoded for direct connection
  const FLASK_API_URL = 'http://localhost:5001/api';

  // Load schemes on component mount
  useEffect(() => {
    loadSchemes();
  }, []);

  // Calculate overall analytics when schemes change
  useEffect(() => {
    if (schemes && schemes.length > 0) {
      setOverallAnalytics(calculateOverallAnalytics());
    }
  }, [schemes]);

  const loadSchemes = async () => {
    try {
      const response = await fetch(`${FLASK_API_URL}/schemes`);
      const data = await response.json();
      if (data.success) {
        setSchemes(data.schemes);
      }
    } catch (error) {
      console.error('Error loading schemes:', error);
    }
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSchemeNameChange = (event) => {
    setSchemeName(event.target.value);
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile || !schemeName.trim()) {
      alert('Please select a PDF file and enter a scheme name');
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a PDF file');
      return;
    }

    setLoading(true);
    setUploadResults(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('scheme_name', schemeName.trim());

    try {
      const response = await fetch(`${FLASK_API_URL}/upload-scheme`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadResults(data);
        loadSchemes(); // Reload schemes list
        setSchemeName('');
        setSelectedFile(null);
        // Reset file input
        document.getElementById('fileInput').value = '';
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please make sure the Flask server is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  const loadSchemeClaimants = async (schemeId, schemeName) => {
    try {
      setLoading(true);
      const response = await fetch(`${FLASK_API_URL}/scheme/${schemeId}/claimants`);
      const data = await response.json();

      if (data.success) {
        setSelectedScheme({ id: schemeId, name: schemeName });
        setSchemeClaimants(data.claimants);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error loading claimants:', error);
      alert('Failed to load claimants');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN');
    } catch {
      return 'N/A';
    }
  };

  const reAnalyzeScheme = async (schemeId, schemeName) => {
    if (!confirm(`Re-analyze scheme "${schemeName}" with updated matching logic? This may take a few moments.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${FLASK_API_URL}/re-analyze-scheme/${schemeId}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        alert(`Re-analysis complete! Found ${data.total_matched_claimants} eligible claimants.`);
        loadSchemes(); // Reload schemes list to show updated counts
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Re-analysis error:', error);
      alert('Re-analysis failed. Please check the server logs.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const showCriteria = (criteria) => {
    setSelectedCriteria(criteria);
    setShowCriteriaModal(true);
  };

  const loadSchemeAnalytics = async (schemeId, schemeName) => {
    try {
      setLoading(true);
      const response = await fetch(`${FLASK_API_URL}/scheme/${schemeId}/analytics`);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.analytics);
        setShowAnalytics(true);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      alert('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // Colors for charts
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const calculateOverallAnalytics = () => {
    if (!schemes || schemes.length === 0) return null;

    const totalSchemes = schemes.length;
    const totalEligibleAcrossSchemes = schemes.reduce((sum, scheme) => sum + (scheme.total_applicable_claimants || 0), 0);
    const averageEligibilityRate = schemes.reduce((sum, scheme) => sum + (scheme.average_eligibility_score || 0), 0) / totalSchemes;

    // Scheme status distribution
    const schemeStatusDistribution = schemes.reduce((acc, scheme) => {
      const status = scheme.status || 'active';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Top performing schemes by eligible claimants
    const topSchemes = schemes
      .map(scheme => ({
        name: scheme.name,
        eligible_claimants: scheme.total_applicable_claimants || 0,
        avg_score: scheme.average_eligibility_score || 0
      }))
      .sort((a, b) => b.eligible_claimants - a.eligible_claimants)
      .slice(0, 5);

    // Eligibility score ranges across all schemes
    const scoreRanges = schemes.reduce((acc, scheme) => {
      const avgScore = scheme.average_eligibility_score || 0;
      if (avgScore <= 25) acc['0-25']++;
      else if (avgScore <= 50) acc['26-50']++;
      else if (avgScore <= 75) acc['51-75']++;
      else acc['76-100']++;
      return acc;
    }, { '0-25': 0, '26-50': 0, '51-75': 0, '76-100': 0 });

    return {
      totalSchemes,
      totalEligibleAcrossSchemes,
      averageEligibilityRate: Math.round(averageEligibilityRate * 10) / 10,
      schemeStatusDistribution: Object.entries(schemeStatusDistribution).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count
      })),
      topSchemes,
      scoreRangeDistribution: Object.entries(scoreRanges).map(([range, count]) => ({
        range,
        count
      }))
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50">
        {/* Top contact bar */}
        <div className="py-2 px-4 bg-black text-white">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm gap-2 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Government of India - Ministry of Tribal Affairs</span>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <span>Forest Rights Act Digitization Initiative</span>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="bg-white border-b border-gray-300">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3">
                <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  TC
                </div>
                <div>
                  <h1 className="text-xl font-bold text-green-600">
                    Tribal Connect
                  </h1>
                  <p className="text-sm text-gray-600">
                    Forest Rights Act Platform
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                <Link
                  href="/access-portal/district-officer"
                  className="transition-colors text-green-600 hover:text-green-700"
                >
                  OCR Processing
                </Link>
                <Link
                  href="/access-portal/fra-atlas"
                  className="transition-colors text-green-600 hover:text-green-700"
                >
                  FRA Atlas
                </Link>
                <Link
                  href="/officer-dss"
                  className="transition-colors text-green-600 hover:text-green-700"
                >
                  DSS Recommendations
                </Link>
                <Link
                  href="/claimant"
                  className="transition-colors text-green-600 hover:text-green-700"
                >
                  Claimant Database
                </Link>
                <Link
                  href="/scheme-analysis"
                  className="transition-colors text-green-600 hover:text-green-700 font-semibold"
                >
                  Scheme Analysis
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Link>
              </nav>

              {/* Mobile menu button */}
              <button
                className="md:hidden text-black"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <nav className="md:hidden mt-4 pb-4 pt-4 border-t border-gray-300">
                <div className="flex flex-col gap-4">
                  <Link
                    href="/access-portal/district-officer"
                    className="transition-colors text-green-600 hover:text-green-700"
                  >
                    OCR Processing
                  </Link>
                  <Link
                    href="/access-portal/fra-atlas"
                    className="transition-colors text-green-600 hover:text-green-700"
                  >
                    FRA Atlas
                  </Link>
                  <Link
                    href="/officer-dss"
                    className="transition-colors text-green-600 hover:text-green-700"
                  >
                    DSS Recommendations
                  </Link>
                  <Link
                    href="/claimant"
                    className="transition-colors text-green-600 hover:text-green-700"
                  >
                    Claimant Database
                  </Link>
                  <Link
                    href="/scheme-analysis"
                    className="transition-colors text-green-600 hover:text-green-700 font-semibold"
                  >
                    Scheme Analysis
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Link>
                </div>
              </nav>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI-Powered Scheme Analysis & FRA Claimant Matching
        </h1>
        <p className="text-lg text-gray-600">
          Upload government scheme PDFs to automatically extract eligibility criteria and match with FRA claimants
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Upload className="w-6 h-6 mr-2" />
          Upload New Scheme
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scheme Name *
            </label>
            <input
              type="text"
              value={schemeName}
              onChange={handleSchemeNameChange}
              placeholder="Enter scheme name (e.g., PM-JANMAN, FRA Scheme 2024)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDF Document *
            </label>
            <input
              type="file"
              id="fileInput"
              accept=".pdf"
              onChange={handleFileSelect}
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleUploadAndAnalyze}
            disabled={loading || !selectedFile || !schemeName.trim()}
            className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg"
          >
            <Upload className="w-5 h-5 mr-3" />
            {loading ? 'Analyzing...' : 'Upload & Analyze Scheme'}
          </button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-600 font-medium">
                Analyzing PDF and matching claimants...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Upload Results */}
      {uploadResults && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
            <CheckCircle className="w-6 h-6 mr-2" />
            Analysis Complete!
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-700">Scheme Name</h4>
              <p className="text-lg font-semibold text-blue-600">{uploadResults.scheme_name}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-700">Matched Claimants</h4>
              <p className="text-lg font-semibold text-green-600">{uploadResults.total_matched_claimants}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-700">Scheme ID</h4>
              <p className="text-sm font-mono text-gray-600">{uploadResults.scheme_id}</p>
            </div>
          </div>

          {/* Preview of matched claimants */}
          {uploadResults.matched_claimants && uploadResults.matched_claimants.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Top Matched Claimants (Preview)</h4>
              <div className="bg-white rounded-lg overflow-hidden">
                <div className="max-h-60 overflow-y-auto">
                  {uploadResults.matched_claimants.slice(0, 5).map((claimant, index) => (
                    <div key={index} className="p-3 border-b border-gray-100 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{claimant.claimant_name}</p>
                        <p className="text-sm text-gray-600">{claimant.village}, {claimant.district}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">Score: {claimant.eligibility_score}</p>
                        <p className="text-xs text-gray-500">Eligible</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overall Analytics Dashboard */}
      {overallAnalytics && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-purple-600" />
            Overall Scheme Analytics
          </h2>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800">Total Schemes</h4>
              <p className="text-2xl font-bold text-blue-600">{overallAnalytics.totalSchemes}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800">Total Eligible Claimants</h4>
              <p className="text-2xl font-bold text-green-600">{overallAnalytics.totalEligibleAcrossSchemes}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800">Average Score</h4>
              <p className="text-2xl font-bold text-purple-600">{overallAnalytics.averageEligibilityRate}/100</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-800">Active Schemes</h4>
              <p className="text-2xl font-bold text-orange-600">
                {overallAnalytics.schemeStatusDistribution.find(s => s.status === 'Active')?.count || 0}
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            {/* Top Performing Schemes */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Top Performing Schemes
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={overallAnalytics.topSchemes}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [value, name === 'eligible_claimants' ? 'Eligible Claimants' : 'Avg Score']}
                      labelFormatter={(label) => `Scheme: ${label}`}
                    />
                    <Bar dataKey="eligible_claimants" fill="#10b981" name="eligible_claimants" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Score Range Distribution */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-green-600" />
                Score Range Distribution
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={overallAnalytics.scoreRangeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({range, count}) => count > 0 ? `${range}: ${count}` : ''}
                    >
                      {overallAnalytics.scoreRangeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schemes List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          All Schemes ({schemes.length})
        </h2>

        {schemes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No schemes uploaded yet. Upload your first scheme PDF to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {schemes.map((scheme) => (
              <div key={scheme._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{scheme.name}</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(scheme.pdf_analysis_status)}
                    <span className="text-sm text-gray-600">{scheme.pdf_analysis_status || 'completed'}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium">{formatDate(scheme.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Eligible Claimants</p>
                    <p className="font-medium text-green-600">{scheme.total_applicable_claimants || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Score</p>
                    <p className="font-medium">{Math.round(scheme.average_eligibility_score || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      scheme.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {scheme.status || 'active'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => loadSchemeClaimants(scheme._id, scheme.name)}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View Claimants ({scheme.total_applicable_claimants || 0})
                  </button>

                  <button
                    onClick={() => loadSchemeAnalytics(scheme._id, scheme.name)}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </button>

                  <button
                    onClick={() => reAnalyzeScheme(scheme._id, scheme.name)}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Re-analyze
                  </button>

                  <button
                    onClick={() => showCriteria(scheme.eligibility_criteria)}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Criteria
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Scheme Claimants Modal */}
      {selectedScheme && schemeClaimants.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Eligible Claimants for: {selectedScheme.name}
                </h3>
                <button
                  onClick={() => {
                    setSelectedScheme(null);
                    setSchemeClaimants([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mt-1">Total: {schemeClaimants.length} eligible claimants</p>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                {schemeClaimants.map((item, index) => {
                  const claimant = item.claimant_data;
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">{claimant.claimant_name}</h4>
                          <p className="text-sm text-gray-600">
                            {claimant.village}, {claimant.district}, {claimant.state}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                            Score: {item.eligibility_score}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-gray-600">Tribal Status:</span>
                          <p className="font-medium">{claimant.scheduled_tribe || 'No'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Forest Dweller:</span>
                          <p className="font-medium">{claimant.other_traditional_forest_dweller || 'No'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Land Claimed:</span>
                          <p className="font-medium">{claimant.total_land_claimed || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <p className="font-medium">{claimant.claim_status || 'Pending'}</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h5 className="font-medium text-blue-800 mb-1">Eligibility Reason:</h5>
                        <p className="text-sm text-blue-700">{item.eligibility_reason}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && analytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2 text-purple-600" />
                  Scheme Analytics: {analytics.scheme_name || 'Scheme'}
                </h3>
                <button
                  onClick={() => {
                    setShowAnalytics(false);
                    setAnalytics(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800">Total Claimants in DB</h4>
                  <p className="text-2xl font-bold text-blue-600">{analytics.total_database_claimants}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800">Eligible Claimants</h4>
                  <p className="text-2xl font-bold text-green-600">{analytics.eligible_claimants}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800">Eligibility Rate</h4>
                  <p className="text-2xl font-bold text-purple-600">{analytics.eligibility_rate}%</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-800">Average Score</h4>
                  <p className="text-2xl font-bold text-orange-600">{analytics.average_score}/100</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Score Distribution */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Score Distribution
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={analytics.score_distribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-green-600" />
                    Category Distribution
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={analytics.category_distribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="count"
                          label={({category, count}) => `${category}: ${count}`}
                        >
                          {analytics.category_distribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Geographic Distribution */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                  Top Districts by Eligible Claimants
                </h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={analytics.geographic_distribution}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="district"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [value, 'Eligible Claimants']}
                        labelFormatter={(label) => `District: ${label}`}
                      />
                      <Bar dataKey="count" fill="#8b5cf6" stroke="#7c3aed" strokeWidth={1} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Criteria Modal */}
      {showCriteriaModal && selectedCriteria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Scheme Eligibility Criteria</h3>
                <button
                  onClick={() => {
                    setShowCriteriaModal(false);
                    setSelectedCriteria(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                {selectedCriteria.tribal_categories && selectedCriteria.tribal_categories.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">Tribal Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCriteria.tribal_categories.map((category, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCriteria.land_ownership && (
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">Land Ownership Requirements</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {typeof selectedCriteria.land_ownership === 'object' ? (
                        <div className="space-y-1">
                          {selectedCriteria.land_ownership.max_land_size && (
                            <p className="text-gray-700">Maximum Land Size: {selectedCriteria.land_ownership.max_land_size} {selectedCriteria.land_ownership.unit || 'acres'}</p>
                          )}
                          {selectedCriteria.land_ownership.min_land_size && (
                            <p className="text-gray-700">Minimum Land Size: {selectedCriteria.land_ownership.min_land_size} {selectedCriteria.land_ownership.unit || 'acres'}</p>
                          )}
                          {selectedCriteria.land_ownership.required && (
                            <p className="text-gray-700">Required: {selectedCriteria.land_ownership.required}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-700">{selectedCriteria.land_ownership}</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedCriteria.geographic_restrictions && selectedCriteria.geographic_restrictions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">Geographic Restrictions</h4>
                    <div className="space-y-2">
                      {selectedCriteria.geographic_restrictions.map((restriction, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-700">{restriction}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCriteria.income_limits && (
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">Income Limits</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {typeof selectedCriteria.income_limits === 'object' ? (
                        <div className="space-y-1">
                          {selectedCriteria.income_limits.maximum && (
                            <p className="text-gray-700">Maximum Income: ₹{selectedCriteria.income_limits.maximum}</p>
                          )}
                          {selectedCriteria.income_limits.minimum && (
                            <p className="text-gray-700">Minimum Income: ₹{selectedCriteria.income_limits.minimum}</p>
                          )}
                          {selectedCriteria.income_limits.currency && (
                            <p className="text-gray-700">Currency: {selectedCriteria.income_limits.currency}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-700">{selectedCriteria.income_limits}</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedCriteria.other_requirements && selectedCriteria.other_requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">Other Requirements</h4>
                    <div className="space-y-2">
                      {selectedCriteria.other_requirements.map((requirement, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-700">{requirement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCriteria.benefits && (
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">Benefits Offered</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {typeof selectedCriteria.benefits === 'object' ? (
                        <div className="space-y-1">
                          {selectedCriteria.benefits.amount && (
                            <p className="text-gray-700">Amount: ₹{selectedCriteria.benefits.amount}</p>
                          )}
                          {selectedCriteria.benefits.type && (
                            <p className="text-gray-700">Type: {selectedCriteria.benefits.type}</p>
                          )}
                          {selectedCriteria.benefits.description && (
                            <p className="text-gray-700">Description: {selectedCriteria.benefits.description}</p>
                          )}
                          {selectedCriteria.benefits.frequency && (
                            <p className="text-gray-700">Frequency: {selectedCriteria.benefits.frequency}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-700">{selectedCriteria.benefits}</p>
                      )}
                    </div>
                  </div>
                )}

                {(!selectedCriteria.tribal_categories || selectedCriteria.tribal_categories.length === 0) &&
                 !selectedCriteria.land_ownership &&
                 (!selectedCriteria.geographic_restrictions || selectedCriteria.geographic_restrictions.length === 0) &&
                 !selectedCriteria.income_limits &&
                 (!selectedCriteria.other_requirements || selectedCriteria.other_requirements.length === 0) &&
                 !selectedCriteria.benefits && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>No structured criteria extracted. Raw criteria:</p>
                    <pre className="mt-4 p-4 bg-gray-50 rounded-lg text-left text-sm overflow-x-auto">
                      {JSON.stringify(selectedCriteria, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer />
  </div>
);
};

export default SchemeAnalysis;