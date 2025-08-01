const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const Transaction = require('../models/Transaction');
const transactionRoutes = require('../routes/transactionRoutes');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/transactions', transactionRoutes);

// Mock the Transaction model
jest.mock('../models/Transaction');

describe('Transaction Routes', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Test GET all transactions
  describe('GET /', () => {
    it('should return all transactions', async () => {
      // Mock the Transaction.find method to return test data
      const mockTransactions = [
        { _id: '123', description: 'Groceries', amount: 75.50, categoryId: 'cat1', type: 'expense', date: '2025-08-01' },
        { _id: '456', description: 'Salary', amount: 2000, categoryId: 'cat2', type: 'income', date: '2025-08-01' }
      ];
      Transaction.find.mockResolvedValue(mockTransactions);

      // Make the request
      const response = await request(app).get('/api/transactions');

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTransactions);
      expect(Transaction.find).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when getting transactions', async () => {
      // Mock the Transaction.find method to throw an error
      const errorMessage = 'Database error';
      Transaction.find.mockRejectedValue(new Error(errorMessage));

      // Make the request
      const response = await request(app).get('/api/transactions');

      // Assertions
      expect(response.status).toBe(500);
      expect(Transaction.find).toHaveBeenCalledTimes(1);
    });
  });

  // Test POST create transaction
  describe('POST /', () => {
    it('should create a new transaction', async () => {
      // Mock transaction data
      const newTransaction = { 
        description: 'Restaurant', 
        amount: 45.75, 
        categoryId: 'cat1', 
        type: 'expense', 
        date: '2025-08-01' 
      };
      const savedTransaction = { _id: '789', ...newTransaction };
      
      // Mock the save method
      Transaction.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(savedTransaction)
      }));

      // Make the request
      const response = await request(app)
        .post('/api/transactions')
        .send(newTransaction);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(savedTransaction);
      expect(Transaction).toHaveBeenCalledWith(newTransaction);
    });

    it('should handle errors when creating a transaction', async () => {
      // Mock transaction data
      const newTransaction = { 
        description: 'Restaurant', 
        amount: 45.75, 
        categoryId: 'cat1', 
        type: 'expense', 
        date: '2025-08-01' 
      };
      
      // Mock the save method to throw an error
      const errorMessage = 'Validation error';
      Transaction.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error(errorMessage))
      }));

      // Make the request
      const response = await request(app)
        .post('/api/transactions')
        .send(newTransaction);

      // Assertions
      expect(response.status).toBe(500);
      expect(Transaction).toHaveBeenCalledWith(newTransaction);
    });
  });

  // Test PUT update transaction
  describe('PUT /:id', () => {
    it('should update an existing transaction', async () => {
      // Mock data
      const transactionId = '123';
      const updateData = { 
        description: 'Updated Groceries', 
        amount: 85.50, 
        categoryId: 'cat1', 
        type: 'expense', 
        date: '2025-08-01' 
      };
      const updatedTransaction = { _id: transactionId, ...updateData };
      
      // Mock findByIdAndUpdate method
      Transaction.findByIdAndUpdate.mockResolvedValue(updatedTransaction);

      // Make the request
      const response = await request(app)
        .put(`/api/transactions/${transactionId}`)
        .send(updateData);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTransaction);
      expect(Transaction.findByIdAndUpdate).toHaveBeenCalledWith(
        transactionId, 
        updateData, 
        { new: true }
      );
    });

    it('should handle errors when updating a transaction', async () => {
      // Mock data
      const transactionId = '123';
      const updateData = { 
        description: 'Updated Groceries', 
        amount: 85.50, 
        categoryId: 'cat1', 
        type: 'expense', 
        date: '2025-08-01' 
      };
      
      // Mock findByIdAndUpdate method to throw an error
      const errorMessage = 'Database error';
      Transaction.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

      // Make the request
      const response = await request(app)
        .put(`/api/transactions/${transactionId}`)
        .send(updateData);

      // Assertions
      expect(response.status).toBe(500);
      expect(Transaction.findByIdAndUpdate).toHaveBeenCalledWith(
        transactionId, 
        updateData, 
        { new: true }
      );
    });
  });

  // Test DELETE transaction
  describe('DELETE /:id', () => {
    it('should delete a transaction', async () => {
      // Mock data
      const transactionId = '123';
      
      // Mock method
      Transaction.findByIdAndDelete.mockResolvedValue({});

      // Make the request
      const response = await request(app)
        .delete(`/api/transactions/${transactionId}`);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
      expect(Transaction.findByIdAndDelete).toHaveBeenCalledWith(transactionId);
    });

    it('should handle errors when deleting a transaction', async () => {
      // Mock data
      const transactionId = '123';
      
      // Mock findByIdAndDelete method to throw an error
      const errorMessage = 'Database error';
      Transaction.findByIdAndDelete.mockRejectedValue(new Error(errorMessage));

      // Make the request
      const response = await request(app)
        .delete(`/api/transactions/${transactionId}`);

      // Assertions
      expect(response.status).toBe(500);
      expect(Transaction.findByIdAndDelete).toHaveBeenCalledWith(transactionId);
    });
  });
});
