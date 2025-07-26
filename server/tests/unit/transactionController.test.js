// server/tests/unit/transactionController.test.js
const mongoose = require('mongoose');
const transactionController = require('../../controllers/transactionController');
const Transaction = require('../../models/Transaction');
const { transactionFixtures, userId } = require('../fixtures/transactions');

// Mock req, res, next objects for controller testing
const mockRequest = (params = {}, body = {}, user = { id: userId }) => {
  return {
    params,
    body,
    user
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('Transaction Controller', () => {
  beforeEach(async () => {
    // Clear transaction collection and insert test data
    await Transaction.deleteMany({});
    await Transaction.insertMany(transactionFixtures);
    
    // Reset the mock next function
    mockNext.mockReset();
  });

  describe('getAll', () => {
    it('should return all transactions for the user', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      await transactionController.getAll(req, res, mockNext);
      
      expect(res.json).toHaveBeenCalled();
      const responseData = res.json.mock.calls[0][0];
      expect(responseData).toHaveLength(3);
      expect(responseData[0].description).toBe('Grocery shopping');
    });
    
    it('should handle errors', async () => {
      // Force an error by passing invalid user ID
      const req = mockRequest({}, {}, { id: 'invalid-id' });
      const res = mockResponse();
      
      // Mock Transaction.find to throw an error
      jest.spyOn(Transaction, 'find').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      
      await transactionController.getAll(req, res, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(mockNext.mock.calls[0][0].message).toBe('Database error');
    });
  });

  describe('getById', () => {
    it('should return a transaction when valid ID is provided', async () => {
      const transactionId = transactionFixtures[0]._id.toString();
      const req = mockRequest({ id: transactionId });
      const res = mockResponse();
      
      await transactionController.getById(req, res, mockNext);
      
      expect(res.json).toHaveBeenCalled();
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.description).toBe('Grocery shopping');
      expect(responseData.amount).toBe(25.5);
    });
    
    it('should return 404 when transaction is not found', async () => {
      const invalidId = new mongoose.Types.ObjectId();
      const req = mockRequest({ id: invalidId });
      const res = mockResponse();
      
      await transactionController.getById(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
    });
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const newTransaction = {
        category: new mongoose.Types.ObjectId(),
        amount: 75.99,
        description: 'Online purchase',
        date: new Date(),
        isIncome: false
      };
      
      const req = mockRequest({}, newTransaction);
      const res = mockResponse();
      
      await transactionController.create(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.description).toBe('Online purchase');
      expect(responseData.amount).toBe(75.99);
      
      // Verify that transaction was saved to the database
      const savedTransaction = await Transaction.findOne({ description: 'Online purchase' });
      expect(savedTransaction).not.toBeNull();
      expect(savedTransaction.user.toString()).toBe(userId.toString());
    });
  });

  describe('update', () => {
    it('should update an existing transaction', async () => {
      const transactionId = transactionFixtures[0]._id.toString();
      const updateData = {
        description: 'Updated grocery shopping',
        amount: 30.75
      };
      
      const req = mockRequest({ id: transactionId }, updateData);
      const res = mockResponse();
      
      await transactionController.update(req, res, mockNext);
      
      expect(res.json).toHaveBeenCalled();
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.description).toBe('Updated grocery shopping');
      expect(responseData.amount).toBe(30.75);
    });
  });

  describe('remove', () => {
    it('should delete a transaction', async () => {
      const transactionId = transactionFixtures[0]._id.toString();
      const req = mockRequest({ id: transactionId });
      const res = mockResponse();
      
      await transactionController.remove(req, res, mockNext);
      
      expect(res.status).toHaveBeenCalledWith(204);
      
      // Verify the transaction was deleted from database
      const deletedTransaction = await Transaction.findById(transactionId);
      expect(deletedTransaction).toBeNull();
    });
  });
});
