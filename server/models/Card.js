const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nickname: { type: String, required: true },
  type: { type: String, enum: ["debit", "credit", "prepaid"], required: true },
  balance: { type: Number, default: 0 },
  limit: { type: Number }, // only for credit cards
  apr: { type: Number },   // only for credit cards
  dueDate: { type: Date }, // optional
  status: { type: String, enum: ["active", "inactive", "closed"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("Card", CardSchema);
