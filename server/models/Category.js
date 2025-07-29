const mongoose = require('mongoose');
const catSchema = new mongoose.Schema({
  name: { type: String, required: true },
  budget: {type: Number, required: true}
});
module.exports = mongoose.model('Category', catSchema);
