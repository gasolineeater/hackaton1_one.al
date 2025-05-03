import logger from './logger.js';

/**
 * Simple in-memory cache manager
 * Provides caching functionality with TTL support
 */
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0
    };
    
    // Run cleanup every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
    
    // Maximum cache size (items)
    this.maxSize = 1000;
  }
  
  /**
   * Get an item from the cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or undefined if not found
   */
  get(key) {
    const cacheItem = this.cache.get(key);
    
    if (!cacheItem) {
      this.stats.misses++;
      return undefined;
    }
    
    // Check if item has expired
    if (cacheItem.expiresAt && cacheItem.expiresAt < Date.now()) {
      this.delete(key);
      this.stats.misses++;
      return undefined;
    }
    
    // Update access time and hit count
    cacheItem.lastAccessed = Date.now();
    cacheItem.hits++;
    this.stats.hits++;
    
    return cacheItem.value;
  }
  
  /**
   * Set an item in the cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in seconds
   */
  set(key, value, ttl = 300) {
    // Check if cache is at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }
    
    const expiresAt = ttl > 0 ? Date.now() + (ttl * 1000) : null;
    
    this.cache.set(key, {
      value,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      expiresAt,
      hits: 0
    });
    
    this.stats.sets++;
    
    return value;
  }
  
  /**
   * Delete an item from the cache
   * @param {string} key - Cache key
   * @returns {boolean} True if item was deleted
   */
  delete(key) {
    return this.cache.delete(key);
  }
  
  /**
   * Clear the entire cache
   */
  clear() {
    this.cache.clear();
    logger.info('Cache cleared');
  }
  
  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
    };
  }
  
  /**
   * Clean up expired items
   */
  cleanup() {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expiresAt && item.expiresAt < now) {
        this.cache.delete(key);
        expiredCount++;
      }
    }
    
    if (expiredCount > 0) {
      this.stats.evictions += expiredCount;
      logger.debug(`Cache cleanup: removed ${expiredCount} expired items`);
    }
  }
  
  /**
   * Evict least recently used item
   */
  evictLRU() {
    let oldestKey = null;
    let oldestAccess = Infinity;
    
    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestAccess) {
        oldestAccess = item.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }
  }
  
  /**
   * Stop the cleanup interval
   */
  stop() {
    clearInterval(this.cleanupInterval);
  }
}

// Export singleton instance
export default new CacheManager();
