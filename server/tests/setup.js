/**
 * Test setup file for ONE Albania SME Dashboard API
 * Sets up the test environment and provides utility functions for testing
 */

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const { pool } = require('../config/db.config');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Create a test user and return authentication token
 * @param {Object} userData - User data (optional)
 * @returns {Promise<Object>} - Object containing user data and token
 */
const createTestUserAndToken = async (userData = {}) => {
  // Default test user data
  const defaultUserData = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'Test@123',
    role: 'user',
    company_name: 'Test Company'
  };

  // Merge default data with provided data
  const testUserData = { ...defaultUserData, ...userData };

  // Insert test user directly into database
  const [result] = await pool.execute(
    'INSERT INTO users (username, email, password, role, company_name) VALUES (?, ?, ?, ?, ?)',
    [
      testUserData.username,
      testUserData.email,
      testUserData.password, // Note: In a real test, you would hash this
      testUserData.role,
      testUserData.company_name
    ]
  );

  const userId = result.insertId;

  // Generate JWT token
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION
  });

  // Get the created user
  const [userRows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
  const user = userRows[0];

  return {
    user,
    token
  };
};

/**
 * Clean up test data
 * @param {number} userId - User ID to clean up
 * @returns {Promise<void>}
 */
const cleanupTestData = async (userId) => {
  // Delete all related data
  await pool.execute('DELETE FROM notifications WHERE user_id = ?', [userId]);
  await pool.execute('DELETE FROM service_status WHERE user_id = ?', [userId]);
  await pool.execute('DELETE FROM ai_recommendations WHERE user_id = ?', [userId]);
  await pool.execute('DELETE FROM cost_breakdown WHERE user_id = ?', [userId]);
  
  // Delete usage history for user's lines
  await pool.execute(`
    DELETE uh FROM usage_history uh
    JOIN telecom_lines tl ON uh.line_id = tl.id
    WHERE tl.user_id = ?
  `, [userId]);
  
  // Delete telecom lines
  await pool.execute('DELETE FROM telecom_lines WHERE user_id = ?', [userId]);
  
  // Delete user settings
  await pool.execute('DELETE FROM user_settings WHERE user_id = ?', [userId]);
  
  // Finally, delete the user
  await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
};

/**
 * Create a test request with authentication
 * @param {string} token - JWT token
 * @returns {Object} - Supertest request object with auth header
 */
const authenticatedRequest = (token) => {
  return request(app).set('Authorization', `Bearer ${token}`);
};

/**
 * Close database connection after tests
 */
const closeDbConnection = async () => {
  await pool.end();
};

module.exports = {
  createTestUserAndToken,
  cleanupTestData,
  authenticatedRequest,
  closeDbConnection
};
