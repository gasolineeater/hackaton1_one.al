import jwt from 'jsonwebtoken';
import { sequelize } from '../../config/database.js';

/**
 * Generate a test JWT token
 * @param {Object} user - User object to encode in the token
 * @returns {string} JWT token
 */
export const generateTestToken = (user = {}) => {
  const defaultUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    customerId: 1,
    ...user
  };

  return jwt.sign(
    defaultUser,
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Clear all test database tables
 * @returns {Promise<void>}
 */
export const clearDatabase = async () => {
  const models = Object.values(sequelize.models);
  
  // Disable foreign key checks
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  
  // Truncate all tables
  for (const model of models) {
    await model.destroy({ truncate: true, force: true });
  }
  
  // Re-enable foreign key checks
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
};

/**
 * Create a test database connection
 * @returns {Promise<Object>} Sequelize instance
 */
export const createTestDbConnection = async () => {
  try {
    await sequelize.authenticate();
    return sequelize;
  } catch (error) {
    throw new Error(`Unable to connect to test database: ${error.message}`);
  }
};

/**
 * Create a test API request
 * @param {Object} app - Express app
 * @param {Object} options - Request options
 * @returns {Object} Supertest request
 */
export const createTestRequest = (app, options = {}) => {
  const request = require('supertest')(app);
  const { method = 'get', url = '/', token, body } = options;
  
  let req = request[method.toLowerCase()](url);
  
  if (token) {
    req = req.set('Authorization', `Bearer ${token}`);
  }
  
  if (body) {
    req = req.send(body);
  }
  
  return req;
};

export default {
  generateTestToken,
  clearDatabase,
  createTestDbConnection,
  createTestRequest
};
