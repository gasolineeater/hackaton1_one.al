import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import { AppError } from './errorMiddleware.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid or expired token'
        });
      }

      // Attach user info to request
      req.user = decoded;
      next();
    });
  } catch (error) {
    logger.error('Authentication error:', { error: error.message, stack: error.stack });
    return next(new AppError('Authentication failed', 401));
  }
};

/**
 * Role-based authorization middleware
 * @param {string|string[]} roles - Required role(s)
 */
export const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      if (roles.length && !roles.includes(req.user.role)) {
        return next(new AppError('Insufficient permissions', 403));
      }

      next();
    } catch (error) {
      logger.error('Authorization error:', { error: error.message, stack: error.stack });
      return next(new AppError('Authorization failed', 403));
    }
  };
};

export default {
  authenticate,
  authorize
};
