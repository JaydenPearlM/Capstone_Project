const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

router.get('/', async (req, res) => {
  try {
    // Fetch all categories
    const categories = await Category.find();

    // Fetch all transactions
    const transactions = await Transaction.find();

    // Build category summaries
    const categorySummaries = categories.map((cat) => {
      const spent = transactions
        .filter((tx) => tx.categoryId?.toString() === cat._id.toString())
        .reduce((sum, tx) => sum + tx.amount, 0);

      return {
        _id: cat._id,
        name: cat.name,
        budget: cat.budget,
        spent,
      };
    });

    // Totals
    const totalBudget = categorySummaries.reduce((sum, cat) => sum + Number(cat.budget), 0);
    const totalSpent = categorySummaries.reduce((sum, cat) => sum + cat.spent, 0);
    const remaining = totalBudget - totalSpent;

    res.json({
      totalBudget,
      totalSpent,
      remaining,
      categorySummaries,
    });
  } catch (err) {
    console.error('Failed to get budget summary:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
