import redisCache from '../utils/redisCache.js';
import memoryCache from '../utils/memoryCache.js';
import logger from '../utils/logger.js';

/**
 * Generate a cache key from the request
 * @param {Object} req - Express request object
 * @returns {string} - Cache key
 */
const generateCacheKey = (req) => {
  const path = req.originalUrl || req.url;
  const method = req.method;
  const userId = req.user ? req.user.id : 'anonymous';
  
  // For GET requests, include query params in the key
  if (method === 'GET') {
    return `cache:${userId}:${method}:${path}`;
  }
  
  // For other methods, include the body in the key
  const bodyHash = JSON.stringify(req.body);
  return `cache:${userId}:${method}:${path}:${bodyHash}`;
};

/**
 * Determine if a request should be cached
 * @param {Object} req - Express request object
 * @returns {boolean} - True if request should be cached
 */
const shouldCache = (req) => {
  // Only cache GET requests by default
  if (req.method !== 'GET') {
    return false;
  }
  
  // Don't cache authenticated admin requests
  if (req.user && req.user.role === 'admin') {
    return false;
  }
  
  // Don't cache if the client requested no-cache
  const cacheControl = req.headers['cache-control'];
  if (cacheControl && (cacheControl.includes('no-cache') || cacheControl.includes('no-store'))) {
    return false;
  }
  
  // Check for specific paths that should not be cached
  const nonCacheablePaths = [
    '/api/auth',
    '/api/health',
    '/metrics',
    '/api/notifications/realtime'
  ];
  
  for (const path of nonCacheablePaths) {
    if (req.path.startsWith(path)) {
      return false;
    }
  }
  
  return true;
};

/**
 * Cache middleware factory
 * @param {Object} options - Cache options
 * @returns {Function} - Express middleware
 */
export const cacheMiddleware = (options = {}) => {
  const {
    ttl = 60, // Default TTL: 60 seconds
    useRedis = process.env.USE_REDIS_CACHE === 'true',
    useMemory = true,
    keyGenerator = generateCacheKey,
    shouldCacheRequest = shouldCache
  } = options;
  
  return async (req, res, next) => {
    // Skip caching if conditions are not met
    if (!shouldCacheRequest(req)) {
      return next();
    }
    
    const cacheKey = keyGenerator(req);
    
    // Try to get from memory cache first (fastest)
    if (useMemory) {
      const cachedResponse = memoryCache.get(cacheKey);
      if (cachedResponse) {
        logger.debug('Cache hit (memory):', { path: req.path, key: cacheKey });
        return res.status(cachedResponse.status)
          .set('X-Cache', 'HIT')
          .set('X-Cache-Source', 'memory')
          .json(cachedResponse.body);
      }
    }
    
    // Try Redis cache if enabled
    if (useRedis) {
      try {
        const cachedResponse = await redisCache.get(cacheKey);
        if (cachedResponse) {
          logger.debug('Cache hit (redis):', { path: req.path, key: cacheKey });
          
          // Also store in memory cache for faster subsequent access
          if (useMemory) {
            memoryCache.set(cacheKey, cachedResponse, ttl);
          }
          
          return res.status(cachedResponse.status)
            .set('X-Cache', 'HIT')
            .set('X-Cache-Source', 'redis')
            .json(cachedResponse.body);
        }
      } catch (error) {
        logger.error('Redis cache error:', { error: error.message, path: req.path });
        // Continue without caching if Redis fails
      }
    }
    
    // Cache miss, capture the response
    const originalSend = res.json;
    
    res.json = function(body) {
      // Store the response in cache
      const response = {
        status: res.statusCode,
        body: body
      };
      
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Set in memory cache
        if (useMemory) {
          memoryCache.set(cacheKey, response, ttl);
        }
        
        // Set in Redis cache
        if (useRedis) {
          redisCache.set(cacheKey, response, ttl)
            .catch(err => logger.error('Redis cache set error:', { error: err.message, path: req.path }));
        }
        
        res.set('X-Cache', 'MISS');
      }
      
      // Call the original method
      return originalSend.call(this, body);
    };
    
    next();
  };
};

/**
 * Clear cache for specific patterns
 * @param {string|Array<string>} patterns - Cache key patterns to clear
 * @returns {Promise<boolean>} - Success
 */
export const clearCache = async (patterns) => {
  const patternArray = Array.isArray(patterns) ? patterns : [patterns];
  let success = true;
  
  try {
    // Clear memory cache (simple approach: clear all)
    memoryCache.clear();
    
    // Clear Redis cache with pattern matching
    if (process.env.USE_REDIS_CACHE === 'true') {
      const client = redisCache.getClient();
      
      for (const pattern of patternArray) {
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
          await client.del(...keys);
          logger.info(`Cleared ${keys.length} Redis cache keys matching pattern: ${pattern}`);
        }
      }
    }
  } catch (error) {
    logger.error('Error clearing cache:', { error: error.message, patterns });
    success = false;
  }
  
  return success;
};

/**
 * Cache invalidation middleware
 * @param {Object} options - Options
 * @returns {Function} - Express middleware
 */
export const cacheInvalidationMiddleware = (options = {}) => {
  const {
    patterns = []
  } = options;
  
  return async (req, res, next) => {
    // Store the original end method
    const originalEnd = res.end;
    
    res.end = async function(...args) {
      // Only invalidate cache for successful write operations
      if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') && 
          res.statusCode >= 200 && res.statusCode < 300) {
        
        // Generate patterns based on the request
        const invalidationPatterns = [];
        
        // Add static patterns
        patterns.forEach(pattern => invalidationPatterns.push(pattern));
        
        // Add dynamic patterns based on the request
        const path = req.path.split('/');
        if (path.length > 2) {
          // For example, if path is /api/users/123, add pattern cache:*:GET:/api/users*
          const resourcePath = path.slice(0, 3).join('/');
          invalidationPatterns.push(`cache:*:GET:${resourcePath}*`);
        }
        
        // Clear the cache
        await clearCache(invalidationPatterns);
      }
      
      // Call the original method
      return originalEnd.apply(this, args);
    };
    
    next();
  };
};

export default {
  cacheMiddleware,
  clearCache,
  cacheInvalidationMiddleware
};
