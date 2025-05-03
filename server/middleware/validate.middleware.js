/**
 * Request validation middleware using Joi
 */

const Joi = require('joi');
const { badRequest } = require('../utils/errorHandler');

/**
 * Validate request against schema
 * @param {Object} schema - Joi validation schema
 * @returns {Function} - Express middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false, // Include all errors
      allowUnknown: true, // Ignore unknown props
      stripUnknown: true // Remove unknown props
    };
    
    // Validate request body, query, and params
    const { error, value } = schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params
      },
      validationOptions
    );
    
    if (error) {
      // Format validation errors
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      return next(badRequest(errorMessage));
    }
    
    // Replace request properties with validated ones
    req.body = value.body;
    req.query = value.query;
    req.params = value.params;
    
    return next();
  };
};

module.exports = {
  validate
};
