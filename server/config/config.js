/**
 * Application configuration
 * Centralizes all configuration settings
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Environment
const env = process.env.NODE_ENV || 'development';
const isDevelopment = env === 'development';
const isProduction = env === 'production';
const isTest = env === 'test';

// Server
const server = {
  port: parseInt(process.env.PORT, 10) || 5000,
  env,
  isDevelopment,
  isProduction,
  isTest,
  apiPrefix: '/api'
};

// Database
const database = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'one_albania_db',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT, 10) || 0
};

// Authentication
const auth = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 10
};

// Logging
const logging = {
  level: isDevelopment ? 'debug' : 'info',
  dir: path.join(__dirname, '../logs')
};

// Rate limiting
const rateLimit = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60 * 1000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100 // 100 requests per minute
};

// CORS
const cors = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Export configuration
module.exports = {
  server,
  database,
  auth,
  logging,
  rateLimit,
  cors
};
