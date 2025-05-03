/**
 * Cache middleware for improving API performance
 * Implements a simple in-memory cache with configurable TTL
 */

// Simple in-memory cache
const cache = new Map();

/**
 * Cache middleware
 * @param {number} ttl - Time to live in seconds
 * @returns {Function} - Express middleware
 */
const cacheMiddleware = (ttl = 300) => {
  return (req, res, next) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create a cache key from the request URL and user ID (if authenticated)
    const userId = req.userId || 'anonymous';
    const cacheKey = `${userId}:${req.originalUrl}`;

    // Check if we have a cached response
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse && cachedResponse.expiry > Date.now()) {
      return res.json(cachedResponse.data);
    }

    // Store the original res.json method
    const originalJson = res.json;

    // Override res.json method to cache the response
    res.json = function(data) {
      // Store in cache
      cache.set(cacheKey, {
        data,
        expiry: Date.now() + (ttl * 1000)
      });

      // Call the original method
      return originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Clear cache for a specific key pattern
 * @param {string} pattern - Key pattern to match
 */
const clearCache = (pattern) => {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
};

/**
 * Clear all cache
 */
const clearAllCache = () => {
  cache.clear();
};

module.exports = {
  cacheMiddleware,
  clearCache,
  clearAllCache
};
