const express = require('express');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// GET all categories for the authenticated user
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create category for the authenticated user
router.post('/', async(req, res) => {
  try {
    const {name, budget} = req.body;
    const newCategory = new Category({
      name, 
      budget, 
      user: req.user._id
    });
    const saved = await newCategory.save();
    res.json(saved);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update category (only if owned by user)
router.put('/:id', async (req, res) => {
  try {
    const { name, budget } = req.body;
    const updated = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, budget },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: 'Category not found or not authorized' });
    }
    
    res.json(updated);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE category and its transactions (only if owned by user)
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found or not authorized' });
    }
    
    // Delete all transactions for this category
    await Transaction.deleteMany({ 
      categoryId: req.params.id, 
      user: req.user._id 
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

