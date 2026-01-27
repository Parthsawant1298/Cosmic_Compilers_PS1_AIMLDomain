import mongoose from 'mongoose';

const EligibilityCriteriaSchema = new mongoose.Schema({
  income_criteria: {
    type: { type: String, default: null },
    amount: { type: Number, default: null },
    currency: { type: String, default: 'INR' }
  },
  age_criteria: {
    min_age: { type: Number, default: null },
    max_age: { type: Number, default: null },
    specific_age_groups: [{ type: String }]
  },
  category_criteria: {
    allowed_categories: [{ type: String }],
    excluded_categories: [{ type: String }],
    tribal_specific: { type: Boolean, default: false }
  },
  land_ownership: {
    required: { type: Boolean, default: false },
    max_land_size: { type: Number, default: null },
    min_land_size: { type: Number, default: null },
    unit: { type: String, default: 'hectares' }
  },
  geographic_criteria: {
    rural_only: { type: Boolean, default: false },
    urban_only: { type: Boolean, default: false },
    specific_states: [{ type: String }],
    specific_districts: [{ type: String }]
  },
  family_criteria: {
    max_family_size: { type: Number, default: null },
    min_family_size: { type: Number, default: null }
  },
  benefits: {
    amount: { type: Number, default: null },
    frequency: { type: String, default: null },
    duration: { type: String, default: null }
  },
  documents_required: [{ type: String }],
  special_provisions: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { _id: false });

const ApplicableClaimantSchema = new mongoose.Schema({
  claimant_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'FRAClaim',
    required: true 
  },
  eligibility_score: { type: Number, default: 0 },
  eligibility_reason: { type: String, default: '' },
  is_eligible: { type: Boolean, default: true },
  matched_at: { type: Date, default: Date.now }
}, { _id: false });

const SchemeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    default: '' 
  },
  eligibility_criteria: {
    type: EligibilityCriteriaSchema,
    required: true
  },
  applicable_claimants: [ApplicableClaimantSchema],
  
  // PDF processing metadata
  pdf_filename: { type: String, default: '' },
  pdf_text_extracted: { type: String, default: '' },
  pdf_analysis_status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  },
  
  // Statistics
  total_applicable_claimants: { type: Number, default: 0 },
  average_eligibility_score: { type: Number, default: 0 },
  
  // Metadata
  created_by: { type: String, default: 'System' },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'draft'], 
    default: 'active' 
  },
  version: { type: Number, default: 1 },
  
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: false, // We're handling manually
  collection: 'schemes'
});

// Indexes for better performance
SchemeSchema.index({ name: 1 });
SchemeSchema.index({ status: 1 });
SchemeSchema.index({ 'applicable_claimants.claimant_id': 1 });
SchemeSchema.index({ created_at: -1 });

// Pre-save middleware to update timestamps and stats
SchemeSchema.pre('save', function(next) {
  this.updated_at = new Date();
  
  // Update statistics
  this.total_applicable_claimants = this.applicable_claimants.length;
  
  if (this.applicable_claimants.length > 0) {
    const totalScore = this.applicable_claimants.reduce((sum, claimant) => 
      sum + (claimant.eligibility_score || 0), 0);
    this.average_eligibility_score = Math.round(totalScore / this.applicable_claimants.length);
  } else {
    this.average_eligibility_score = 0;
  }
  
  next();
});

// Instance method to add applicable claimant
SchemeSchema.methods.addApplicableClaimant = function(claimantId, eligibilityScore, reason) {
  // Check if claimant already exists
  const existingIndex = this.applicable_claimants.findIndex(
    claimant => claimant.claimant_id.toString() === claimantId.toString()
  );
  
  if (existingIndex !== -1) {
    // Update existing claimant
    this.applicable_claimants[existingIndex].eligibility_score = eligibilityScore;
    this.applicable_claimants[existingIndex].eligibility_reason = reason;
    this.applicable_claimants[existingIndex].matched_at = new Date();
  } else {
    // Add new claimant
    this.applicable_claimants.push({
      claimant_id: claimantId,
      eligibility_score: eligibilityScore,
      eligibility_reason: reason,
      is_eligible: true,
      matched_at: new Date()
    });
  }
};

// Instance method to remove applicable claimant
SchemeSchema.methods.removeApplicableClaimant = function(claimantId) {
  this.applicable_claimants = this.applicable_claimants.filter(
    claimant => claimant.claimant_id.toString() !== claimantId.toString()
  );
};

// Static method to find schemes by claimant
SchemeSchema.statics.findByClaimant = function(claimantId) {
  return this.find({
    'applicable_claimants.claimant_id': claimantId
  });
};

export default mongoose.models.Scheme || mongoose.model('Scheme', SchemeSchema);