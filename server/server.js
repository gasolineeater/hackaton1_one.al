const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const { setupSwagger } = require('./config/swagger');
const { errorHandler, notFoundHandler } = require('./utils/errorHandler');
const { rateLimiterMiddleware } = require('./middleware/rateLimiter.middleware');
const { cacheMiddleware } = require('./middleware/cache.middleware');
const apiVersion = require('./middleware/apiVersion.middleware');
const requestTracer = require('./middleware/requestTracer.middleware');
const sanitize = require('./middleware/sanitize.middleware');
const config = require('./config/config');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const telecomRoutes = require('./routes/telecom.routes');
const costControlRoutes = require('./routes/costControl.routes');
const budgetRoutes = require('./routes/budget.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const serviceManagementRoutes = require('./routes/serviceManagement.routes');
const aiRecommendationsRoutes = require('./routes/aiRecommendations.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const usageHistoryRoutes = require('./routes/usageHistory.routes');

// Create Express app
const app = express();

// Middleware
app.use(cors(config.cors));
app.use(helmet()); // Security headers
app.use(requestTracer()); // Request tracing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitize()); // Data sanitization
app.use(morgan('combined', { stream: logger.stream })); // Request logging

// Apply rate limiting to all requests
app.use(rateLimiterMiddleware(
  config.rateLimit.max,
  config.rateLimit.windowMs
));

// Apply API versioning
app.use(apiVersion({
  defaultVersion: '1',
  versions: ['1', '2'],
  headerName: 'Accept-Version'
}));

// Simple route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ONE Albania SME Dashboard API.' });
});

// Setup Swagger documentation
setupSwagger(app);

// API routes
app.use('/api/auth', authRoutes);

// Apply caching to read-heavy routes
app.use('/api/telecom', cacheMiddleware(300), telecomRoutes); // 5 minutes cache
app.use('/api/cost-control', cacheMiddleware(300), costControlRoutes); // 5 minutes cache
app.use('/api/budget', cacheMiddleware(300), budgetRoutes); // 5 minutes cache
app.use('/api/analytics', cacheMiddleware(300), analyticsRoutes); // 5 minutes cache
app.use('/api/service-management', cacheMiddleware(300), serviceManagementRoutes); // 5 minutes cache
app.use('/api/ai-recommendations', cacheMiddleware(300), aiRecommendationsRoutes); // 5 minutes cache
app.use('/api/notifications', notificationsRoutes); // No cache for notifications
app.use('/api/usage-history', cacheMiddleware(300), usageHistoryRoutes); // 5 minutes cache

// 404 handler for undefined routes
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.server.port;
const { testConnection } = require('./config/db.config');

// Only start server if database connection is successful
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
      logger.error('Failed to connect to database. Server will not start.');
      process.exit(1);
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT} in ${config.server.env} mode.`);
      logger.info(`API documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
