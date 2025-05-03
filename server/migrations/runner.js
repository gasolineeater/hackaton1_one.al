/**
 * Migration runner
 * Handles running and reverting migrations
 */

const fs = require('fs');
const path = require('path');
const Migration = require('./Migration');
const logger = require('../utils/logger');

/**
 * Get all migration files
 * @returns {Promise<Array>} - Migration files
 */
async function getMigrationFiles() {
  const migrationsDir = path.join(__dirname);
  const files = fs.readdirSync(migrationsDir);
  
  // Filter for JS files that match the pattern v{number}_{name}.js
  return files
    .filter(file => {
      return file.match(/^v\d+_.*\.js$/) && file !== 'Migration.js' && file !== 'runner.js';
    })
    .sort(); // Sort alphabetically, which will order by version
}

/**
 * Load a migration
 * @param {string} file - Migration file name
 * @returns {Promise<Migration>} - Migration instance
 */
async function loadMigration(file) {
  const migrationPath = path.join(__dirname, file);
  const MigrationClass = require(migrationPath);
  return new MigrationClass();
}

/**
 * Run migrations
 * @param {number} targetVersion - Target version to migrate to (optional)
 * @returns {Promise<void>}
 */
async function runMigrations(targetVersion = Infinity) {
  try {
    logger.info('Starting migrations...');
    
    // Check if migrations table exists
    const tableExists = await Migration.checkMigrationsTable();
    if (!tableExists) {
      await Migration.createMigrationsTable();
    }
    
    // Get applied migrations
    const appliedMigrations = await Migration.getAppliedMigrations();
    const appliedVersions = new Set(appliedMigrations.map(m => m.version));
    
    // Get migration files
    const migrationFiles = await getMigrationFiles();
    
    // Run migrations that haven't been applied yet
    for (const file of migrationFiles) {
      const migration = await loadMigration(file);
      
      // Skip if already applied or beyond target version
      if (appliedVersions.has(migration.version) || migration.version > targetVersion) {
        continue;
      }
      
      logger.info(`Running migration: ${migration.name} (v${migration.version})`);
      
      try {
        await migration.up();
        await Migration.recordMigration(migration.name, migration.version);
        logger.info(`Migration completed: ${migration.name} (v${migration.version})`);
      } catch (error) {
        logger.error(`Migration failed: ${migration.name} (v${migration.version})`, error);
        throw error;
      }
    }
    
    logger.info('Migrations completed successfully');
  } catch (error) {
    logger.error('Migration process failed:', error);
    throw error;
  }
}

/**
 * Revert migrations
 * @param {number} targetVersion - Target version to revert to
 * @returns {Promise<void>}
 */
async function revertMigrations(targetVersion = 0) {
  try {
    logger.info(`Reverting migrations to version ${targetVersion}...`);
    
    // Check if migrations table exists
    const tableExists = await Migration.checkMigrationsTable();
    if (!tableExists) {
      logger.info('No migrations to revert');
      return;
    }
    
    // Get applied migrations
    const appliedMigrations = await Migration.getAppliedMigrations();
    
    // Filter migrations to revert (those with version > targetVersion)
    const migrationsToRevert = appliedMigrations
      .filter(m => m.version > targetVersion)
      .sort((a, b) => b.version - a.version); // Sort in descending order
    
    if (migrationsToRevert.length === 0) {
      logger.info('No migrations to revert');
      return;
    }
    
    // Revert migrations
    for (const migrationRecord of migrationsToRevert) {
      // Find the migration file
      const migrationFiles = await getMigrationFiles();
      const migrationFile = migrationFiles.find(file => {
        return file.includes(`v${migrationRecord.version}_`);
      });
      
      if (!migrationFile) {
        logger.warn(`Migration file not found for version ${migrationRecord.version}`);
        continue;
      }
      
      const migration = await loadMigration(migrationFile);
      
      logger.info(`Reverting migration: ${migration.name} (v${migration.version})`);
      
      try {
        await migration.down();
        await Migration.removeMigration(migration.version);
        logger.info(`Migration reverted: ${migration.name} (v${migration.version})`);
      } catch (error) {
        logger.error(`Failed to revert migration: ${migration.name} (v${migration.version})`, error);
        throw error;
      }
    }
    
    logger.info('Migration reversion completed successfully');
  } catch (error) {
    logger.error('Migration reversion process failed:', error);
    throw error;
  }
}

module.exports = {
  runMigrations,
  revertMigrations
};
