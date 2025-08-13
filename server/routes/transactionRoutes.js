const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// GET all transactions for the authenticated user
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id })
            .populate('categoryId', 'name budget');
        res.json(transactions);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST create transaction for the authenticated user
router.post('/', async (req, res) => {
    try {
        const { description, amount, categoryId, type, date } = req.body;
        const newTransaction = new Transaction({ 
            description, 
            amount, 
            categoryId, 
            type, 
            date,
            user: req.user._id
        });
        const saved = await newTransaction.save();
        res.json(saved);
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update transaction (only if owned by user)
router.put('/:id', async (req, res) => {
    try {
        const { description, amount, categoryId, type, date } = req.body;
        const updated = await Transaction.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { description, amount, categoryId, type, date },
            { new: true }
        );
        
        if (!updated) {
            return res.status(404).json({ message: 'Transaction not found or not authorized' });
        }
        
        res.json(updated);
    } catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE transaction (only if owned by user)
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Transaction.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user._id 
        });
        
        if (!deleted) {
            return res.status(404).json({ message: 'Transaction not found or not authorized' });
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
