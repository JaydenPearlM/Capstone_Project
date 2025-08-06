const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  targetDate: Date,
  contributions: [{
    amount: Number,
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

savingsGoalSchema.virtual('progress').get(function () {
  const total = this.contributions.reduce((sum, c) => sum + c.amount, 0);
  const percent = (total / this.goalAmount) * 100;
  return Math.min(percent, 100).toFixed(2);
});

savingsGoalSchema.set('toObject', { virtuals: true });
savingsGoalSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);
