// server/tests/fixtures/transactions.js
const mongoose = require('mongoose');

const userId = new mongoose.Types.ObjectId('5f8d0d55e3a9d93f9c1c2c30');
const categoryId = new mongoose.Types.ObjectId('5f8d0d55e3a9d93f9c1c2c31');

const transactionFixtures = [
  {
    _id: new mongoose.Types.ObjectId('5f8d0d55e3a9d93f9c1c2c41'),
    user: userId,
    category: categoryId,
    amount: 25.50,
    description: 'Grocery shopping',
    date: new Date('2023-07-15'),
    isIncome: false
  },
  {
    _id: new mongoose.Types.ObjectId('5f8d0d55e3a9d93f9c1c2c42'),
    user: userId,
    category: categoryId,
    amount: 15.75,
    description: 'Restaurant lunch',
    date: new Date('2023-07-16'),
    isIncome: false
  },
  {
    _id: new mongoose.Types.ObjectId('5f8d0d55e3a9d93f9c1c2c43'),
    user: userId,
    amount: 1000.00,
    description: 'Salary deposit',
    date: new Date('2023-07-01'),
    isIncome: true
  }
];

module.exports = {
  transactionFixtures,
  userId,
  categoryId
};
