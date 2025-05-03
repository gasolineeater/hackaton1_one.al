const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

dotenv.config();

// Create a connection pool with optimized settings
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'one_albania_db',
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
  queueLimit: process.env.DB_QUEUE_LIMIT || 0,
  connectTimeout: 10000, // 10 seconds
  acquireTimeout: 10000, // 10 seconds
  timeout: 60000, // 60 seconds
  // Enable connection keep-alive
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // 10 seconds
  // Enable prepared statements for better performance and security
  namedPlaceholders: true
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    logger.info('Database connection established successfully.');
    connection.release();
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    return false;
  }
}

// Execute a query with retry mechanism
async function executeQuery(query, params = [], retries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const [results] = await pool.execute(query, params);
      return results;
    } catch (error) {
      lastError = error;

      // Log the error
      logger.warn(`Query attempt ${attempt}/${retries} failed:`, {
        query,
        error: error.message,
        code: error.code
      });

      // If it's a connection error, wait before retrying
      if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      } else {
        // For other errors, don't retry
        break;
      }
    }
  }

  // If we get here, all retries failed
  logger.error('Query failed after all retries:', {
    query,
    error: lastError
  });

  throw lastError;
}

module.exports = {
  pool,
  testConnection,
  executeQuery
};
