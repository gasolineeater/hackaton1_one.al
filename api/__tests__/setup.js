// Test setup file
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock logger to prevent console output during tests
jest.mock('../utils/logger.js', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  stream: {
    write: jest.fn()
  }
}));

// Global test setup
global.beforeAll(async () => {
  // Add any global setup here
});

// Global test teardown
global.afterAll(async () => {
  // Add any global teardown here
});
