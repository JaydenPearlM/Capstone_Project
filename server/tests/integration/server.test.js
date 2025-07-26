// server/tests/integration/server.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');

describe('Server Integration', () => {
  let app;
  
  beforeAll(() => {
    // We'll create a simplified version of the server setup for testing
    app = express();
    
    // Apply middleware
    app.use(express.json());
    app.use(cors());
    
    // Mock authentication for all routes in testing
    app.use((req, res, next) => {
      req.user = { id: '5f8d0d55e3a9d93f9c1c2c30' };
      next();
    });
    
    // Apply routes
    app.use('/api/v1/categories', require('../../routes/categoryRoutes'));
    app.use('/api/v1/transactions', require('../../routes/transactionRoutes'));
    app.use('/api/v1/plaid', require('../../routes/Plaidroutes'));
    
    // Default route
    app.get('/', (req, res) => {
      res.json({ message: 'Cache Budgeting API' });
    });
    
    // Error handler
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: { message: err.message } });
    });
  });
  
  it('should respond to the root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Cache Budgeting API');
  });
  
  it('should have functional category routes', async () => {
    const categoriesResponse = await request(app).get('/api/v1/categories');
    expect(categoriesResponse.status).toBe(200);
    expect(Array.isArray(categoriesResponse.body)).toBe(true);
  });
  
  it('should have functional transaction routes', async () => {
    const transactionsResponse = await request(app).get('/api/v1/transactions');
    expect(transactionsResponse.status).toBe(200);
    expect(Array.isArray(transactionsResponse.body)).toBe(true);
  });
  
  it('should return 404 for non-existent routes', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.status).toBe(404);
  });
});
