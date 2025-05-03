/**
 * Base Migration class
 * Provides structure for database migrations
 */

const { pool } = require('../config/db.config');
const logger = require('../utils/logger');

class Migration {
  /**
   * Create a new migration
   * @param {string} name - Migration name
   * @param {number} version - Migration version
   */
  constructor(name, version) {
    this.name = name;
    this.version = version;
  }

  /**
   * Apply the migration
   * @returns {Promise<void>}
   */
  async up() {
    throw new Error('Method not implemented');
  }

  /**
   * Revert the migration
   * @returns {Promise<void>}
   */
  async down() {
    throw new Error('Method not implemented');
  }

  /**
   * Log migration information
   * @param {string} message - Log message
   */
  log(message) {
    logger.info(`Migration ${this.name} (v${this.version}): ${message}`);
  }

  /**
   * Execute a query
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<any>} - Query results
   */
  async execute(query, params = []) {
    try {
      const [results] = await pool.execute(query, params);
      return results;
    } catch (error) {
      logger.error(`Migration error in ${this.name} (v${this.version}):`, error);
      throw error;
    }
  }

  /**
   * Check if migrations table exists
   * @returns {Promise<boolean>} - True if table exists
   */
  static async checkMigrationsTable() {
    try {
      const [rows] = await pool.execute(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE() 
        AND table_name = 'migrations'
      `);
      
      return rows.length > 0;
    } catch (error) {
      logger.error('Error checking migrations table:', error);
      throw error;
    }
  }

  /**
   * Create migrations table
   * @returns {Promise<void>}
   */
  static async createMigrationsTable() {
    try {
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS migrations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          version INT NOT NULL,
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY unique_version (version)
        )
      `);
      
      logger.info('Migrations table created successfully');
    } catch (error) {
      logger.error('Error creating migrations table:', error);
      throw error;
    }
  }

  /**
   * Get applied migrations
   * @returns {Promise<Array>} - Applied migrations
   */
  static async getAppliedMigrations() {
    try {
      const [rows] = await pool.execute(`
        SELECT * FROM migrations ORDER BY version ASC
      `);
      
      return rows;
    } catch (error) {
      logger.error('Error getting applied migrations:', error);
      throw error;
    }
  }

  /**
   * Record a migration
   * @param {string} name - Migration name
   * @param {number} version - Migration version
   * @returns {Promise<void>}
   */
  static async recordMigration(name, version) {
    try {
      await pool.execute(`
        INSERT INTO migrations (name, version) VALUES (?, ?)
      `, [name, version]);
      
      logger.info(`Migration ${name} (v${version}) recorded successfully`);
    } catch (error) {
      logger.error(`Error recording migration ${name} (v${version}):`, error);
      throw error;
    }
  }

  /**
   * Remove a migration record
   * @param {number} version - Migration version
   * @returns {Promise<void>}
   */
  static async removeMigration(version) {
    try {
      await pool.execute(`
        DELETE FROM migrations WHERE version = ?
      `, [version]);
      
      logger.info(`Migration v${version} removed successfully`);
    } catch (error) {
      logger.error(`Error removing migration v${version}:`, error);
      throw error;
    }
  }
}

module.exports = Migration;
