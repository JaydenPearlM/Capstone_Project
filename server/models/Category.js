const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
  name: { type: String, required: true },
  budget: { type: Number, required: true },
  budgetPeriod: { type: String, enum: ['monthly', 'biweekly', 'weekly'], default: 'monthly' },
  isRecurring: { type: Boolean, default: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Category', catSchema);
