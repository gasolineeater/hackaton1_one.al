import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '15m';
const REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';
const RESET_EXPIRATION = process.env.JWT_RESET_EXPIRATION || '1h';

/**
 * Generate access token
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      customerId: user.customerId
    },
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRATION }
  );
};

/**
 * Generate refresh token
 * @returns {string} Refresh token
 */
export const generateRefreshToken = () => {
  return uuidv4();
};

/**
 * Calculate token expiry date
 * @param {string} expiration - Expiration string (e.g., '7d')
 * @returns {Date} Expiry date
 */
export const calculateExpiryDate = (expiration = REFRESH_EXPIRATION) => {
  const expiryDate = new Date();
  const timeUnit = expiration.slice(-1);
  const timeValue = parseInt(expiration.slice(0, -1));

  switch (timeUnit) {
    case 's':
      expiryDate.setSeconds(expiryDate.getSeconds() + timeValue);
      break;
    case 'm':
      expiryDate.setMinutes(expiryDate.getMinutes() + timeValue);
      break;
    case 'h':
      expiryDate.setHours(expiryDate.getHours() + timeValue);
      break;
    case 'd':
      expiryDate.setDate(expiryDate.getDate() + timeValue);
      break;
    default:
      expiryDate.setDate(expiryDate.getDate() + 7); // Default to 7 days
  }

  return expiryDate;
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token or null
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Generate password reset token
 * @returns {string} Reset token
 */
export const generateResetToken = () => {
  return uuidv4();
};

/**
 * Calculate reset token expiry
 * @returns {Date} Expiry date
 */
export const calculateResetTokenExpiry = () => {
  return calculateExpiryDate(RESET_EXPIRATION);
};

export default {
  generateAccessToken,
  generateRefreshToken,
  calculateExpiryDate,
  verifyToken,
  generateResetToken,
  calculateResetTokenExpiry
};
