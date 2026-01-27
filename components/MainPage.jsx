"use client";
import { useState } from "react";
import { 
  FileText, 
  Upload, 
  CheckCircle,
  AlertCircle,
  Image,
  Loader,
  Eye,
  MapPin,
  Users,
  Calendar,
  Globe,
  Database,
  Map,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function FRAOCRInterface() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResults, setOcrResults] = useState(null);
  const [error, setError] = useState(null);
  const [claimStatus, setClaimStatus] = useState('pending');
  const [showDetails, setShowDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setOcrResults(null);
      setError(null);
      setShowDetails(false);
      setClaimStatus('pending');
    }
  };

  const processOCR = async () => {
    if (!selectedImage) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      
      const response = await fetch('http://localhost:5000/process', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('OCR processing failed');
      }
      
      const result = await response.json();
      setOcrResults(result);
      setShowDetails(false); // Reset to not show details initially
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = () => {
    if (ocrResults) {
      // Update the structured data with selected status
      const updatedData = {
        ...ocrResults.structured_data,
        claim_status: claimStatus
      };
      
      // Update the results with new status
      setOcrResults({
        ...ocrResults,
        structured_data: updatedData
      });
      
      setShowDetails(true);
    }
  };

  const saveToDatabase = async () => {
    if (!ocrResults?.structured_data) return;
    
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // Prepare the data to save
      const dataToSave = {
        ...ocrResults.structured_data,
        extracted_text: ocrResults.extracted_text,
        detected_language: ocrResults.language,
        translated_text: ocrResults.translated_text || ocrResults.extracted_text,
        claim_status: claimStatus
      };
      
      const response = await fetch('/api/save-claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSaveMessage({
          type: 'success',
          text: result.message
        });
      } else {
        setSaveMessage({
          type: 'error',
          text: result.message || 'Failed to save data'
        });
      }
    } catch (error) {
      setSaveMessage({
        type: 'error',
        text: 'Network error: Failed to save data'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center py-30">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Forest Rights Act Document Processing
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Upload FRA claim documents in any Indian language. Our AI-powered system will extract, 
            translate, and structure the data with GPS coordinates automatically.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Document Upload & Processing</h3>
            <p className="text-sm text-gray-500 mt-1">
              Supports Marathi, Hindi, English, Tamil, Malayalam, Telugu, Gujarati, Bengali, Kannada, Odia, Punjabi and other Indian languages
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Area */}
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-medium text-gray-900 mb-2">Upload FRA Document</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Supports PNG, JPG, JPEG files up to 16MB
                    </p>
                    <span className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors inline-block">
                      Choose File
                    </span>
                  </label>
                </div>
                
                {selectedImage && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Image className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{selectedImage.name}</span>
                      </div>
                      <button
                        onClick={processOCR}
                        disabled={isProcessing}
                        className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isProcessing ? (
                          <>
                            <Loader className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Eye className="w-5 h-5 mr-2" />
                            Process Document
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Area */}
              <div>
                {selectedImage && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Document Preview</h4>
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Document preview"
                      className="w-full h-64 object-contain border border-gray-200 rounded"
                    />
                  </div>
                )}
                
                {!selectedImage && (
                  <div className="border border-gray-200 rounded-lg p-8 text-center">
                    <div className="text-gray-400">
                      <FileText className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-sm">Document preview will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Processing Steps Indicator */}
        {isProcessing && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Processing Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Loader className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-spin" />
                  <p className="text-sm font-medium text-blue-800">OCR Extraction</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Globe className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Language Detection</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Translation</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Data Extraction</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">GPS Coordinates</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {ocrResults && !showDetails && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Processing Complete - Review & Set Status</h3>
              <p className="text-sm text-gray-500 mt-1">Review the extracted information and set claim status before viewing full details</p>
            </div>
            <div className="p-6 space-y-6">
              {/* Processing Status */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800">OCR Complete</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-800">Language: {ocrResults.language}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-purple-800">Translated</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-orange-800">Data Extracted</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800">GPS Located</p>
                </div>
              </div>

              {/* Uploaded Document Preview */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Uploaded Document</h4>
                <div className="flex justify-center">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Uploaded FRA document"
                    className="max-w-full max-h-96 object-contain border border-gray-200 rounded"
                  />
                </div>
              </div>

              {/* Language Detection Display */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Globe className="w-6 h-6 text-blue-600 mr-2" />
                  <h4 className="text-lg font-medium text-gray-900">Language Detection</h4>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Detected Language:</p>
                  <p className="text-xl font-semibold text-blue-900">{ocrResults.language}</p>
                </div>
              </div>

              {/* Extracted Text - Full Display */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Complete Extracted Text</h4>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {ocrResults.extracted_text}
                  </pre>
                </div>
              </div>

              {/* Status Selection */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Set Claim Status</h4>
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Status:</label>
                  <select
                    value={claimStatus}
                    onChange={(e) => setClaimStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <div className="flex-1"></div>
                  <button
                    onClick={handleNext}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 flex items-center"
                  >
                    Next - View Full Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Details Section - Only shown after clicking Next */}
        {ocrResults && showDetails && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Extraction Results</h3>
              <div className="flex space-x-3">
                <button
                  onClick={saveToDatabase}
                  disabled={isSaving}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSaving ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 mr-2" />
                      Save in Database and Plot
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Save Message */}
            {saveMessage && (
              <div className={`px-6 py-4 border-b border-gray-200 ${
                saveMessage.type === 'success' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <div className="flex items-center">
                  {saveMessage.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  )}
                  <span className={`text-sm font-medium ${
                    saveMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {saveMessage.text}
                  </span>
                </div>
              </div>
            )}
            <div className="p-6 space-y-6">
              {/* Processing Status */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800">OCR Complete</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-800">Language: {ocrResults.language}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-purple-800">Translated</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-orange-800">Data Extracted</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800">GPS Located</p>
                </div>
              </div>

              {/* Main Information Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Claimant Information */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Users className="w-6 h-6 text-green-600 mr-2" />
                    <h4 className="text-lg font-medium text-gray-900">Claimant Information</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{ocrResults.structured_data.claimant_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Spouse:</span>
                      <span className="font-medium">{ocrResults.structured_data.spouse_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Father/Mother:</span>
                      <span className="font-medium text-right">{ocrResults.structured_data.father_mother_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Scheduled Tribe:</span>
                      <span className="font-medium">{ocrResults.structured_data.scheduled_tribe || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Other Forest Dweller:</span>
                      <span className="font-medium">{ocrResults.structured_data.other_traditional_forest_dweller || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-6 h-6 text-green-600 mr-2" />
                    <h4 className="text-lg font-medium text-gray-900">Location Details</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Village:</span>
                      <span className="font-medium">{ocrResults.structured_data.village || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gram Panchayat:</span>
                      <span className="font-medium">{ocrResults.structured_data.gram_panchayat || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tehsil:</span>
                      <span className="font-medium">{ocrResults.structured_data.tehsil_taluka || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">District:</span>
                      <span className="font-medium">{ocrResults.structured_data.district || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">State:</span>
                      <span className="font-medium">{ocrResults.structured_data.state || 'N/A'}</span>
                    </div>
                    {(ocrResults.structured_data.latitude && ocrResults.structured_data.longitude) && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">GPS Coordinates:</p>
                        <p className="font-mono text-sm text-green-800">
                          {ocrResults.structured_data.latitude}, {ocrResults.structured_data.longitude}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Land Information */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Land Claims Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Habitation Land</p>
                    <p className="text-lg font-semibold text-blue-900">{ocrResults.structured_data.land_for_habitation || 'Not specified'}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Cultivation Land</p>
                    <p className="text-lg font-semibold text-green-900">{ocrResults.structured_data.land_for_cultivation || 'Not specified'}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total Land Claimed</p>
                    <p className="text-lg font-semibold text-purple-900">{ocrResults.structured_data.total_land_claimed || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Family Members */}
              {ocrResults.structured_data.family_members && ocrResults.structured_data.family_members.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Family Members</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Relation</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {ocrResults.structured_data.family_members.map((member, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900">{member.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{member.age}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{member.relation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Application Details */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="w-6 h-6 text-green-600 mr-2" />
                  <h4 className="text-lg font-medium text-gray-900">Application Details</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Form Type</p>
                    <p className="font-medium">{ocrResults.structured_data.form_type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Application Date</p>
                    <p className="font-medium">{ocrResults.structured_data.application_date || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`font-medium capitalize ${
                      claimStatus === 'approved' ? 'text-green-600' : 
                      claimStatus === 'rejected' ? 'text-red-600' : 
                      'text-yellow-600'
                    }`}>{claimStatus}</p>
                  </div>
                </div>
              </div>

              {/* Raw Text Preview */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Complete Extracted Text</h4>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {ocrResults.extracted_text}
                  </pre>
                </div>
              </div>

              {/* Back to Edit Status Button */}
              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setShowDetails(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
                >
                  Back to Edit Status
                </button>
                <div className="text-sm text-gray-500">
                  Status: <span className={`font-medium capitalize ${
                    claimStatus === 'approved' ? 'text-green-600' : 
                    claimStatus === 'rejected' ? 'text-red-600' : 
                    'text-yellow-600'
                  }`}>{claimStatus}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}