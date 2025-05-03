import { Sequelize } from 'sequelize';
import logger from '../utils/logger.js';
import { register } from './monitoringMiddleware.js';

// Create metrics for database queries
const dbQueryCounter = new register.Counter({
  name: 'database_queries_total',
  help: 'Total number of database queries',
  labelNames: ['type', 'model', 'success']
});

const dbQueryDurationHistogram = new register.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Database query duration in seconds',
  labelNames: ['type', 'model'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10]
});

const slowQueryCounter = new register.Counter({
  name: 'database_slow_queries_total',
  help: 'Total number of slow database queries',
  labelNames: ['type', 'model']
});

/**
 * Track database queries and their performance
 * @param {Object} sequelize - Sequelize instance
 */
export const trackDatabaseQueries = (sequelize) => {
  // Set up query logging
  const slowQueryThreshold = parseInt(process.env.SLOW_QUERY_THRESHOLD_MS) || 500;
  
  sequelize.options.logging = (sql, timing) => {
    try {
      // Extract query type and model from SQL
      const queryType = sql.trim().split(' ')[0].toUpperCase();
      let model = 'unknown';
      
      // Try to extract model name from SQL
      const tableMatch = sql.match(/FROM\s+`?(\w+)`?/i);
      if (tableMatch && tableMatch[1]) {
        model = tableMatch[1];
      }
      
      // Record query metrics
      dbQueryCounter.inc({ type: queryType, model, success: 'true' });
      
      // Record query duration if available
      if (timing && timing.duration) {
        const durationSeconds = timing.duration / 1000;
        dbQueryDurationHistogram.observe({ type: queryType, model }, durationSeconds);
        
        // Log slow queries
        if (timing.duration > slowQueryThreshold) {
          slowQueryCounter.inc({ type: queryType, model });
          logger.warn('Slow query detected:', { 
            sql: sql.substring(0, 200) + (sql.length > 200 ? '...' : ''),
            duration: timing.duration,
            model,
            type: queryType
          });
        }
      }
    } catch (error) {
      logger.error('Error tracking database query:', { error: error.message });
    }
  };
  
  // Add hook for query errors
  sequelize.addHook('afterQuery', (options, { sql, duration, error }) => {
    if (error) {
      try {
        const queryType = sql.trim().split(' ')[0].toUpperCase();
        let model = 'unknown';
        
        const tableMatch = sql.match(/FROM\s+`?(\w+)`?/i);
        if (tableMatch && tableMatch[1]) {
          model = tableMatch[1];
        }
        
        dbQueryCounter.inc({ type: queryType, model, success: 'false' });
        
        logger.error('Database query error:', { 
          sql: sql.substring(0, 200) + (sql.length > 200 ? '...' : ''),
          error: error.message,
          model,
          type: queryType
        });
      } catch (err) {
        logger.error('Error handling database query error:', { error: err.message });
      }
    }
  });
};

/**
 * Optimize database connection pool
 * @param {Object} sequelize - Sequelize instance
 */
export const optimizeDatabasePool = (sequelize) => {
  // Get pool configuration from environment or use defaults
  const maxConnections = parseInt(process.env.DB_POOL_MAX) || 10;
  const minConnections = parseInt(process.env.DB_POOL_MIN) || 2;
  const idleTimeout = parseInt(process.env.DB_POOL_IDLE) || 10000;
  const acquireTimeout = parseInt(process.env.DB_POOL_ACQUIRE) || 60000;
  
  // Configure the connection pool
  sequelize.options.pool = {
    max: maxConnections,
    min: minConnections,
    idle: idleTimeout,
    acquire: acquireTimeout,
    evict: 30000
  };
  
  logger.info('Database connection pool optimized:', { 
    max: maxConnections,
    min: minConnections,
    idle: idleTimeout,
    acquire: acquireTimeout
  });
};

/**
 * Add query optimization hints to Sequelize queries
 * @param {Object} sequelize - Sequelize instance
 */
export const addQueryOptimizationHints = (sequelize) => {
  // Add a hook to add optimization hints to queries
  sequelize.addHook('beforeFind', (options) => {
    // Add index hints for large tables
    if (options.model && ['Usage', 'Billing', 'Logs'].includes(options.model.name)) {
      options.indexHints = options.indexHints || [];
      
      // Add USE INDEX hint if we're querying by a specific field
      if (options.where) {
        const whereKeys = Object.keys(options.where);
        if (whereKeys.includes('customerId')) {
          options.indexHints.push({ type: 'USE', values: ['idx_customer_id'] });
        } else if (whereKeys.includes('date')) {
          options.indexHints.push({ type: 'USE', values: ['idx_date'] });
        }
      }
    }
    
    // Add query optimization comments
    options.comment = options.comment || '';
    options.comment += ' /* API Query */';
    
    return options;
  });
  
  logger.info('Query optimization hints configured');
};

/**
 * Initialize database optimizations
 * @param {Object} sequelize - Sequelize instance
 */
export const initializeDatabaseOptimizations = (sequelize) => {
  trackDatabaseQueries(sequelize);
  optimizeDatabasePool(sequelize);
  addQueryOptimizationHints(sequelize);
  
  // Set up periodic connection validation
  const validateInterval = parseInt(process.env.DB_VALIDATE_INTERVAL) || 60000; // 1 minute
  
  setInterval(async () => {
    try {
      await sequelize.authenticate();
      logger.debug('Database connection validated');
    } catch (error) {
      logger.error('Database connection validation failed:', { error: error.message });
    }
  }, validateInterval);
  
  logger.info('Database optimizations initialized');
};

export default {
  trackDatabaseQueries,
  optimizeDatabasePool,
  addQueryOptimizationHints,
  initializeDatabaseOptimizations
};
