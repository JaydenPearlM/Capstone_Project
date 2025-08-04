const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const categoryRoutes = require('../routes/categoryRoutes');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/categories', categoryRoutes);

// Mock the Category and Transaction models
jest.mock('../models/Category');
jest.mock('../models/Transaction');

describe('Category Routes', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Test GET all categories
  describe('GET /', () => {
    it('should return all categories', async () => {
      // Mock the Category.find method to return test data
      const mockCategories = [
        { _id: '123', name: 'Food', budget: 500 },
        { _id: '456', name: 'Entertainment', budget: 200 }
      ];
      Category.find.mockResolvedValue(mockCategories);

      // Make the request
      const response = await request(app).get('/api/categories');

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategories);
      expect(Category.find).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when getting categories', async () => {
      // Mock the Category.find method to throw an error
      const errorMessage = 'Database error';
      Category.find.mockRejectedValue(new Error(errorMessage));

      // Make the request
      const response = await request(app).get('/api/categories');

      // Assertions
      expect(response.status).toBe(500);
      expect(Category.find).toHaveBeenCalledTimes(1);
    });
  });

  // Test POST create category
  describe('POST /', () => {
    it('should create a new category', async () => {
      // Mock category data
      const newCategory = { name: 'Utilities', budget: 150 };
      const savedCategory = { _id: '789', name: 'Utilities', budget: 150 };
      
      // Mock the save method
      Category.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(savedCategory)
      }));

      // Make the request
      const response = await request(app)
        .post('/api/categories')
        .send(newCategory);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(savedCategory);
      expect(Category).toHaveBeenCalledWith(newCategory);
    });

    it('should handle errors when creating a category', async () => {
      // Mock category data
      const newCategory = { name: 'Utilities', budget: 150 };
      
      // Mock the save method to throw an error
      const errorMessage = 'Validation error';
      Category.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error(errorMessage))
      }));

      // Make the request
      const response = await request(app)
        .post('/api/categories')
        .send(newCategory);

      // Assertions
      expect(response.status).toBe(500);
      expect(Category).toHaveBeenCalledWith(newCategory);
    });
  });

  // Test PUT update category
  describe('PUT /:id', () => {
    it('should update an existing category', async () => {
      // Mock data
      const categoryId = '123';
      const updateData = { name: 'Updated Food', budget: 600 };
      const updatedCategory = { _id: categoryId, ...updateData };
      
      // Mock findByIdAndUpdate method
      Category.findByIdAndUpdate.mockResolvedValue(updatedCategory);

      // Make the request
      const response = await request(app)
        .put(`/api/categories/${categoryId}`)
        .send(updateData);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedCategory);
      expect(Category.findByIdAndUpdate).toHaveBeenCalledWith(
        categoryId, 
        updateData, 
        { new: true }
      );
    });

    it('should handle errors when updating a category', async () => {
      // Mock data
      const categoryId = '123';
      const updateData = { name: 'Updated Food', budget: 600 };
      
      // Mock findByIdAndUpdate method to throw an error
      const errorMessage = 'Database error';
      Category.findByIdAndUpdate.mockRejectedValue(new Error(errorMessage));

      // Make the request
      const response = await request(app)
        .put(`/api/categories/${categoryId}`)
        .send(updateData);

      // Assertions
      expect(response.status).toBe(500);
      expect(Category.findByIdAndUpdate).toHaveBeenCalledWith(
        categoryId, 
        updateData, 
        { new: true }
      );
    });
  });

  // Test DELETE category
  describe('DELETE /:id', () => {
    it('should delete a category and its transactions', async () => {
      // Mock data
      const categoryId = '123';
      
      // Mock methods
      Category.findByIdAndDelete.mockResolvedValue({});
      Transaction.deleteMany.mockResolvedValue({});

      // Make the request
      const response = await request(app)
        .delete(`/api/categories/${categoryId}`);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
      expect(Category.findByIdAndDelete).toHaveBeenCalledWith(categoryId);
      expect(Transaction.deleteMany).toHaveBeenCalledWith({ categoryId });
    });

    it('should handle errors when deleting a category', async () => {
      // Mock data
      const categoryId = '123';
      
      // Mock findByIdAndDelete method to throw an error
      const errorMessage = 'Database error';
      Category.findByIdAndDelete.mockRejectedValue(new Error(errorMessage));

      // Make the request
      const response = await request(app)
        .delete(`/api/categories/${categoryId}`);

      // Assertions
      expect(response.status).toBe(500);
      expect(Category.findByIdAndDelete).toHaveBeenCalledWith(categoryId);
    });
  });
});
