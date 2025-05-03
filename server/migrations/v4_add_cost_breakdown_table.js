/**
 * Add cost_breakdown table migration
 * Creates the cost_breakdown table for cost analytics
 */

const Migration = require('./Migration');

class AddCostBreakdownTableMigration extends Migration {
  constructor() {
    super('Add Cost Breakdown Table', 4);
  }

  async up() {
    this.log('Creating cost_breakdown table...');

    // Create cost_breakdown table
    await this.execute(`
      CREATE TABLE IF NOT EXISTS cost_breakdown (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        month INT NOT NULL,
        year INT NOT NULL,
        total_cost DECIMAL(10, 2) DEFAULT 0,
        data_cost DECIMAL(10, 2) DEFAULT 0,
        calls_cost DECIMAL(10, 2) DEFAULT 0,
        sms_cost DECIMAL(10, 2) DEFAULT 0,
        other_cost DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_month_year (month, year),
        UNIQUE KEY unique_user_month_year (user_id, month, year)
      )
    `);

    this.log('Cost breakdown table created successfully');
  }

  async down() {
    this.log('Dropping cost_breakdown table...');

    // Drop cost_breakdown table
    await this.execute('DROP TABLE IF EXISTS cost_breakdown');

    this.log('Cost breakdown table dropped successfully');
  }
}

module.exports = AddCostBreakdownTableMigration;
