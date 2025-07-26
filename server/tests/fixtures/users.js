// server/tests/fixtures/users.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Pre-hashed password for 'Password123!'
const hashedPassword = '$2b$10$n9SrOMZ1jg9qQVQe7YuMm.cPwH5tWJgJA6vF4D9k1FUZS7RQW2zYa';

const userFixtures = [
  {
    _id: new mongoose.Types.ObjectId('5f8d0d55e3a9d93f9c1c2c30'),
    email: 'test@example.com',
    passwordHash: hashedPassword,
    firstName: 'Test',
    lastName: 'User',
    plaidAccessToken: 'access-sandbox-123',
    plaidItemId: 'item-sandbox-123'
  }
];

module.exports = userFixtures;
