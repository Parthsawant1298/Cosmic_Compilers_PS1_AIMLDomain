'use client';
import { useState } from 'react';
import { Upload, FileText, MapPin, Database, CheckCircle, AlertCircle, Loader, Camera } from 'lucide-react';

export default function FIRUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a FIR document image');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:5001/process-fir', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to process FIR document');
      }
    } catch (err) {
      setError('Network error. Please ensure the FIR OCR service is running on port 5001.');
    } finally {
      setUploading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    const { fir_data, database_result } = result;

    return (
      <div className="space-y-6">
        {/* Success Header */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">FIR Processing Complete!</h3>
              <p className="text-sm text-green-600">Crime data extracted and saved successfully</p>
            </div>
          </div>
        </div>

        {/* FIR Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Extracted FIR Details
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">FIR Number</label>
                <p className="text-lg font-semibold text-gray-900">{fir_data.fir_number || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Crime Type</label>
                <p className="text-lg font-semibold text-red-600">{fir_data.crime_type || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Police Station</label>
                <p className="text-lg text-gray-900">{fir_data.police_station || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">District</label>
                <p className="text-lg text-gray-900">{fir_data.district || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Incident Date</label>
                <p className="text-lg text-gray-900">{fir_data.incident_date || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Incident Time</label>
                <p className="text-lg text-gray-900">{fir_data.incident_time || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Place of Occurrence</label>
                <p className="text-lg text-gray-900">{fir_data.place_of_occurrence || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  {fir_data.status || 'Under Investigation'}
                </span>
              </div>
            </div>
          </div>

          {/* Legal Sections */}
          {fir_data.sections && fir_data.sections.length > 0 && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-500">Legal Sections</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {fir_data.sections.map((section, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {section}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {fir_data.description && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded-lg">{fir_data.description}</p>
            </div>
          )}
        </div>

        {/* Location Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Location & Coordinates
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Latitude</label>
              <p className="text-lg font-mono text-gray-900">{fir_data.latitude || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Longitude</label>
              <p className="text-lg font-mono text-gray-900">{fir_data.longitude || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600" />
            Database Status
          </h4>

          <div className="flex items-center gap-3">
            {database_result.success ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Successfully saved to database</p>
                  <p className="text-sm text-gray-600">Record ID: {database_result.inserted_id}</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Database save failed</p>
                  <p className="text-sm text-gray-600">{database_result.error}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          FIR Document Processing
        </h1>
        <p className="text-lg text-gray-600">
          Upload FIR images to automatically extract crime data and add to the database
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="text-center space-y-6">
          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
            <input
              type="file"
              id="firFile"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label
              htmlFor="firFile"
              className="cursor-pointer flex flex-col items-center space-y-4"
            >
              <Camera className="w-16 h-16 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {selectedFile ? selectedFile.name : 'Choose FIR Document Image'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports JPG, PNG, PDF, and other image formats
                </p>
              </div>
            </label>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
              uploading
                ? 'bg-blue-400 cursor-not-allowed'
                : selectedFile
                ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {uploading ? (
              <span className="flex items-center gap-3">
                <Loader className="w-5 h-5 animate-spin" />
                Processing FIR Document...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Upload className="w-5 h-5" />
                Process FIR Document
              </span>
            )}
          </button>

          {/* Instructions */}
          <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Ensure the FIR document is clear and readable</li>
              <li>• Support for multiple Indian languages (Hindi, Marathi, English, etc.)</li>
              <li>• The system will automatically extract key details and coordinates</li>
              <li>• Processed data will be saved to the crime database for mapping</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && renderResult()}
    </div>
  );
}