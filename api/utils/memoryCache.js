import logger from './logger.js';

/**
 * Simple in-memory cache implementation
 */
class MemoryCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.ttls = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
    this.maxSize = options.maxSize || 1000;
    this.checkPeriod = options.checkPeriod || 60 * 1000; // 1 minute
    this.pruneInterval = setInterval(() => this.prune(), this.checkPeriod);
    
    // Ensure cleanup on process exit
    process.on('exit', () => {
      clearInterval(this.pruneInterval);
    });
  }

  /**
   * Set a value in the cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (0 = no expiration)
   * @returns {boolean} - Success
   */
  set(key, value, ttl = 3600) {
    try {
      // Check if we need to make room
      if (this.cache.size >= this.maxSize) {
        this.evictLRU();
      }
      
      this.cache.set(key, value);
      this.stats.sets++;
      
      if (ttl > 0) {
        const expiry = Date.now() + (ttl * 1000);
        this.ttls.set(key, expiry);
      }
      
      return true;
    } catch (error) {
      logger.error('Memory cache set error:', { key, error: error.message });
      return false;
    }
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {any} - Cached value or undefined
   */
  get(key) {
    try {
      // Check if key exists and not expired
      if (this.has(key)) {
        const value = this.cache.get(key);
        this.stats.hits++;
        return value;
      }
      
      this.stats.misses++;
      return undefined;
    } catch (error) {
      logger.error('Memory cache get error:', { key, error: error.message });
      return undefined;
    }
  }

  /**
   * Check if a key exists in the cache and is not expired
   * @param {string} key - Cache key
   * @returns {boolean} - True if key exists and not expired
   */
  has(key) {
    if (!this.cache.has(key)) {
      return false;
    }
    
    // Check expiration
    if (this.ttls.has(key)) {
      const expiry = this.ttls.get(key);
      if (Date.now() > expiry) {
        // Expired, remove it
        this.delete(key);
        return false;
      }
    }
    
    return true;
  }

  /**
   * Delete a value from the cache
   * @param {string} key - Cache key
   * @returns {boolean} - Success
   */
  delete(key) {
    try {
      const result = this.cache.delete(key);
      this.ttls.delete(key);
      if (result) {
        this.stats.deletes++;
      }
      return result;
    } catch (error) {
      logger.error('Memory cache delete error:', { key, error: error.message });
      return false;
    }
  }

  /**
   * Clear the entire cache
   * @returns {boolean} - Success
   */
  clear() {
    try {
      this.cache.clear();
      this.ttls.clear();
      return true;
    } catch (error) {
      logger.error('Memory cache clear error:', { error: error.message });
      return false;
    }
  }

  /**
   * Remove expired items from the cache
   * @returns {number} - Number of items pruned
   */
  prune() {
    try {
      const now = Date.now();
      let pruned = 0;
      
      for (const [key, expiry] of this.ttls.entries()) {
        if (now > expiry) {
          this.delete(key);
          pruned++;
        }
      }
      
      if (pruned > 0) {
        logger.debug(`Pruned ${pruned} expired items from memory cache`);
      }
      
      return pruned;
    } catch (error) {
      logger.error('Memory cache prune error:', { error: error.message });
      return 0;
    }
  }

  /**
   * Evict the least recently used item from the cache
   * @returns {boolean} - Success
   */
  evictLRU() {
    try {
      if (this.cache.size === 0) return false;
      
      // Simple LRU: just remove the first key (oldest insertion)
      const firstKey = this.cache.keys().next().value;
      return this.delete(firstKey);
    } catch (error) {
      logger.error('Memory cache eviction error:', { error: error.message });
      return false;
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache statistics
   */
  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0
      ? this.stats.hits / (this.stats.hits + this.stats.misses)
      : 0;
    
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: hitRate,
      memoryUsage: process.memoryUsage().heapUsed
    };
  }
}

// Create a singleton instance
const memoryCache = new MemoryCache({
  maxSize: parseInt(process.env.MEMORY_CACHE_MAX_SIZE) || 1000,
  checkPeriod: parseInt(process.env.MEMORY_CACHE_CHECK_PERIOD) || 60000
});

export default memoryCache;
