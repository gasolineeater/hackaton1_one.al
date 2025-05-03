/**
 * Database migration utility
 * Provides CLI for running and reverting migrations
 */

const { runMigrations, revertMigrations } = require('../migrations/runner');
const logger = require('./logger');

/**
 * Run migrations
 * @param {number} targetVersion - Target version to migrate to
 * @returns {Promise<void>}
 */
async function migrate(targetVersion) {
  try {
    await runMigrations(targetVersion);
    logger.info('Migration completed successfully');
    return true;
  } catch (error) {
    logger.error('Migration failed:', error);
    return false;
  }
}

/**
 * Revert migrations
 * @param {number} targetVersion - Target version to revert to
 * @returns {Promise<void>}
 */
async function rollback(targetVersion) {
  try {
    await revertMigrations(targetVersion);
    logger.info('Rollback completed successfully');
    return true;
  } catch (error) {
    logger.error('Rollback failed:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  const command = process.argv[2];
  const version = process.argv[3] ? parseInt(process.argv[3], 10) : undefined;
  
  if (!command || !['up', 'down'].includes(command)) {
    logger.error('Invalid command. Usage: node migrate.js up|down [version]');
    process.exit(1);
  }
  
  if (command === 'up') {
    migrate(version)
      .then(success => {
        process.exit(success ? 0 : 1);
      })
      .catch(error => {
        logger.error('Unhandled error during migration:', error);
        process.exit(1);
      });
  } else if (command === 'down') {
    rollback(version || 0)
      .then(success => {
        process.exit(success ? 0 : 1);
      })
      .catch(error => {
        logger.error('Unhandled error during rollback:', error);
        process.exit(1);
      });
  }
}

module.exports = { migrate, rollback };
