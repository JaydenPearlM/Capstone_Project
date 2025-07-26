// server/tests/unit/plaidController.test.js
const mongoose = require('mongoose');
const plaidController = require('../../controllers/plaidController');
const User = require('../../models/User');
const userFixtures = require('../fixtures/users');

// Mock Plaid client and responses
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
    }))
  };
});

// Mock req, res, next objects
const mockRequest = (body = {}, user = { id: userFixtures[0]._id }) => {
  return {
    body,
    user
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('Plaid Controller', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(userFixtures);
    mockNext.mockReset();
  });

  describe('createLinkToken', () => {
    it('should create and return a Plaid link token', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      await plaidController.createLinkToken(req, res, mockNext);
      
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        link_token: 'mock-link-token-123'
      });
    });
    
    it('should handle errors', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      // Mock linkTokenCreate to throw an error
      const plaid = require('plaid');
      plaid.PlaidApi.mockImplementationOnce(() => ({
        linkTokenCreate: jest.fn(() => Promise.reject(new Error('Plaid API error')))
      }));
      
      await plaidController.createLinkToken(req, res, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0].message).toBe('Plaid API error');
    });
  });

  describe('exchangePublicToken', () => {
    it('should exchange public token and save access token to user', async () => {
      const req = mockRequest({ public_token: 'public-token-mock-123' });
      const res = mockResponse();
      
      await plaidController.exchangePublicToken(req, res, mockNext);
      
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        access_token: 'access-sandbox-mock-123',
        item_id: 'item-sandbox-mock-123'
      });
      
      // Verify user was updated with Plaid tokens
      const updatedUser = await User.findById(userFixtures[0]._id);
      expect(updatedUser.plaidAccessToken).toBe('access-sandbox-mock-123');
      expect(updatedUser.plaidItemId).toBe('item-sandbox-mock-123');
    });
    
    it('should handle errors', async () => {
      const req = mockRequest({ public_token: 'invalid-token' });
      const res = mockResponse();
      
      // Mock itemPublicTokenExchange to throw an error
      const plaid = require('plaid');
      plaid.PlaidApi.mockImplementationOnce(() => ({
        itemPublicTokenExchange: jest.fn(() => Promise.reject(new Error('Invalid public token')))
      }));
      
      await plaidController.exchangePublicToken(req, res, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0].message).toBe('Invalid public token');
    });
  });
});
