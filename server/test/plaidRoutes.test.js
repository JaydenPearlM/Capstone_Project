const request = require('supertest');
const express = require('express');
const { Configuration, PlaidApi } = require('plaid');

// Create a mock for the PlaidApi
jest.mock('plaid', () => {
  const mockLinkTokenCreate = jest.fn();
  const mockItemPublicTokenExchange = jest.fn();
  
  return {
    Configuration: jest.fn(),
    PlaidApi: jest.fn(() => ({
      linkTokenCreate: mockLinkTokenCreate,
      itemPublicTokenExchange: mockItemPublicTokenExchange
    })),
    PlaidEnvironments: {
      sandbox: 'https://sandbox.plaid.com'
    }
  };
});

// Mock environment variables
process.env.PLAID_ENV = 'sandbox';
process.env.PLAID_CLIENT_ID = 'test-client-id';
process.env.PLAID_SECRET = 'test-secret';

// Import the routes after mocking
const plaidRoutes = require('../routes/Plaidroutes');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/plaid', plaidRoutes);

describe('Plaid Routes', () => {
  let plaidApiMock;
  
  beforeEach(() => {
    // Get the mocked PlaidApi instance
    plaidApiMock = new PlaidApi();
    jest.clearAllMocks();
  });

  // Test create link token
  describe('POST /create_link_token', () => {
    it('should create a link token successfully', async () => {
      // Mock response data
      const mockResponse = {
        data: {
          link_token: 'link-sandbox-12345'
        }
      };
      
      // Setup the mock to return our data
      plaidApiMock.linkTokenCreate.mockResolvedValue(mockResponse);
      
      // Request body
      const requestBody = {
        userId: 'user123'
      };

      // Make the request
      const response = await request(app)
        .post('/api/plaid/create_link_token')
        .send(requestBody);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ link_token: 'link-sandbox-12345' });
      expect(plaidApiMock.linkTokenCreate).toHaveBeenCalledWith({
        user: { client_user_id: 'user123' },
        client_name: 'CacheBudget (Sandbox)',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en',
      });
    });

    it('should handle errors when creating a link token', async () => {
      // Mock error
      const errorResponse = {
        response: {
          data: {
            error_code: 'INVALID_REQUEST',
            error_message: 'Invalid request'
          }
        }
      };
      
      // Setup the mock to throw an error
      plaidApiMock.linkTokenCreate.mockRejectedValue(errorResponse);
      
      // Request body
      const requestBody = {
        userId: 'user123'
      };

      // Make the request
      const response = await request(app)
        .post('/api/plaid/create_link_token')
        .send(requestBody);

      // Assertions
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ 
        error: errorResponse.response.data 
      });
    });
  });

  // Test exchange public token
  describe('POST /exchange_public_token', () => {
    it('should exchange public token for access token', async () => {
      // Mock response data
      const mockResponse = {
        data: {
          access_token: 'access-sandbox-12345',
          item_id: 'item-sandbox-12345'
        }
      };
      
      // Setup the mock to return our data
      plaidApiMock.itemPublicTokenExchange.mockResolvedValue(mockResponse);
      
      // Request body
      const requestBody = {
        public_token: 'public-sandbox-12345'
      };

      // Make the request
      const response = await request(app)
        .post('/api/plaid/exchange_public_token')
        .send(requestBody);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        access_token: 'access-sandbox-12345',
        item_id: 'item-sandbox-12345'
      });
      expect(plaidApiMock.itemPublicTokenExchange).toHaveBeenCalledWith({ 
        public_token: 'public-sandbox-12345' 
      });
    });

    it('should handle errors when exchanging tokens', async () => {
      // Mock error
      const errorResponse = {
        response: {
          data: {
            error_code: 'INVALID_PUBLIC_TOKEN',
            error_message: 'The public token is invalid'
          }
        }
      };
      
      // Setup the mock to throw an error
      plaidApiMock.itemPublicTokenExchange.mockRejectedValue(errorResponse);
      
      // Request body
      const requestBody = {
        public_token: 'invalid-token'
      };

      // Make the request
      const response = await request(app)
        .post('/api/plaid/exchange_public_token')
        .send(requestBody);

      // Assertions
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ 
        error: errorResponse.response.data 
      });
    });
  });
});
