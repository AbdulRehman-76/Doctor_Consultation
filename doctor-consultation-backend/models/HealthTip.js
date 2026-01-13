const mongoose = require('mongoose');

const healthTipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['nutrition', 'exercise', 'mental-health', 'general'],
    default: 'general'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HealthTip', healthTipSchema);