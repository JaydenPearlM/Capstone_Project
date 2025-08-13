const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount:     { type: Number, required: true },
  date:       { type: Date,   required: true },
  type:       { type: String, enum: ['income','expense'], required: true },
  categoryId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  description:{ type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
