-- Create database
CREATE DATABASE IF NOT EXISTS one_albania_db;
USE one_albania_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'user') NOT NULL DEFAULT 'user',
  company_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Telecom lines table
CREATE TABLE IF NOT EXISTS telecom_lines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  assigned_to VARCHAR(255) NOT NULL,
  plan_id INT NOT NULL,
  monthly_limit DECIMAL(10, 2) NOT NULL,
  current_usage DECIMAL(10, 2) DEFAULT 0,
  status ENUM('active', 'suspended', 'inactive') NOT NULL DEFAULT 'active',
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Service plans table
CREATE TABLE IF NOT EXISTS service_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  data_limit DECIMAL(10, 2) NOT NULL,
  calls VARCHAR(255) NOT NULL,
  sms VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Plan features table
CREATE TABLE IF NOT EXISTS plan_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plan_id INT NOT NULL,
  feature VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES service_plans(id) ON DELETE CASCADE
);

-- Usage history table
CREATE TABLE IF NOT EXISTS usage_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  line_id INT NOT NULL,
  month VARCHAR(10) NOT NULL,
  year INT NOT NULL,
  data_usage DECIMAL(10, 2) DEFAULT 0,
  calls_usage DECIMAL(10, 2) DEFAULT 0,
  sms_usage DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (line_id) REFERENCES telecom_lines(id) ON DELETE CASCADE
);

-- Cost breakdown table
CREATE TABLE IF NOT EXISTS cost_breakdown (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  month VARCHAR(10) NOT NULL,
  year INT NOT NULL,
  data_cost DECIMAL(10, 2) DEFAULT 0,
  calls_cost DECIMAL(10, 2) DEFAULT 0,
  sms_cost DECIMAL(10, 2) DEFAULT 0,
  roaming_cost DECIMAL(10, 2) DEFAULT 0,
  other_cost DECIMAL(10, 2) DEFAULT 0,
  total_cost DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Service status table
CREATE TABLE IF NOT EXISTS service_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status ENUM('enabled', 'disabled') NOT NULL DEFAULT 'disabled',
  user_id INT NOT NULL,
  last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- AI recommendations table
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  savings_amount DECIMAL(10, 2) NOT NULL,
  priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  user_id INT NOT NULL,
  is_applied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'warning', 'alert', 'success') NOT NULL DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data for service plans
INSERT INTO service_plans (name, data_limit, calls, sms, price) VALUES
('Business Economy', 5, 'Unlimited', '100', 15),
('Business Standard', 10, 'Unlimited', '200', 25),
('Business Premium', 20, 'Unlimited', 'Unlimited', 40);

-- Insert sample plan features
INSERT INTO plan_features (plan_id, feature) VALUES
(1, 'Basic Support'),
(1, 'Standard Data Speed'),
(2, 'Priority Support'),
(2, 'High Data Speed'),
(2, 'International Calls (10 countries)'),
(3, '24/7 Premium Support'),
(3, 'Maximum Data Speed'),
(3, 'International Calls (50 countries)'),
(3, 'Roaming Package');
