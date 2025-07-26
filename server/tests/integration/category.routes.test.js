// server/tests/integration/category.routes.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { createTestApp, seedTestData, generateTestToken, mockAuthMiddleware } = require('../testUtils');
const Category = require('../../models/Category');
const categoryFixtures = require('../fixtures/categories');
const express = require('express');

describe('Category Routes', () => {
  let app;
  let token;
  
  beforeAll(() => {
    // Create test Express app
    app = express();
    app.use(express.json());
    
    // Mock authentication middleware
    app.use((req, res, next) => {
      req.user = { id: '5f8d0d55e3a9d93f9c1c2c30' };
      next();
    });
    
    // Add routes
    app.use('/api/v1/categories', require('../../routes/categoryRoutes'));
    
    // Generate test JWT token
    token = generateTestToken('5f8d0d55e3a9d93f9c1c2c30');
  });
  
  beforeEach(async () => {
    await Category.deleteMany({});
    await Category.insertMany(categoryFixtures);
  });
  
  describe('GET /api/v1/categories', () => {
    it('should return all categories', async () => {
      const response = await request(app)
        .get('/api/v1/categories')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body[0].name).toBe('Food & Dining');
    });
  });
  
  describe('GET /api/v1/categories/:id', () => {
    it('should return a category by ID', async () => {
      const categoryId = categoryFixtures[0]._id.toString();
      
      const response = await request(app)
        .get(`/api/v1/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Food & Dining');
      expect(response.body.type).toBe('expense');
    });
    
    it('should return 404 for non-existent category', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/v1/categories/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Category not found');
    });
  });
  
  describe('POST /api/v1/categories', () => {
    it('should create a new category', async () => {
      const newCategory = {
        name: 'Entertainment',
        type: 'expense',
        color: '#9933FF',
        icon: 'film'
      };
      
      const response = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(newCategory);
      
      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Entertainment');
      
      // Verify in database
      const savedCategory = await Category.findOne({ name: 'Entertainment' });
      expect(savedCategory).not.toBeNull();
    });
    
    it('should validate input data', async () => {
      const invalidCategory = {
        name: '',  // Empty name should be rejected
        type: 'invalid-type',  // Invalid type
      };
      
      const response = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidCategory);
      
      expect(response.status).toBe(400);
    });
  });
  
  describe('PUT /api/v1/categories/:id', () => {
    it('should update a category', async () => {
      const categoryId = categoryFixtures[0]._id.toString();
      const updateData = {
        name: 'Updated Category',
        color: '#112233'
      };
      
      const response = await request(app)
        .put(`/api/v1/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Category');
      expect(response.body.color).toBe('#112233');
      // Original fields should remain
      expect(response.body.type).toBe('expense');
    });
  });
  
  describe('DELETE /api/v1/categories/:id', () => {
    it('should delete a category', async () => {
      const categoryId = categoryFixtures[0]._id.toString();
      
      const response = await request(app)
        .delete(`/api/v1/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      
      // Verify deletion in database
      const deletedCategory = await Category.findById(categoryId);
      expect(deletedCategory).toBeNull();
    });
  });
});
