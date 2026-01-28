const mongoose = require('mongoose');

const patternPredictionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  pattern_name: {
    type: String,
    required: true
  },
  risk_level: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  affected_areas: {
    type: String,
    required: true
  },
  recommended_action: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'pattern_predictions',
  timestamps: true
});

// Index for efficient querying
patternPredictionSchema.index({ district: 1 });
patternPredictionSchema.index({ risk_level: 1 });
patternPredictionSchema.index({ timestamp: -1 });

const PatternPrediction = mongoose.model('PatternPrediction', patternPredictionSchema);

module.exports = PatternPrediction;
