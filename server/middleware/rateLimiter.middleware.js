/**
 * Rate limiter middleware to prevent API abuse
 * Implements a simple in-memory rate limiter
 */

// Store for rate limiting
const requestCounts = new Map();

/**
 * Rate limiter middleware
 * @param {number} maxRequests - Maximum requests allowed in the window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} - Express middleware
 */
const rateLimiterMiddleware = (maxRequests = 100, windowMs = 60000) => {
  return (req, res, next) => {
    // Get client IP
    const ip = req.ip || req.connection.remoteAddress;
    
    // Create a key that includes the IP and endpoint
    const key = `${ip}:${req.originalUrl}`;
    
    // Get current time
    const now = Date.now();
    
    // Initialize or get existing record
    if (!requestCounts.has(key)) {
      requestCounts.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }
    
    const record = requestCounts.get(key);
    
    // If the reset time has passed, reset the counter
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }
    
    // If under the limit, increment and continue
    if (record.count < maxRequests) {
      record.count++;
      return next();
    }
    
    // Calculate remaining time until reset
    const remainingTime = Math.ceil((record.resetTime - now) / 1000);
    
    // Return rate limit exceeded error
    return res.status(429).json({
      message: 'Rate limit exceeded',
      retryAfter: remainingTime
    });
  };
};

/**
 * Clean up expired rate limit records
 * Should be called periodically to prevent memory leaks
 */
const cleanupRateLimiter = () => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(key);
    }
  }
};

// Set up periodic cleanup
setInterval(cleanupRateLimiter, 60000);

module.exports = {
  rateLimiterMiddleware
};
