import mongoose from 'mongoose';

const DSSRecommendationSchema = new mongoose.Schema({
  claimId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FRAClaim',
    required: true,
    index: true
  },
  claimantName: {
    type: String,
    required: true
  },
  priority: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  recommendation: {
    type: String,
    required: true
  },
  reasoning: {
    type: String,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  suggestedAction: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  analyzedBy: {
    type: String,
    required: true
  },
  analyzedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  // Additional metadata
  batchId: {
    type: String,
    index: true
  },
  analysisVersion: {
    type: String,
    default: '1.0'
  }
}, {
  timestamps: true,
  collection: 'dss_recommendations'
});

// Compound indexes for efficient queries
DSSRecommendationSchema.index({ claimId: 1, isActive: 1 });
DSSRecommendationSchema.index({ analyzedAt: -1 });
DSSRecommendationSchema.index({ priority: -1, analyzedAt: -1 });

export default mongoose.models.DSSRecommendation || mongoose.model('DSSRecommendation', DSSRecommendationSchema);