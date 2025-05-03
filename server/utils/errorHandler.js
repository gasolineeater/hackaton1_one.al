/**
 * Error handling utilities
 */

/**
 * Custom API Error class
 */
class ApiError extends Error {
  /**
   * Create a new API error
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {boolean} isOperational - Whether this is an operational error
   */
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Create a 400 Bad Request error
 * @param {string} message - Error message
 * @returns {ApiError} - API error
 */
const badRequest = (message = 'Bad Request') => {
  return new ApiError(message, 400);
};

/**
 * Create a 401 Unauthorized error
 * @param {string} message - Error message
 * @returns {ApiError} - API error
 */
const unauthorized = (message = 'Unauthorized') => {
  return new ApiError(message, 401);
};

/**
 * Create a 403 Forbidden error
 * @param {string} message - Error message
 * @returns {ApiError} - API error
 */
const forbidden = (message = 'Forbidden') => {
  return new ApiError(message, 403);
};

/**
 * Create a 404 Not Found error
 * @param {string} message - Error message
 * @returns {ApiError} - API error
 */
const notFound = (message = 'Not Found') => {
  return new ApiError(message, 404);
};

/**
 * Create a 409 Conflict error
 * @param {string} message - Error message
 * @returns {ApiError} - API error
 */
const conflict = (message = 'Conflict') => {
  return new ApiError(message, 409);
};

/**
 * Create a 500 Internal Server Error
 * @param {string} message - Error message
 * @returns {ApiError} - API error
 */
const internal = (message = 'Internal Server Error') => {
  return new ApiError(message, 500, false);
};

/**
 * Error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Log error
  console.error('ERROR:', err);
  
  // Default to 500 server error
  let statusCode = 500;
  let message = 'Internal Server Error';
  let stack = undefined;
  
  // If it's an ApiError, use its properties
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    // Handle validation errors
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'JsonWebTokenError') {
    // Handle JWT errors
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    // Handle JWT expiration
    statusCode = 401;
    message = 'Token expired';
  }
  
  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    stack = err.stack;
  }
  
  // Send error response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    stack
  });
};

/**
 * Not found middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFoundHandler = (req, res, next) => {
  next(notFound(`Cannot ${req.method} ${req.originalUrl}`));
};

module.exports = {
  ApiError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  internal,
  errorHandler,
  notFoundHandler
};
