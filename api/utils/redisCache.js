import Redis from 'ioredis';
import logger from './logger.js';

// Create Redis client
const redisClient = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL)
  : new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || '',
      db: parseInt(process.env.REDIS_DB) || 0,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });

// Handle Redis connection events
redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('error', (err) => {
  logger.error('Redis client error:', { error: err.message, stack: err.stack });
});

redisClient.on('reconnecting', () => {
  logger.warn('Redis client reconnecting');
});

/**
 * Redis cache wrapper
 */
const redisCache = {
  /**
   * Set a value in the cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<string>} - Redis response
   */
  async set(key, value, ttl = 3600) {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl > 0) {
        return await redisClient.set(key, serializedValue, 'EX', ttl);
      } else {
        return await redisClient.set(key, serializedValue);
      }
    } catch (error) {
      logger.error('Redis set error:', { key, error: error.message });
      return null;
    }
  },

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {Promise<any>} - Cached value or null
   */
  async get(key) {
    try {
      const value = await redisClient.get(key);
      if (!value) return null;
      return JSON.parse(value);
    } catch (error) {
      logger.error('Redis get error:', { key, error: error.message });
      return null;
    }
  },

  /**
   * Delete a value from the cache
   * @param {string} key - Cache key
   * @returns {Promise<number>} - Number of keys removed
   */
  async del(key) {
    try {
      return await redisClient.del(key);
    } catch (error) {
      logger.error('Redis del error:', { key, error: error.message });
      return 0;
    }
  },

  /**
   * Check if a key exists in the cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} - True if key exists
   */
  async exists(key) {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis exists error:', { key, error: error.message });
      return false;
    }
  },

  /**
   * Set multiple values in the cache
   * @param {Object} keyValues - Object with key-value pairs
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<string>} - Redis response
   */
  async mset(keyValues, ttl = 3600) {
    try {
      const serializedKeyValues = {};
      Object.keys(keyValues).forEach(key => {
        serializedKeyValues[key] = JSON.stringify(keyValues[key]);
      });
      
      const pipeline = redisClient.pipeline();
      pipeline.mset(serializedKeyValues);
      
      if (ttl > 0) {
        Object.keys(serializedKeyValues).forEach(key => {
          pipeline.expire(key, ttl);
        });
      }
      
      await pipeline.exec();
      return 'OK';
    } catch (error) {
      logger.error('Redis mset error:', { error: error.message });
      return null;
    }
  },

  /**
   * Get multiple values from the cache
   * @param {Array<string>} keys - Array of cache keys
   * @returns {Promise<Object>} - Object with key-value pairs
   */
  async mget(keys) {
    try {
      const values = await redisClient.mget(keys);
      const result = {};
      
      keys.forEach((key, index) => {
        if (values[index]) {
          result[key] = JSON.parse(values[index]);
        } else {
          result[key] = null;
        }
      });
      
      return result;
    } catch (error) {
      logger.error('Redis mget error:', { keys, error: error.message });
      return {};
    }
  },

  /**
   * Clear the entire cache
   * @returns {Promise<string>} - Redis response
   */
  async clear() {
    try {
      return await redisClient.flushdb();
    } catch (error) {
      logger.error('Redis clear error:', { error: error.message });
      return null;
    }
  },

  /**
   * Get cache stats
   * @returns {Promise<Object>} - Cache stats
   */
  async getStats() {
    try {
      const info = await redisClient.info();
      const lines = info.split('\r\n');
      const stats = {};
      
      lines.forEach(line => {
        const parts = line.split(':');
        if (parts.length === 2) {
          stats[parts[0]] = parts[1];
        }
      });
      
      return stats;
    } catch (error) {
      logger.error('Redis stats error:', { error: error.message });
      return {};
    }
  },

  /**
   * Get the Redis client instance
   * @returns {Redis} - Redis client
   */
  getClient() {
    return redisClient;
  }
};

export default redisCache;
