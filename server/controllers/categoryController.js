// server/controllers/categoryController.js
const Category = require('../models/Category');
const logger = require('../config/logger');


exports.getAll = async (req, res) => {
  const cats = await Category.find();
  res.json(cats);
};

exports.getById = async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ error: 'Category not found' });
  res.json(cat);
};

exports.create = async (req, res) => {
  try {
    const newCat = await Category.create(req.body);
    res.status(201).json(newCat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
