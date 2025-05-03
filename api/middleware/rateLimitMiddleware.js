import { rateLimit as expressRateLimit } from 'express-rate-limit';
import { AppError } from './errorMiddleware.js';
import logger from '../utils/logger.js';
import { register } from './monitoringMiddleware.js';

// Create metrics for rate limiting
const rateLimitCounter = new register.Counter({
  name: 'rate_limit_hits_total',
  help: 'Total number of rate limit hits',
  labelNames: ['path', 'method', 'ip']
});

// In-memory store for rate limiting
class MemoryStore {
  constructor() {
    this.requests = {};
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000); // Cleanup every minute
    this.hits = 0;
    this.total = 0;
  }
  
  /**
   * Increment request count for a key
   * @param {string} key - Rate limit key
   * @returns {Promise<Object>} - Current count and reset time
   */
  async increment(key) {
    this.total++;
    const now = Date.now();
    
    // Initialize if first request
    if (!this.requests[key]) {
      this.requests[key] = {
        count: 1,
        resetAt: now + 60000, // Default window: 1 minute
        limit: 100 // Default limit
      };
      return {
        totalHits: 1,
        resetTime: this.requests[key].resetAt,
        remainingPoints: this.requests[key].limit - 1
      };
    }
    
    const request = this.requests[key];
    
    // Reset if window has passed
    if (now > request.resetAt) {
      request.count = 1;
      request.resetAt = now + 60000;
      return {
        totalHits: 1,
        resetTime: request.resetAt,
        remainingPoints: request.limit - 1
      };
    }
    
    // Increment
    request.count += 1;
    
    // Check if limit exceeded
    if (request.count > request.limit) {
      this.hits++;
    }
    
    return {
      totalHits: request.count,
      resetTime: request.resetAt,
      remainingPoints: Math.max(0, request.limit - request.count)
    };
  }
  
  /**
   * Decrement request count for a key
   * @param {string} key - Rate limit key
   * @returns {Promise<void>}
   */
  async decrement(key) {
    if (this.requests[key] && this.requests[key].count > 0) {
      this.requests[key].count--;
    }
  }
  
  /**
   * Reset a key
   * @param {string} key - Rate limit key
   * @returns {Promise<void>}
   */
  async resetKey(key) {
    delete this.requests[key];
  }
  
  /**
   * Reset all keys
   * @returns {Promise<void>}
   */
  async resetAll() {
    this.requests = {};
    this.hits = 0;
    this.total = 0;
  }
  
  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    Object.keys(this.requests).forEach(key => {
      if (now > this.requests[key].resetAt) {
        delete this.requests[key];
      }
    });
  }
  
  /**
   * Stop the cleanup interval
   */
  stop() {
    clearInterval(this.cleanupInterval);
  }
  
  /**
   * Get store statistics
   * @returns {Object} - Store statistics
   */
  getStats() {
    return {
      keys: Object.keys(this.requests).length,
      hits: this.hits,
      total: this.total,
      hitRate: this.total > 0 ? (this.hits / this.total) : 0
    };
  }
}

// Create a global memory store
const memoryStore = new MemoryStore();

/**
 * Create a custom key generator for rate limiting
 * @param {boolean} includeUser - Whether to include user ID in the key
 * @returns {Function} - Key generator function
 */
const customKeyGenerator = (includeUser = false) => {
  return (req) => {
    // Start with IP address
    let key = req.ip;
    
    // Add user ID if available and requested
    if (includeUser && req.user && req.user.id) {
      key = `${key}:user:${req.user.id}`;
    }
    
    // Add API key if available
    if (req.headers['x-api-key']) {
      key = `${key}:apikey:${req.headers['x-api-key']}`;
    }
    
    return key;
  };
};

/**
 * Create a custom handler for rate limiting
 * @returns {Function} - Handler function
 */
const customHandler = () => {
  return (req, res, next, options) => {
    // Log rate limit hit
    logger.warn('Rate limit exceeded:', { 
      ip: req.ip, 
      path: req.path,
      method: req.method,
      userAgent: req.get('user-agent'),
      userId: req.user ? req.user.id : undefined
    });
    
    // Increment metrics counter
    rateLimitCounter.inc({ 
      path: req.path, 
      method: req.method, 
      ip: req.ip.replace(/\./g, '_') // Replace dots in IP for Prometheus compatibility
    });
    
    // Create error
    const error = new AppError(options.message || 'Too many requests, please try again later', 429);
    
    // Add headers
    res.set('Retry-After', Math.ceil(options.windowMs / 1000));
    
    next(error);
  };
};

