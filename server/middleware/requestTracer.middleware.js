/**
 * Request tracer middleware
 * Adds a unique ID to each request for tracing
 */

const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

/**
 * Request tracer middleware
 * @returns {Function} - Express middleware
 */
const requestTracer = () => {
  return (req, res, next) => {
    // Generate a unique request ID
    const requestId = uuidv4();
    
    // Add request ID to request object
    req.requestId = requestId;
    
    // Add request ID to response headers
    res.setHeader('X-Request-ID', requestId);
    
    // Log request
    logger.info(`Request started: ${req.method} ${req.originalUrl}`, {
      requestId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    // Track response time
    const startTime = Date.now();
    
    // Override end method to log response
    const originalEnd = res.end;
    res.end = function(...args) {
      // Calculate response time
      const responseTime = Date.now() - startTime;
      
      // Add response time to headers
      res.setHeader('X-Response-Time', `${responseTime}ms`);
      
      // Log response
      logger.info(`Request completed: ${req.method} ${req.originalUrl}`, {
        requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`
      });
      
      // Call original end method
      originalEnd.apply(res, args);
    };
    
    next();
  };
};

module.exports = requestTracer;
