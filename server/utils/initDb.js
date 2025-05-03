const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');
const { runMigrations } = require('../migrations/runner');
const logger = require('./logger');

dotenv.config();

/**
 * Initialize database
 */
async function initializeDatabase() {
  let connection;

  try {
    // Create connection without database selected
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    logger.info('Connected to MySQL server.');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'one_albania_db';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);

    logger.info(`Database '${dbName}' created or already exists.`);

    // Switch to the database
    await connection.execute(`USE \`${dbName}\``);

    // Close the initial connection
    await connection.end();

    // Run migrations
    await runMigrations();

    logger.info('Database initialized successfully!');

    return true;
  } catch (error) {
    logger.error('Error initializing database:', error);
    return false;
  } finally {
    if (connection && connection.end) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(success => {
      if (success) {
        logger.info('Database setup completed.');
      } else {
        logger.error('Database setup failed.');
      }
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      logger.error('Unhandled error during database initialization:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
