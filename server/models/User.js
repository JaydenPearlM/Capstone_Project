const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  plaidAccessToken: String,    
  plaidItemId: String,         
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
