const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: { 
    type: String, 
    required: true 
  },
  originalBalance: { 
    type: Number, 
    required: true 
  },
  currentBalance: { 
    type: Number, 
    required: true 
  },
  interestRate: { 
    type: Number, 
    required: true 
  },
  minimumPayment: { 
    type: Number, 
    required: true 
  },
  type: {
    type: String,
    enum: ['credit_card', 'student_loan', 'auto_loan', 'mortgage', 'personal_loan', 'other'],
    default: 'other'
  },
  payments: [{
    amount: {
      type: Number,
      required: true
    },
    date: { 
      type: Date, 
      default: Date.now 
    },
    note: String
  }]
}, {
  timestamps: true
});

debtSchema.virtual('paidAmount').get(function () {
  return this.originalBalance - this.currentBalance;
});

debtSchema.virtual('progress').get(function () {
  const paidAmount = this.originalBalance - this.currentBalance;
  const percent = (paidAmount / this.originalBalance) * 100;
  return Math.min(percent, 100).toFixed(1);
});


debtSchema.virtual('remaining').get(function () {
  return this.currentBalance;
});

debtSchema.set('toObject', { virtuals: true });
debtSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Debt', debtSchema);