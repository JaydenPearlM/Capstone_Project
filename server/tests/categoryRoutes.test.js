const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const categoryRoutes = require('../routes/categoryRoutes');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/v1/categories', categoryRoutes);

// Mock the controller functions
jest.mock('../controllers/categoryController', () => ({
  getAll: jest.fn((req, res) => {
    res.status(200).json([
      { _id: '1', name: 'Food', type: 'expense' },
      { _id: '2', name: 'Salary', type: 'income' }
    ]);
  }),
  getById: jest.fn((req, res) => {
    if (req.params.id === '1') {
      res.status(200).json({ _id: '1', name: 'Food', type: 'expense' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  }),
  create: jest.fn((req, res) => {
    const { name, type } = req.body;
    res.status(201).json({ _id: '3', name, type });
  }),
  update: jest.fn((req, res) => {
    if (req.params.id === '1') {
      const { name, type } = req.body;
      res.status(200).json({ _id: '1', name, type });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  }),
  remove: jest.fn((req, res) => {
    if (req.params.id === '1') {
      res.status(200).json({ message: 'Category deleted successfully' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  })
}));

// Mock the logger
jest.mock('../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
}));

describe('Category Routes', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('GET /api/v1/categories', () => {
    it('should return all categories', async () => {
      const res = await request(app).get('/api/v1/categories');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].name).toBe('Food');
    });
  });

  describe('GET /api/v1/categories/:id', () => {
    it('should return a category by id', async () => {
      const res = await request(app).get('/api/v1/categories/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Food');
    });

    it('should return 404 if category not found', async () => {
      const res = await request(app).get('/api/v1/categories/999');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/v1/categories', () => {
    it('should create a new category', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .send({ name: 'Entertainment', type: 'expense' });
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('Entertainment');
    });
  });

  describe('PUT /api/v1/categories/:id', () => {
    it('should update an existing category', async () => {
      const res = await request(app)
        .put('/api/v1/categories/1')
        .send({ name: 'Groceries', type: 'expense' });
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Groceries');
    });

    it('should return 404 if category not found', async () => {
      const res = await request(app)
        .put('/api/v1/categories/999')
        .send({ name: 'Groceries', type: 'expense' });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/v1/categories/:id', () => {
    it('should delete an existing category', async () => {
      const res = await request(app).delete('/api/v1/categories/1');
      expect(res.statusCode).toBe(200);
    });

    it('should return 404 if category not found', async () => {
      const res = await request(app).delete('/api/v1/categories/999');
      expect(res.statusCode).toBe(404);
    });
  });
});
