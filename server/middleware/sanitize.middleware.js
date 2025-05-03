/**
 * Data sanitization middleware
 * Sanitizes request data to prevent XSS attacks
 */

const xss = require('xss');

/**
 * Sanitize a value
 * @param {any} value - Value to sanitize
 * @returns {any} - Sanitized value
 */
const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return xss(value);
  }
  
  if (Array.isArray(value)) {
    return value.map(item => sanitizeValue(item));
  }
  
  if (value !== null && typeof value === 'object') {
    return sanitizeObject(value);
  }
  
  return value;
};

/**
 * Sanitize an object
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
const sanitizeObject = (obj) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeValue(value);
  }
  
  return sanitized;
};

/**
 * Sanitize middleware
 * @returns {Function} - Express middleware
 */
const sanitize = () => {
  return (req, res, next) => {
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }
    
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }
    
    if (req.params) {
      req.params = sanitizeObject(req.params);
    }
    
    next();
  };
};

module.exports = sanitize;
