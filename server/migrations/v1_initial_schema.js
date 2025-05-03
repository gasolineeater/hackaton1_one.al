/**
 * Initial schema migration
 * Creates the base tables for the application
 */

const Migration = require('./Migration');

class InitialSchemaMigration extends Migration {
  constructor() {
    super('Initial Schema', 1);
  }

  async up() {
    this.log('Creating initial schema...');

    // Create users table
    await this.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        company_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_username (username)
      )
    `);

    // Create service_plans table
    await this.execute(`
      CREATE TABLE IF NOT EXISTS service_plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        data_limit FLOAT NOT NULL,
        calls INT NOT NULL,
        sms INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        features JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create telecom_lines table
    await this.execute(`
      CREATE TABLE IF NOT EXISTS telecom_lines (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone_number VARCHAR(20) NOT NULL,
        assigned_to VARCHAR(100) NOT NULL,
        plan_id INT NOT NULL,
        monthly_limit FLOAT,
        current_usage FLOAT DEFAULT 0,
        status ENUM('active', 'suspended', 'terminated') DEFAULT 'active',
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (plan_id) REFERENCES service_plans(id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_phone_number (phone_number)
      )
    `);

    // Create usage_history table
    await this.execute(`
      CREATE TABLE IF NOT EXISTS usage_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        line_id INT NOT NULL,
        data_used FLOAT DEFAULT 0,
        calls_used INT DEFAULT 0,
        sms_used INT DEFAULT 0,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (line_id) REFERENCES telecom_lines(id) ON DELETE CASCADE,
        INDEX idx_line_id (line_id),
        INDEX idx_date (date)
      )
    `);

    // Create ai_recommendations table
    await this.execute(`
      CREATE TABLE IF NOT EXISTS ai_recommendations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        recommendation_type ENUM('plan', 'usage', 'cost', 'service') NOT NULL,
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        savings_amount DECIMAL(10, 2),
        is_applied BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_priority (priority)
      )
    `);

    // Create cost_breakdown table
    await this.execute(`
      CREATE TABLE IF NOT EXISTS cost_breakdown (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        month INT NOT NULL,
        year INT NOT NULL,
        total_cost DECIMAL(10, 2) NOT NULL,
        data_cost DECIMAL(10, 2) NOT NULL,
        calls_cost DECIMAL(10, 2) NOT NULL,
        sms_cost DECIMAL(10, 2) NOT NULL,
        other_cost DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_date (year, month)
      )
    `);

    // Create service_status table
    await this.execute(`
      CREATE TABLE IF NOT EXISTS service_status (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        status ENUM('enabled', 'disabled') DEFAULT 'disabled',
        last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        UNIQUE KEY unique_user_service (user_id, name)
      )
    `);

    // Create notifications table
    await this.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('info', 'warning', 'alert', 'success') DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_is_read (is_read)
      )
    `);

    // Create user_settings table
    await this.execute(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        budget_limit DECIMAL(10, 2),
        alert_threshold INT DEFAULT 80,
        notification_preferences JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_id (user_id)
      )
    `);

    this.log('Initial schema created successfully');
  }

  async down() {
    this.log('Reverting initial schema...');

    // Drop tables in reverse order to handle foreign key constraints
    await this.execute('DROP TABLE IF EXISTS user_settings');
    await this.execute('DROP TABLE IF EXISTS notifications');
    await this.execute('DROP TABLE IF EXISTS service_status');
    await this.execute('DROP TABLE IF EXISTS cost_breakdown');
    await this.execute('DROP TABLE IF EXISTS ai_recommendations');
    await this.execute('DROP TABLE IF EXISTS usage_history');
    await this.execute('DROP TABLE IF EXISTS telecom_lines');
    await this.execute('DROP TABLE IF EXISTS service_plans');
    await this.execute('DROP TABLE IF EXISTS users');

    this.log('Initial schema reverted successfully');
  }
}

module.exports = InitialSchemaMigration;
