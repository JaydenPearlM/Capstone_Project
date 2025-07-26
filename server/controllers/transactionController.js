const Transaction = require('../models/Transaction');
const logger = require('../config/logger');

// GET /api/v1/transactions
exports.getAll = async (req, res, next) => {
  try {
    const list = await Transaction.find({ user: req.user.id });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

// Fetching transaction data from the Plaid API for the authenticated user

exports.fetchFromPlaid = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const txns = await plaidClient.getTransactions(user.plaidAccessToken);
    res.json(txns);    
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/transactions/:id
exports.getById = async (req, res, next) => {
  try {
    const tx = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
    if (!tx) return res.status(404).json({ message: 'Not found' });
    res.json(tx);
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/transactions
exports.create = async (req, res, next) => {
  try {
    const newTx = await Transaction.create({ ...req.body, user: req.user.id });
    res.status(201).json(newTx);
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/transactions/:id
exports.update = async (req, res, next) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/transactions/:id
exports.remove = async (req, res, next) => {
  try {
    await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

