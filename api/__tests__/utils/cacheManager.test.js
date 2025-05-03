import cacheManager from '../../utils/cacheManager.js';

// Mock dependencies
jest.mock('../../utils/logger.js');

describe('Cache Manager', () => {
  beforeEach(() => {
    // Clear the cache before each test
    cacheManager.clear();
  });

  describe('set and get', () => {
    it('should store and retrieve values', () => {
      const key = 'test-key';
      const value = { name: 'Test Value', data: [1, 2, 3] };
      
      // Set the value
      cacheManager.set(key, value);
      
      // Get the value
      const retrieved = cacheManager.get(key);
      
      // Assertions
      expect(retrieved).toEqual(value);
    });

    it('should return undefined for non-existent keys', () => {
      const result = cacheManager.get('non-existent-key');
      expect(result).toBeUndefined();
    });

    it('should respect TTL (Time To Live)', async () => {
      const key = 'ttl-test';
      const value = 'This will expire';
      
      // Set with a very short TTL (100ms)
      cacheManager.set(key, value, 0.1);
      
      // Verify it exists immediately
      expect(cacheManager.get(key)).toEqual(value);
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Verify it's gone
      expect(cacheManager.get(key)).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should remove items from the cache', () => {
      const key = 'delete-test';
      const value = 'Delete me';
      
      // Set the value
      cacheManager.set(key, value);
      
      // Verify it exists
      expect(cacheManager.get(key)).toEqual(value);
      
      // Delete it
      const result = cacheManager.delete(key);
      
      // Verify delete operation succeeded
      expect(result).toBe(true);
      
      // Verify it's gone
      expect(cacheManager.get(key)).toBeUndefined();
    });

    it('should return false when deleting non-existent keys', () => {
      const result = cacheManager.delete('non-existent-key');
      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all items from the cache', () => {
      // Set multiple values
      cacheManager.set('key1', 'value1');
      cacheManager.set('key2', 'value2');
      cacheManager.set('key3', 'value3');
      
      // Verify they exist
      expect(cacheManager.get('key1')).toEqual('value1');
      expect(cacheManager.get('key2')).toEqual('value2');
      expect(cacheManager.get('key3')).toEqual('value3');
      
      // Clear the cache
      cacheManager.clear();
      
      // Verify all are gone
      expect(cacheManager.get('key1')).toBeUndefined();
      expect(cacheManager.get('key2')).toBeUndefined();
      expect(cacheManager.get('key3')).toBeUndefined();
    });
  });

  describe('getStats', () => {
    it('should track cache statistics', () => {
      // Initial stats
      const initialStats = cacheManager.getStats();
      expect(initialStats.hits).toBe(0);
      expect(initialStats.misses).toBe(0);
      expect(initialStats.sets).toBe(0);
      
      // Set a value
      cacheManager.set('stats-test', 'value');
      
      // Get the value (hit)
      cacheManager.get('stats-test');
      
      // Try to get a non-existent value (miss)
      cacheManager.get('non-existent');
      
      // Get the updated stats
      const updatedStats = cacheManager.getStats();
      
      // Assertions
      expect(updatedStats.hits).toBe(1);
      expect(updatedStats.misses).toBe(1);
      expect(updatedStats.sets).toBe(1);
      expect(updatedStats.size).toBe(1);
      expect(updatedStats.hitRate).toBeCloseTo(0.5);
    });
  });

  describe('eviction', () => {
    it('should evict least recently used items when cache is full', () => {
      // Save the original maxSize
      const originalMaxSize = cacheManager.maxSize;
      
      // Set a very small maxSize for testing
      cacheManager.maxSize = 3;
      
      // Fill the cache
      cacheManager.set('key1', 'value1');
      cacheManager.set('key2', 'value2');
      cacheManager.set('key3', 'value3');
      
      // Access key1 and key2 to make them more recently used
      cacheManager.get('key1');
      cacheManager.get('key2');
      
      // Add a new item to trigger eviction
      cacheManager.set('key4', 'value4');
      
      // key3 should be evicted as it's the least recently used
      expect(cacheManager.get('key1')).toEqual('value1');
      expect(cacheManager.get('key2')).toEqual('value2');
      expect(cacheManager.get('key3')).toBeUndefined();
      expect(cacheManager.get('key4')).toEqual('value4');
      
      // Restore the original maxSize
      cacheManager.maxSize = originalMaxSize;
    });
  });
});
