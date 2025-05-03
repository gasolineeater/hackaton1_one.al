import logger from '../utils/logger.js';

/**
 * Error handling middleware
 * Provides consistent error responses and logging
 */
export const errorHandler = (err, req, res, next) => {
  // Set default status code and error message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log the error
  if (statusCode >= 500) {
    logger.error(\`[${statusCode}] \${message}\`, {
      path: req.path,
      method: req.method,
      error: err.stack,
      requestId: req.id
    });
  } else {
    logger.warn(\`[${statusCode}] \${message}\`, {
      path: req.path,
      method: req.method,
      requestId: req.id
    });
  }
  
  // Prepare error response
  const errorResponse = {
    status: 'error',
    message: message
  };
  
  // Add validation errors if available
  if (err.errors) {
    errorResponse.errors = err.errors;
  }
  
  // Add request ID for tracking
  if (req.id) {
    errorResponse.requestId = req.id;
  }
  
  // Don't expose stack trace in production
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    errorResponse.stack = err.stack;
  }
  
  res.status(statusCode).json(errorResponse);
};

/**
 * Not found middleware
 * Handles 404 errors for routes that don't exist
 */
export const notFound = (req, res, next) => {
  const error = new Error(\`Not Found - \${req.originalUrl}\`);
  error.statusCode = 404;
  next(error);
};

/**
 * Custom error class with status code
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default {
  errorHandler,
  notFound,
  AppError
};
