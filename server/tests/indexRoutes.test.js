const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock the sub-routes before importing the main router
jest.mock('../routes/transactionRoutes', () => {
  const router = require('express').Router();
  router.get('/', (req, res) => res.status(200).json({ message: 'Transactions route' }));
  return router;
});

jest.mock('../routes/categoryRoutes.js', () => {
  const router = require('express').Router();
  router.get('/', (req, res) => res.status(200).json({ message: 'Categories route' }));
  return router;
});

// Mock the logger
jest.mock('../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

// Import the index routes after mocking the dependencies
const indexRoutes = require('../routes/index');

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/v1', indexRoutes);

describe('Index Routes', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('Router Integration', () => {
    it('should properly route to transactions endpoint', async () => {
      const res = await request(app).get('/api/v1/transactions');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Transactions route');
    });

    it('should properly route to categories endpoint', async () => {
      const res = await request(app).get('/api/v1/categories');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Categories route');
    });
  });
});
