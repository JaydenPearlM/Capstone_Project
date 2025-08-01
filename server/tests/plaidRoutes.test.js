const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock the Plaid client before importing the routes
jest.mock('plaid', () => {
  const mockPlaidApi = {
    linkTokenCreate: jest.fn(() => Promise.resolve({
      data: { link_token: 'test_link_token' }
    })),
    itemPublicTokenExchange: jest.fn(() => Promise.resolve({
      data: { access_token: 'test_access_token', item_id: 'test_item_id' }
    }))
  };
  
  const mockConfiguration = jest.fn();
  const mockPlaidEnvironments = {
    sandbox: 'https://sandbox.plaid.com'
  };
  
  return {
    PlaidApi: jest.fn(() => mockPlaidApi),
    Configuration: mockConfiguration,
    PlaidEnvironments: mockPlaidEnvironments
  };
});

// Now import the routes which will use the mocked Plaid client
const plaidRoutes = require('../routes/Plaidroutes');

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/v1/plaid', plaidRoutes);

describe('Plaid Routes', () => {
  beforeAll(async () => {
    // Setup environment variables
    process.env.PLAID_ENV = 'sandbox';
    process.env.PLAID_CLIENT_ID = 'test_client_id';
    process.env.PLAID_SECRET = 'test_secret';
    
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    delete process.env.PLAID_ENV;
    delete process.env.PLAID_CLIENT_ID;
    delete process.env.PLAID_SECRET;
  });

  describe('POST /api/v1/plaid/create_link_token', () => {
    it('should create a Plaid link token', async () => {
      const res = await request(app)
        .post('/api/v1/plaid/create_link_token')
        .send({ userId: 'user123' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('link_token', 'test_link_token');
    });

    it('should handle errors during link token creation', async () => {
      // Force an error in the mock
      const { PlaidApi } = require('plaid');
      const mockClient = PlaidApi();
      mockClient.linkTokenCreate.mockImplementationOnce(() => 
        Promise.reject({ response: { data: { error_message: 'Test error' } } })
      );

      const res = await request(app)
        .post('/api/v1/plaid/create_link_token')
        .send({ userId: 'user123' });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/v1/plaid/exchange_public_token', () => {
    it('should exchange a public token for an access token', async () => {
      const res = await request(app)
        .post('/api/v1/plaid/exchange_public_token')
        .send({ public_token: 'test_public_token' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('access_token', 'test_access_token');
      expect(res.body).toHaveProperty('item_id', 'test_item_id');
    });

    it('should handle errors during token exchange', async () => {
      // Force an error in the mock
      const { PlaidApi } = require('plaid');
      const mockClient = PlaidApi();
      mockClient.itemPublicTokenExchange.mockImplementationOnce(() => 
        Promise.reject({ response: { data: { error_message: 'Test error' } } })
      );

      const res = await request(app)
        .post('/api/v1/plaid/exchange_public_token')
        .send({ public_token: 'test_public_token' });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });
});
