import mongoose from 'mongoose';

const FamilyMemberSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  age: { type: String, default: '' },
  relation: { type: String, default: '' }
}, { _id: false });

const FRAClaimSchema = new mongoose.Schema({
  form_type: { type: String, default: '' },
  claimant_name: { type: String, default: '' },
  spouse_name: { type: String, default: '' },
  father_mother_name: { type: String, default: '' },
  village: { type: String, default: '' },
  gram_panchayat: { type: String, default: '' },
  tehsil_taluka: { type: String, default: '' },
  district: { type: String, default: '' },
  state: { type: String, default: '' },
  scheduled_tribe: { type: String, default: '' },
  other_traditional_forest_dweller: { type: String, default: '' },
  family_members: [FamilyMemberSchema],
  land_for_habitation: { type: String, default: '' },
  land_for_cultivation: { type: String, default: '' },
  total_land_claimed: { type: String, default: '' },
  application_date: { type: String, default: '' },
  claim_status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  latitude: { type: String, default: null },
  longitude: { type: String, default: null },
  
  // Additional metadata
  processed_by: { type: String, default: 'District Officer' },
  processing_date: { type: Date, default: Date.now },
  extracted_text: { type: String, default: '' },
  detected_language: { type: String, default: '' },
  translated_text: { type: String, default: '' }
}, {
  timestamps: true,
  collection: 'fra_claims'
});

// Index for geospatial queries
FRAClaimSchema.index({ 
  latitude: 1, 
  longitude: 1 
});

// Index for search queries
FRAClaimSchema.index({ 
  claimant_name: 'text', 
  village: 'text', 
  district: 'text',
  state: 'text'
});

export default mongoose.models.FRAClaim || mongoose.model('FRAClaim', FRAClaimSchema);