/**
 * Create a rate limiter with the given options
 * @param {Object} options - Rate limiter options
 * @returns {Function} - Rate limiter middleware
 */
export const createRateLimiter = (options = {}) => {
  const {
    windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
    max = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message = 'Too many requests, please try again later.',
    standardHeaders = true,
    legacyHeaders = false,
    includeUserInKey = false,
    skipSuccessfulRequests = false,
    path = '*'
  } = options;
  
  // Create and return rate limiter
  return expressRateLimit({
    windowMs,
    max,
    message,
    standardHeaders,
    legacyHeaders,
    keyGenerator: customKeyGenerator(includeUserInKey),
    handler: customHandler(),
    skip: (req, res) => {
      // Skip health check and metrics endpoints
      if (req.path === '/api/health' || req.path === '/metrics') {
        return true;
      }
      
      // Skip successful requests if requested
      if (skipSuccessfulRequests && res.statusCode < 400) {
        return true;
      }
      
      // Skip if path doesn't match
      if (path !== '*' && !req.path.startsWith(path)) {
        return true;
      }
      
      return false;
    },
    store: memoryStore
  });
};

/**
 * Rate limiting middleware
 * @param {Object} options - Rate limiting options
 * @returns {Function} Express middleware
 */
export const rateLimit = (options = {}) => {
  return createRateLimiter(options);
};

/**
 * General rate limiter for all routes
 */
export const generalRateLimiter = createRateLimiter({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests, please try again later.'
});

/**
 * Stricter rate limiter for authentication routes
 */
export const authRateLimiter = createRateLimiter({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 5,
  message: 'Too many authentication attempts, please try again later.',
  path: '/api/auth'
});

/**
 * Rate limiter for API endpoints
 */
export const apiRateLimiter = createRateLimiter({
  windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS) || 50,
  message: 'Too many API requests, please try again later.',
  includeUserInKey: true,
  path: '/api/'
});

/**
 * Rate limiter for recommendation endpoints (which are more resource-intensive)
 */
export const recommendationRateLimiter = createRateLimiter({
  windowMs: parseInt(process.env.RECOMMENDATION_RATE_LIMIT_WINDOW_MS) || 300000, // 5 minutes
  max: parseInt(process.env.RECOMMENDATION_RATE_LIMIT_MAX_REQUESTS) || 10,
  message: 'Too many recommendation requests, please try again later.',
  includeUserInKey: true,
  path: '/api/recommendations'
});

/**
 * Adaptive rate limiter that adjusts based on server load
 */
export const adaptiveRateLimiter = (req, res, next) => {
  // Get current server load
  const cpuUsage = process.cpuUsage();
  const memoryUsage = process.memoryUsage();
  
  // Calculate a load factor (0-1)
  const loadFactor = Math.min(
    (cpuUsage.user + cpuUsage.system) / 1000000 / 100, // CPU usage as a factor
    memoryUsage.heapUsed / memoryUsage.heapTotal // Memory usage as a factor
  );
  
  // Adjust rate limit based on load
  const baseMax = parseInt(process.env.ADAPTIVE_RATE_LIMIT_BASE) || 100;
  const minMax = parseInt(process.env.ADAPTIVE_RATE_LIMIT_MIN) || 10;
  const adjustedMax = Math.max(minMax, Math.floor(baseMax * (1 - loadFactor)));
  
  // Create a dynamic rate limiter
  const dynamicLimiter = createRateLimiter({
    max: adjustedMax,
    message: `Server is experiencing high load. Please try again later.`
  });
  
  // Apply the dynamic limiter
  dynamicLimiter(req, res, next);
};

export default {
  createRateLimiter,
  rateLimit,
  generalRateLimiter,
  authRateLimiter,
  apiRateLimiter,
  recommendationRateLimiter,
  adaptiveRateLimiter,
  getStats: () => memoryStore.getStats()
};
