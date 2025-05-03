import logger from './logger.js';

/**
 * Graceful shutdown handler
 * Manages the graceful shutdown of the application
 */
class ShutdownHandler {
  constructor() {
    this.handlers = [];
    this.isShuttingDown = false;
    this.shutdownTimeout = 10000; // 10 seconds
    
    // Register process signal handlers
    process.on('SIGINT', () => this.shutdown('SIGINT'));
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception:', { error: error.message, stack: error.stack });
      this.shutdown('uncaughtException');
    });
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled rejection:', { reason });
      this.shutdown('unhandledRejection');
    });
  }
  
  /**
   * Register a shutdown handler
   * @param {string} name - Handler name
   * @param {Function} handler - Async function to execute during shutdown
   * @param {number} priority - Priority (higher numbers execute first)
   */
  registerHandler(name, handler, priority = 0) {
    this.handlers.push({ name, handler, priority });
    logger.debug(`Registered shutdown handler: ${name} with priority ${priority}`);
  }
  
  /**
   * Gracefully shutdown the application
   * @param {string} signal - Signal that triggered the shutdown
   */
  async shutdown(signal) {
    // Prevent multiple shutdown attempts
    if (this.isShuttingDown) {
      logger.info('Shutdown already in progress, ignoring signal:', signal);
      return;
    }
    
    this.isShuttingDown = true;
    logger.info(`Graceful shutdown initiated (${signal})`);
    
    // Sort handlers by priority (higher first)
    const sortedHandlers = [...this.handlers].sort((a, b) => b.priority - a.priority);
    
    // Create a promise that resolves after the timeout
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        logger.error('Shutdown timed out, forcing exit');
        resolve(false);
      }, this.shutdownTimeout);
    });
    
    try {
      // Execute all handlers with timeout
      const shutdownPromise = (async () => {
        for (const { name, handler } of sortedHandlers) {
          try {
            logger.info(`Executing shutdown handler: ${name}`);
            await handler();
            logger.info(`Shutdown handler completed: ${name}`);
          } catch (error) {
            logger.error(`Error in shutdown handler ${name}:`, { error: error.message, stack: error.stack });
          }
        }
        return true;
      })();
      
      // Race between orderly shutdown and timeout
      const success = await Promise.race([shutdownPromise, timeoutPromise]);
      
      if (success) {
        logger.info('Graceful shutdown completed successfully');
      }
    } catch (error) {
      logger.error('Error during shutdown:', { error: error.message, stack: error.stack });
    } finally {
      // Exit with appropriate code
      process.exit(signal === 'uncaughtException' ? 1 : 0);
    }
  }
}

// Export singleton instance
export default new ShutdownHandler();
