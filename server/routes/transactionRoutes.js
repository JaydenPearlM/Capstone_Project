// const router = require('express').Router();
const ctrl = require('../controllers/transactionController');
const { fetchFromPlaid } = require('../controllers/transactionController');
const logger = require('../config/logger');

const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();

// GET all transactions
// router.get('/', ctrl.getAll);
router.get('/', async (req, res) => {
    const transactions = await Transaction.find();
    res.json(transactions);
});

// POST create transaction
// router.post('/', ctrl.create);
router.post('/', async (req, res) => {
    const { description, amount, categoryId, type, date } = req.body;
    const newTransaction = new Transaction({ description, amount, categoryId, type, date });
    const saved = await newTransaction.save();
    res.json(saved);
});

// PUT update transaction
// router.put('/:id', ctrl.update);
router.put('/:id', async (req, res) => {
    const { description, amount, categoryId, type, date } = req.body;
    const updated = await Transaction.findByIdAndUpdate(
        req.params.id,
        { description, amount, categoryId, type, date },
        { new: true }
    );
    res.json(updated);
});

// DELETE transaction
//router.delete('/:id', ctrl.remove);
router.delete('/:id', async (req, res) => {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});
// router.get('/fetch', fetchFromPlaid);

// optional: add validation/auth middleware here later
/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 *     responses:
 *       200:
 *         description: A list of transactions.
 */

// router.get('/:id', ctrl.getById);

module.exports = router;
