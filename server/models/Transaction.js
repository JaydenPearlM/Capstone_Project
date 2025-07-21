const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount:     { type: Number, required: true },
  date:       { type: Date,   required: true },
  type:       { type: String, enum: ['income','expense'], required: true },
  category:   { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  description:{ type: String }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
