// server/tests/integration/transaction.routes.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { createTestApp, seedTestData, generateTestToken } = require('../testUtils');
const Transaction = require('../../models/Transaction');
const { transactionFixtures, userId } = require('../fixtures/transactions');
const express = require('express');

describe('Transaction Routes', () => {
  let app;
  let token;
  
  beforeAll(() => {
    // Create test Express app
    app = express();
    app.use(express.json());
    
    // Mock authentication middleware
    app.use((req, res, next) => {
      req.user = { id: userId.toString() };
      next();
    });
    
    // Add routes
    app.use('/api/v1/transactions', require('../../routes/transactionRoutes'));
    
    // Generate test JWT token
    token = generateTestToken(userId);
  });
  
  beforeEach(async () => {
    await Transaction.deleteMany({});
    await Transaction.insertMany(transactionFixtures);
  });
  
  describe('GET /api/v1/transactions', () => {
    it('should return all transactions for the authenticated user', async () => {
      const response = await request(app)
        .get('/api/v1/transactions')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body[0].description).toBe('Grocery shopping');
    });
  });
  
  describe('GET /api/v1/transactions/:id', () => {
    it('should return a transaction by ID', async () => {
      const transactionId = transactionFixtures[0]._id.toString();
      
      const response = await request(app)
        .get(`/api/v1/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.description).toBe('Grocery shopping');
      expect(response.body.amount).toBe(25.5);
    });
    
    it('should return 404 for non-existent transaction', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/v1/transactions/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('POST /api/v1/transactions', () => {
    it('should create a new transaction', async () => {
      const newTransaction = {
        amount: 45.99,
        description: 'Movie tickets',
        date: new Date().toISOString(),
        isIncome: false,
        category: new mongoose.Types.ObjectId()
      };
      
      const response = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send(newTransaction);
      
      expect(response.status).toBe(201);
      expect(response.body.description).toBe('Movie tickets');
      expect(response.body.amount).toBe(45.99);
      
      // Verify user ID was added automatically
      expect(response.body.user.toString()).toBe(userId.toString());
      
      // Verify in database
      const savedTransaction = await Transaction.findOne({ description: 'Movie tickets' });
      expect(savedTransaction).not.toBeNull();
    });
  });
  
  describe('PUT /api/v1/transactions/:id', () => {
    it('should update a transaction', async () => {
      const transactionId = transactionFixtures[0]._id.toString();
      const updateData = {
        description: 'Updated grocery shopping',
        amount: 35.25
      };
      
      const response = await request(app)
        .put(`/api/v1/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body.description).toBe('Updated grocery shopping');
      expect(response.body.amount).toBe(35.25);
    });
  });
  
  describe('DELETE /api/v1/transactions/:id', () => {
    it('should delete a transaction', async () => {
      const transactionId = transactionFixtures[0]._id.toString();
      
      const response = await request(app)
        .delete(`/api/v1/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(204);
      
      // Verify deletion in database
      const deletedTransaction = await Transaction.findById(transactionId);
      expect(deletedTransaction).toBeNull();
    });
  });
});
