/**
 * Add refresh tokens table migration
 * Creates the refresh_tokens table for token-based authentication
 */

const Migration = require('./Migration');

class AddRefreshTokensMigration extends Migration {
  constructor() {
    super('Add Refresh Tokens', 2);
  }

  async up() {
    this.log('Creating refresh_tokens table...');

    // Create refresh_tokens table
    await this.execute(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_token (token)
      )
    `);

    this.log('Refresh tokens table created successfully');
  }

  async down() {
    this.log('Dropping refresh_tokens table...');

    // Drop refresh_tokens table
    await this.execute('DROP TABLE IF EXISTS refresh_tokens');

    this.log('Refresh tokens table dropped successfully');
  }
}

module.exports = AddRefreshTokensMigration;
