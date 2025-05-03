-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS one_albania_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE one_albania_db;

-- Create tables (these will be created by Sequelize, but this is for reference)

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  companyName VARCHAR(255) NOT NULL,
  businessType VARCHAR(255) NOT NULL,
  contactPerson VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  postalCode VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Albania',
  employeeCount INT NOT NULL,
  registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category ENUM('Mobile', 'Internet', 'Fixed Line', 'Cloud', 'IoT') NOT NULL,
  monthlyCost DECIMAL(10, 2) NOT NULL,
  setupFee DECIMAL(10, 2) DEFAULT 0.00,
  contractLength INT NOT NULL DEFAULT 12,
  features JSON NOT NULL,
  limitations JSON,
  popularity INT CHECK (popularity BETWEEN 1 AND 10),
  bestFor JSON,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customerId INT NOT NULL,
  serviceId INT NOT NULL,
  startDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  endDate DATETIME,
  status ENUM('active', 'pending', 'suspended', 'cancelled', 'expired') DEFAULT 'active',
  quantity INT NOT NULL DEFAULT 1,
  monthlyCost DECIMAL(10, 2) NOT NULL,
  setupFee DECIMAL(10, 2) DEFAULT 0.00,
  billingCycle ENUM('monthly', 'quarterly', 'annually') DEFAULT 'monthly',
  autoRenew BOOLEAN DEFAULT TRUE,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (serviceId) REFERENCES services(id) ON DELETE CASCADE
);

-- Usage records table
CREATE TABLE IF NOT EXISTS usage_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subscriptionId INT NOT NULL,
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  usageType ENUM('data', 'voice', 'sms', 'api_calls', 'storage', 'compute', 'other') NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  department VARCHAR(100),
  employeeId VARCHAR(100),
  location VARCHAR(255),
  deviceId VARCHAR(100),
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (subscriptionId) REFERENCES subscriptions(id) ON DELETE CASCADE
);

-- Billings table
CREATE TABLE IF NOT EXISTS billings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customerId INT NOT NULL,
  invoiceNumber VARCHAR(50) NOT NULL UNIQUE,
  issueDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dueDate DATETIME NOT NULL,
  billingPeriodStart DATETIME NOT NULL,
  billingPeriodEnd DATETIME NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0.00,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('draft', 'issued', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
  paymentMethod VARCHAR(50),
  paymentDate DATETIME,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
);

-- Billing items table
CREATE TABLE IF NOT EXISTS billing_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  billingId INT NOT NULL,
  subscriptionId INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unitPrice DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0.00,
  tax DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  itemType ENUM('subscription', 'usage', 'one_time', 'setup', 'discount', 'other') NOT NULL DEFAULT 'subscription',
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (billingId) REFERENCES billings(id) ON DELETE CASCADE,
  FOREIGN KEY (subscriptionId) REFERENCES subscriptions(id) ON DELETE CASCADE
);

-- Create a database user (optional)
-- CREATE USER IF NOT EXISTS 'onealbania_user'@'localhost' IDENTIFIED BY 'your_password';
-- GRANT ALL PRIVILEGES ON onealbania_db.* TO 'onealbania_user'@'localhost';
-- FLUSH PRIVILEGES;
