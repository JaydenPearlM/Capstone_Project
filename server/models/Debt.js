const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creditor: { type: String, required: true },
  balance: { type: Number, required: true },
  minimumPayment: { type: Number, required: true },
  dueDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('Debt', debtSchema);
