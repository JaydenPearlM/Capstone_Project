// server/tests/testUtils.js
const express = require('express');
const mongoose = require('mongoose');
const request = require('supertest');
const cors = require('cors');
const categoryRoutes = require('../routes/categoryRoutes');
const transactionRoutes = require('../routes/transactionRoutes');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const categoryFixtures = require('./fixtures/categories');
const { transactionFixtures } = require('./fixtures/transactions');
const userFixtures = require('./fixtures/users');

// Create test Express app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  
  // Add routes
  app.use('/api/v1/categories', categoryRoutes);
  app.use('/api/v1/transactions', transactionRoutes);
  
  return app;
};

// Seed test data
const seedTestData = async () => {
  await Category.insertMany(categoryFixtures);
  await Transaction.insertMany(transactionFixtures);
  await User.insertMany(userFixtures);
};

// Generate a JWT token for testing auth routes
const generateTestToken = (userId) => {
  const jwt = require('jsonwebtoken');
  const token = jwt.sign(
    { id: userId.toString() }, 
    process.env.JWT_SECRET || 'test-secret-key',
    { expiresIn: '1h' }
  );
  return token;
};

// Mock middleware for auth tests
const mockAuthMiddleware = (req, res, next) => {
  req.user = { id: userFixtures[0]._id.toString() };
  next();
};

module.exports = {
  createTestApp,
  seedTestData,
  generateTestToken,
  mockAuthMiddleware
};
