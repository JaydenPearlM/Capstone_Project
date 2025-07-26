// server/tests/fixtures/categories.js
const mongoose = require('mongoose');

const categoryFixtures = [
  {
    _id: new mongoose.Types.ObjectId('5f8d0d55e3a9d93f9c1c2c31'),
    name: 'Food & Dining',
    type: 'expense',
    color: '#FF5733',
    icon: 'utensils'
  },
  {
    _id: new mongoose.Types.ObjectId('5f8d0d55e3a9d93f9c1c2c32'),
    name: 'Transportation',
    type: 'expense',
    color: '#33A1FF',
    icon: 'car'
  },
  {
    _id: new mongoose.Types.ObjectId('5f8d0d55e3a9d93f9c1c2c33'),
    name: 'Income',
    type: 'income',
    color: '#33FF57',
    icon: 'dollar-sign'
  }
];

module.exports = categoryFixtures;
