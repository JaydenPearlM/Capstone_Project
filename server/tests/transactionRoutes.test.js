const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const transactionRoutes = require('../routes/transactionRoutes');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/v1/transactions', transactionRoutes);

// Mock the controller functions
jest.mock('../controllers/transactionController', () => ({
  getAll: jest.fn((req, res) => {
    res.status(200).json([
      { _id: '1', amount: 50.00, description: 'Groceries', date: new Date(), categoryId: '1' },
      { _id: '2', amount: 1500.00, description: 'Salary', date: new Date(), categoryId: '2' }
    ]);
  }),
  getById: jest.fn((req, res) => {
    if (req.params.id === '1') {
      res.status(200).json({ _id: '1', amount: 50.00, description: 'Groceries', date: new Date(), categoryId: '1' });
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  }),
  create: jest.fn((req, res) => {
    const { amount, description, date, categoryId } = req.body;
    res.status(201).json({ _id: '3', amount, description, date, categoryId });
  }),
  update: jest.fn((req, res) => {
    if (req.params.id === '1') {
      const { amount, description, date, categoryId } = req.body;
      res.status(200).json({ _id: '1', amount, description, date, categoryId });
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  }),
  remove: jest.fn((req, res) => {
    if (req.params.id === '1') {
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  }),
  fetchFromPlaid: jest.fn((req, res) => {
    res.status(200).json({ message: 'Transactions fetched successfully from Plaid' });
  })
}));

// Mock the logger
jest.mock('../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

describe('Transaction Routes', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('GET /api/v1/transactions', () => {
    it('should return all transactions', async () => {
      const res = await request(app).get('/api/v1/transactions');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].description).toBe('Groceries');
    });
  });

  describe('GET /api/v1/transactions/:id', () => {
    it('should return a transaction by id', async () => {
      const res = await request(app).get('/api/v1/transactions/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.description).toBe('Groceries');
    });

    it('should return 404 if transaction not found', async () => {
      const res = await request(app).get('/api/v1/transactions/999');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/v1/transactions', () => {
    it('should create a new transaction', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .send({
          amount: 25.00,
          description: 'Movie Tickets',
          date: new Date(),
          categoryId: '3'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.description).toBe('Movie Tickets');
    });
  });

  describe('PUT /api/v1/transactions/:id', () => {
    it('should update an existing transaction', async () => {
      const res = await request(app)
        .put('/api/v1/transactions/1')
        .send({
          amount: 55.00,
          description: 'Grocery Shopping',
          date: new Date(),
          categoryId: '1'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.description).toBe('Grocery Shopping');
    });

    it('should return 404 if transaction not found', async () => {
      const res = await request(app)
        .put('/api/v1/transactions/999')
        .send({
          amount: 55.00,
          description: 'Grocery Shopping',
          date: new Date(),
          categoryId: '1'
        });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/v1/transactions/:id', () => {
    it('should delete an existing transaction', async () => {
      const res = await request(app).delete('/api/v1/transactions/1');
      expect(res.statusCode).toBe(200);
    });

    it('should return 404 if transaction not found', async () => {
      const res = await request(app).delete('/api/v1/transactions/999');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/v1/transactions/fetch', () => {
    it('should fetch transactions from Plaid', async () => {
      const res = await request(app).get('/api/v1/transactions/fetch');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Transactions fetched successfully from Plaid');
    });
  });
});
