// server/tests/integration/plaid.routes.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { generateTestToken } = require('../testUtils');
const User = require('../../models/User');
const userFixtures = require('../fixtures/users');
const express = require('express');

// Mock Plaid module
jest.mock('plaid', () => {
  return {
    Configuration: jest.fn(),
    PlaidApi: jest.fn(() => ({
      linkTokenCreate: jest.fn(() => Promise.resolve({
        data: {
          link_token: 'mock-link-token-123'
        }
      })),
      itemPublicTokenExchange: jest.fn(() => Promise.resolve({
        data: {
          access_token: 'access-sandbox-mock-123',
          item_id: 'item-sandbox-mock-123'
        }
      }))
    })),
    PlaidEnvironments: {
      sandbox: 'https://sandbox.plaid.com'
    }
  };
});

describe('Plaid Routes', () => {
  let app;
  let token;
  const userId = userFixtures[0]._id;
  
  beforeAll(() => {
    // Create test Express app
    app = express();
    app.use(express.json());
    
    // Set environment variables for Plaid
    process.env.PLAID_ENV = 'sandbox';
    process.env.PLAID_CLIENT_ID = 'test-client-id';
    process.env.PLAID_SECRET = 'test-secret';
    
    // Mock authentication middleware
    app.use((req, res, next) => {
      req.user = { id: userId.toString() };
      next();
    });
    
    // Add routes
    app.use('/api/v1/plaid', require('../../routes/Plaidroutes'));
    
    // Generate test JWT token
    token = generateTestToken(userId);
  });
  
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(userFixtures);
  });
  
  describe('POST /api/v1/plaid/create_link_token', () => {
    it('should create a Plaid link token', async () => {
      const response = await request(app)
        .post('/api/v1/plaid/create_link_token')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: userId.toString() });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('link_token', 'mock-link-token-123');
    });
  });
  
  describe('POST /api/v1/plaid/exchange_public_token', () => {
    it('should exchange public token and save access token to user', async () => {
      const response = await request(app)
        .post('/api/v1/plaid/exchange_public_token')
        .set('Authorization', `Bearer ${token}`)
        .send({ public_token: 'public-token-mock-123' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token', 'access-sandbox-mock-123');
      
      // Verify user was updated in database
      const updatedUser = await User.findById(userId);
      expect(updatedUser.plaidAccessToken).toBe('access-sandbox-mock-123');
      expect(updatedUser.plaidItemId).toBe('item-sandbox-mock-123');
    });
    
    it('should handle invalid public token', async () => {
      // Mock Plaid API to throw an error
      const plaid = require('plaid');
      plaid.PlaidApi.mockImplementationOnce(() => ({
        itemPublicTokenExchange: jest.fn(() => Promise.reject({
          response: {
            data: { error_code: 'INVALID_PUBLIC_TOKEN' }
          }
        }))
      }));
      
      const response = await request(app)
        .post('/api/v1/plaid/exchange_public_token')
        .set('Authorization', `Bearer ${token}`)
        .send({ public_token: 'invalid-token' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
