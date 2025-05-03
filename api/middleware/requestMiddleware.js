import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

/**
 * Request ID middleware
 * Adds a unique ID to each request for tracking
 */
export const requestId = (req, res, next) => {
  const id = uuidv4();
  req.id = id;
  
  // Add request ID to response headers
  res.setHeader('X-Request-ID', id);
  
  next();
};

/**
 * Request logger middleware
 * Logs basic information about each request
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.info(\`Request: \${req.method} \${req.originalUrl}\`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    requestId: req.id
  });
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[level](\`Response: \${res.statusCode} \${duration}ms\`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      requestId: req.id
    });
  });
  
  next();
};

export default {
  requestId,
  requestLogger
};
