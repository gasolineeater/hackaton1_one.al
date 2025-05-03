import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import queryOptimization from '../middleware/queryOptimizationMiddleware.js';

dotenv.config();

// Get database configuration from environment variables
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbDialect = 'mysql';

// Validate database configuration
if (!dbName || !dbUser || !dbHost) {
  logger.error('Database configuration is incomplete. Check your .env file.');
  process.exit(1);
}

// Optimized connection pool settings
const poolConfig = {
  max: parseInt(process.env.DB_POOL_MAX || '10'), // Maximum number of connections
  min: parseInt(process.env.DB_POOL_MIN || '2'),  // Minimum number of connections
  acquire: 30000,  // Maximum time (ms) to acquire a connection
  idle: 10000,     // Maximum time (ms) a connection can be idle
  evict: 60000     // How frequently to check for idle connections to evict
};

// Create Sequelize instance with optimized settings
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect,
  logging: process.env.NODE_ENV === 'development'
    ? (msg) => logger.debug(msg)
    : false,
  pool: poolConfig,
  dialectOptions: {
    // MySQL specific options
    connectTimeout: 10000, // Connection timeout
    dateStrings: true,     // Return dates as strings
    typeCast: true,        // Enable type casting
    // SSL configuration if needed
    ...(process.env.DB_SSL === 'true' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {})
  },
  benchmark: process.env.NODE_ENV === 'development', // Log query execution time in development
  retry: {
    max: 3,                // Maximum retry attempts for database operations
    match: [               // Retry on these error types
      /Deadlock/i,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /TimeoutError/
    ]
  }
});

/**
 * Initialize database optimizations
 */
queryOptimization.initializeDatabaseOptimizations(sequelize);

/**
 * Test database connection
 * @returns {Promise<boolean>} Connection success status
 */
async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    return true;
  } catch (error) {
    logger.error('Unable to connect to the database:', { error: error.message, stack: error.stack });
    return false;
  }
}

/**
 * Close database connection
 * @returns {Promise<void>}
 */
async function closeConnection() {
  try {
    await sequelize.close();
    logger.info('Database connection closed successfully.');
  } catch (error) {
    logger.error('Error closing database connection:', { error: error.message });
  }
}

// Database shutdown handler will be registered in server.js

export { sequelize, testConnection, closeConnection };
