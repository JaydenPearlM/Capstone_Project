const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const budgetRoutes = require('../routes/budget');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/budget', budgetRoutes);

// Mock the Category and Transaction models
jest.mock('../models/Category');
jest.mock('../models/Transaction');

describe('Budget Routes', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Test GET budget summary
  describe('GET /', () => {
    it('should return budget summary with category details', async () => {
      // Mock categories
      const mockCategories = [
        { _id: 'cat1', name: 'Food', budget: 500 },
        { _id: 'cat2', name: 'Entertainment', budget: 200 }
      ];
      
      // Mock transactions
      const mockTransactions = [
        { _id: 'tx1', description: 'Groceries', amount: 150, categoryId: 'cat1', type: 'expense', date: '2025-08-01' },
        { _id: 'tx2', description: 'Restaurant', amount: 75, categoryId: 'cat1', type: 'expense', date: '2025-08-01' },
        { _id: 'tx3', description: 'Movie', amount: 25, categoryId: 'cat2', type: 'expense', date: '2025-08-01' }
      ];
      
      // Mock model methods
      Category.find.mockResolvedValue(mockCategories);
      Transaction.find.mockResolvedValue(mockTransactions);

      // Expected response
      const expectedResponse = {
        totalBudget: 700,
        totalSpent: 250,
        remaining: 450,
        categorySummaries: [
          { _id: 'cat1', name: 'Food', budget: 500, spent: 225 },
          { _id: 'cat2', name: 'Entertainment', budget: 200, spent: 25 }
        ]
      };

      // Make the request
      const response = await request(app).get('/api/budget');

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedResponse);
      expect(Category.find).toHaveBeenCalledTimes(1);
      expect(Transaction.find).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when getting budget summary', async () => {
      // Mock Category.find method to throw an error
      const errorMessage = 'Database error';
      Category.find.mockRejectedValue(new Error(errorMessage));

      // Make the request
      const response = await request(app).get('/api/budget');

      // Assertions
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
      expect(Category.find).toHaveBeenCalledTimes(1);
    });
  });
});
