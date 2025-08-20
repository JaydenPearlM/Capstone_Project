import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  brand: { type: String },
  expMonth: String,
  expYear: String,
  limit: Number,
  apr: Number,
  balance: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model("Card", cardSchema);