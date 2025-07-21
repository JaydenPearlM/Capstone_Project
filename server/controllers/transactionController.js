const Transaction = require('../models/Transaction');

exports.getAll = async (req, res) => {
  const txs = await Transaction.find().populate('category');
  res.json(txs);
};
exports.getById = async (req,res) => { /*...*/ };
exports.create  = async (req,res) => { /*...*/ };
exports.update  = async (req,res) => { /*...*/ };
exports.remove  = async (req,res) => { /*...*/ };
