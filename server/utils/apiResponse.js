/**
 * API Response Utility
 * Standardizes API responses across the application
 */

/**
 * Create a success response
 * @param {Object} res - Express response object
 * @param {any} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} - Express response
 */
const success = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
    timestamp: new Date().toISOString(),
    requestId: res.req.requestId
  });
};

/**
 * Create an error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} errors - Validation errors
 * @returns {Object} - Express response
 */
const error = (res, message = 'Error', statusCode = 500, errors = null) => {
  const response = {
    status: 'error',
    message,
    timestamp: new Date().toISOString(),
    requestId: res.req.requestId
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Create a validation error response
 * @param {Object} res - Express response object
 * @param {Object} errors - Validation errors
 * @param {string} message - Error message
 * @returns {Object} - Express response
 */
const validationError = (res, errors, message = 'Validation Error') => {
  return error(res, message, 400, errors);
};

/**
 * Create a not found response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} - Express response
 */
const notFound = (res, message = 'Resource not found') => {
  return error(res, message, 404);
};

/**
 * Create an unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} - Express response
 */
const unauthorized = (res, message = 'Unauthorized') => {
  return error(res, message, 401);
};

/**
 * Create a forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} - Express response
 */
const forbidden = (res, message = 'Forbidden') => {
  return error(res, message, 403);
};

module.exports = {
  success,
  error,
  validationError,
  notFound,
  unauthorized,
  forbidden
};
