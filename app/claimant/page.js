'use client';
import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, FileText, AlertCircle, ChevronDown, X } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function ClaimantPage() {
  const [firs, setFirs] = useState([]);
  const [filteredFirs, setFilteredFirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Dynamic filter options from data
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  
  // Selected filters
  const [selectedCrimeType, setSelectedCrimeType] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedPS, setSelectedPS] = useState('');

  // Fetch FIR data from MongoDB
  useEffect(() => {
    fetchFIRData();
  }, []);

  const fetchFIRData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/firs');
      const data = await response.json();
      
      // API returns { firs: [...], count: X }
      const firsList = data.firs || data || [];
      
      setFirs(firsList);
      setFilteredFirs(firsList);
      
      // Extract unique values for filters
      const uniqueCrimeTypes = [...new Set(firsList.map(fir => fir.crime_type))].sort();
      const uniqueDistricts = [...new Set(firsList.map(fir => fir.district))].sort();
      const uniquePS = [...new Set(firsList.map(fir => fir.police_station))].sort();
      
      setCrimeTypes(uniqueCrimeTypes);
      setDistricts(uniqueDistricts);
      setPoliceStations(uniquePS);
      
    } catch (error) {
      console.error('Error fetching FIR data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...firs];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(fir => 
        fir.crime_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fir.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fir.police_station?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fir.fir_number?.toString().includes(searchTerm)
      );
    }
    
    // Crime type filter
    if (selectedCrimeType) {
      filtered = filtered.filter(fir => fir.crime_type === selectedCrimeType);
    }
    
    // District filter
    if (selectedDistrict) {
      filtered = filtered.filter(fir => fir.district === selectedDistrict);
    }
    
    // Police station filter
    if (selectedPS) {
      filtered = filtered.filter(fir => fir.police_station === selectedPS);
    }
    
    setFilteredFirs(filtered);
  }, [searchTerm, selectedCrimeType, selectedDistrict, selectedPS, firs]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCrimeType('');
    setSelectedDistrict('');
    setSelectedPS('');
  };

  const hasActiveFilters = searchTerm || selectedCrimeType || selectedDistrict || selectedPS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">FIR Database</h1>
          <p className="text-gray-600">View and filter all First Information Reports</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search FIRs by crime type, district, or police station..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
                showFilters 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              {/* Crime Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crime Type
                </label>
                <select
                  value={selectedCrimeType}
                  onChange={(e) => setSelectedCrimeType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Crime Types</option>
                  {crimeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* District Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Districts</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* Police Station Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Police Station
                </label>
                <select
                  value={selectedPS}
                  onChange={(e) => setSelectedPS(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Police Stations</option>
                  {policeStations.map(ps => (
                    <option key={ps} value={ps}>{ps}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                  Search: {searchTerm}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                </span>
              )}
              {selectedCrimeType && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                  {selectedCrimeType}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCrimeType('')} />
                </span>
              )}
              {selectedDistrict && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                  {selectedDistrict}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDistrict('')} />
                </span>
              )}
              {selectedPS && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                  {selectedPS}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedPS('')} />
                </span>
              )}
              <button
                onClick={clearFilters}
                className="ml-auto text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredFirs.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{firs.length}</span> FIRs
          </p>
        </div>

        {/* FIR List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredFirs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No FIRs Found</h3>
            <p className="text-gray-600">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFirs.map((fir, index) => (
              <div
                key={fir._id || index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        {fir.crime_type}
                      </h3>
                      {fir.fir_number && (
                        <p className="text-sm text-gray-500">FIR #: {fir.fir_number}</p>
                      )}
                    </div>
                  </div>
                  
                  <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                    fir.crime_type === 'Murder' ? 'bg-red-100 text-red-700' :
                    fir.crime_type === 'Theft' ? 'bg-orange-100 text-orange-700' :
                    fir.crime_type === 'Assault' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {fir.crime_type}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Location */}
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{fir.police_station}</p>
                      <p className="text-sm text-gray-600">{fir.district}</p>
                    </div>
                  </div>

                  {/* Date */}
                  {fir.date && (
                    <div className="flex items-start gap-2">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Date Reported</p>
                        <p className="font-medium text-gray-900">
                          {new Date(fir.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Coordinates */}
                  {fir.latitude && fir.longitude && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Coordinates</p>
                        <p className="font-medium text-gray-900 text-sm">
                          {fir.latitude.toFixed(4)}, {fir.longitude.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional fields if available */}
                {fir.description && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Description</p>
                    <p className="text-gray-700">{fir.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
