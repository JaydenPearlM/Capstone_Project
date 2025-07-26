// server/tests/unit/categoryController.test.js
const mongoose = require('mongoose');
const categoryController = require('../../controllers/categoryController');
const Category = require('../../models/Category');
const categoryFixtures = require('../fixtures/categories');

// Mock req, res objects for controller testing
const mockRequest = (params = {}, body = {}, query = {}, user = {}) => {
  return {
    params,
    body,
    query,
    user
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Category Controller', () => {
  beforeEach(async () => {
    // Clear category collection and insert test data
    await Category.deleteMany({});
    await Category.insertMany(categoryFixtures);
  });

  describe('getAll', () => {
    it('should return all categories', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      await categoryController.getAll(req, res);
      
      expect(res.json).toHaveBeenCalled();
      const responseData = res.json.mock.calls[0][0];
      expect(responseData).toHaveLength(3);
      expect(responseData[0].name).toBe('Food & Dining');
    });
  });

  describe('getById', () => {
    it('should return a category when valid ID is provided', async () => {
      const categoryId = categoryFixtures[0]._id.toString();
      const req = mockRequest({ id: categoryId });
      const res = mockResponse();
      
      await categoryController.getById(req, res);
      
      expect(res.json).toHaveBeenCalled();
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.name).toBe('Food & Dining');
    });
    
    it('should return 404 when category is not found', async () => {
      const invalidId = new mongoose.Types.ObjectId();
      const req = mockRequest({ id: invalidId });
      const res = mockResponse();
      
      await categoryController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const newCategory = {
        name: 'Entertainment',
        type: 'expense',
        color: '#9933FF',
        icon: 'film'
      };
      const req = mockRequest({}, newCategory);
      const res = mockResponse();
      
      await categoryController.create(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.name).toBe('Entertainment');
      
      // Verify that category was saved to the database
      const savedCategory = await Category.findOne({ name: 'Entertainment' });
      expect(savedCategory).not.toBeNull();
      expect(savedCategory.type).toBe('expense');
    });
    
    it('should return 400 when validation fails', async () => {
      // Missing required field 'name'
      const invalidCategory = {
        type: 'expense',
        color: '#9933FF'
      };
      
      const req = mockRequest({}, invalidCategory);
      const res = mockResponse();
      
      await categoryController.create(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json.mock.calls[0][0]).toHaveProperty('error');
    });
  });

  describe('update', () => {
    it('should update an existing category', async () => {
      const categoryId = categoryFixtures[0]._id.toString();
      const updateData = {
        name: 'Food & Groceries',
        color: '#FF9900'
      };
      
      const req = mockRequest({ id: categoryId }, updateData);
      const res = mockResponse();
      
      await categoryController.update(req, res);
      
      expect(res.json).toHaveBeenCalled();
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.name).toBe('Food & Groceries');
      expect(responseData.color).toBe('#FF9900');
      // Original data should remain unchanged
      expect(responseData.type).toBe('expense');
    });
    
    it('should return 404 when updating a non-existent category', async () => {
      const invalidId = new mongoose.Types.ObjectId();
      const req = mockRequest({ id: invalidId }, { name: 'Updated Name' });
      const res = mockResponse();
      
      await categoryController.update(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      const categoryId = categoryFixtures[0]._id.toString();
      const req = mockRequest({ id: categoryId });
      const res = mockResponse();
      
      await categoryController.remove(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ success: true });
      
      // Verify the category was deleted from database
      const deletedCategory = await Category.findById(categoryId);
      expect(deletedCategory).toBeNull();
    });
    
    it('should return 404 when deleting a non-existent category', async () => {
      const invalidId = new mongoose.Types.ObjectId();
      const req = mockRequest({ id: invalidId });
      const res = mockResponse();
      
      await categoryController.remove(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });
});
