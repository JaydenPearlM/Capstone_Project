# Backend Tests

This directory contains unit and integration tests for the Cache Budgeting App backend.

## Directory Structure

- `unit/` - Unit tests for individual components (controllers, models)
- `integration/` - Integration tests for API endpoints and server functionality
- `fixtures/` - Test data used across tests
- `setup.js` - Test setup configuration
- `testUtils.js` - Utility functions for tests

## Running Tests

You can run the tests using the following npm scripts:

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

The test suite covers:

1. **Unit Tests:**
   - Category controller functions
   - Transaction controller functions
   - Plaid controller functions

2. **Integration Tests:**
   - Category API endpoints
   - Transaction API endpoints
   - Plaid API endpoints
   - Overall server functionality

## Adding New Tests

When adding new tests:

1. Place unit tests in the `unit/` directory
2. Place integration tests in the `integration/` directory
3. Update or add fixtures in the `fixtures/` directory as needed
4. Follow the existing patterns for mocking and assertions

## Mock Data

The tests use an in-memory MongoDB database via `mongodb-memory-server` to avoid affecting any real databases.

Test fixtures include:
- Categories (expense and income types)
- Transactions (expenses and income)
- User data with mock Plaid tokens

## Authentication in Tests

For authenticated routes, tests use a mock authentication middleware that adds a user ID to the request. A mock JWT token is also generated for testing protected endpoints.

## Plaid Testing

Plaid API calls are mocked to avoid making actual external API requests during testing. The mock returns predefined responses that mimic real Plaid API behavior.
