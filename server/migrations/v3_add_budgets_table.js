/**
 * Add budgets table migration
 * Creates the budgets table for budget management
 */

const Migration = require('./Migration');

class AddBudgetsTableMigration extends Migration {
  constructor() {
    super('Add Budgets Table', 3);
  }

  async up() {
    this.log('Creating budgets table...');

    // Create budgets table
    await this.execute(`
      CREATE TABLE IF NOT EXISTS budgets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        entity_type ENUM('line', 'department', 'company') NOT NULL,
        entity_id INT,
        entity_name VARCHAR(100) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        period ENUM('monthly', 'quarterly', 'yearly') DEFAULT 'monthly',
        currency VARCHAR(3) DEFAULT 'EUR',
        alert_threshold INT DEFAULT 80,
        start_date DATE NOT NULL,
        end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_entity (entity_type, entity_id)
      )
    `);

    this.log('Budgets table created successfully');
  }

  async down() {
    this.log('Dropping budgets table...');

    // Drop budgets table
    await this.execute('DROP TABLE IF EXISTS budgets');

    this.log('Budgets table dropped successfully');
  }
}

module.exports = AddBudgetsTableMigration;
