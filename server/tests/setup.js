// server/tests/setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  // Configure custom binary download path that's in our .gitignore
  mongoServer = await MongoMemoryServer.create({
    binary: {
      downloadDir: path.join(__dirname, '../.mongodb-binaries')
    }
  });
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri, {});
  console.log('Connected to in-memory MongoDB server');
});

// Clean up after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log('Disconnected from in-memory MongoDB server');
});

// Clear collections between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
