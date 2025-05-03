import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { configureSecurity } from './config/security.js';

// Import custom middleware
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { requestId, requestLogger } from './middleware/requestMiddleware.js';
import {
  metricsMiddleware,
  connectionTrackingMiddleware,
  requestTimingMiddleware,
  register
} from './middleware/monitoringMiddleware.js';
import { cacheMiddleware, cacheInvalidationMiddleware } from './middleware/cacheMiddleware.js';
import {
  apiRateLimiter,
  recommendationRateLimiter
} from './middleware/rateLimitMiddleware.js';

// Import utilities
import logger from './utils/logger.js';
import shutdownHandler from './utils/shutdownHandler.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Import configuration
import { validateEnv } from './config/validateEnv.js';
import { testConnection, closeConnection } from './config/database.js';
import { syncDatabase } from './models/index.js';

// Import routes
import serviceRoutes from './routes/serviceRoutes.js';
import costRoutes from './routes/costRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import databaseRoutes from './routes/databaseRoutes.js';
import authRoutes from './routes/authRoutes.js';
import telecomRoutes from './routes/telecomRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Apply basic middleware
app.use(requestId); // Add unique ID to each request
app.use(express.json({ limit: '1mb' })); // Parse JSON bodies with size limit
app.use(express.urlencoded({ extended: true, limit: '1mb' })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Apply monitoring middleware
app.use(metricsMiddleware);
app.use(connectionTrackingMiddleware);
app.use(requestTimingMiddleware);

// Apply logging middleware
app.use(requestLogger); // Log request details
app.use(morgan('combined', { stream: logger.stream }));

// Apply security configuration
const securityMiddleware = configureSecurity(app);

// Performance middleware
app.use(compression()); // Compress responses

// Apply rate limiting middleware
app.use(securityMiddleware.generalLimiter); // Apply general rate limiting from security config
app.use('/api/auth', securityMiddleware.authLimiter); // Apply stricter rate limiting to auth routes
app.use('/api', apiRateLimiter); // Apply API-specific rate limiting
app.use('/api/recommendations', recommendationRateLimiter); // Apply rate limiting to resource-intensive endpoints

// Apply caching middleware
app.use(cacheMiddleware({
  ttl: parseInt(process.env.CACHE_TTL) || 60, // Default: 60 seconds
  useRedis: process.env.USE_REDIS_CACHE === 'true',
  useMemory: true
}));

// Apply cache invalidation for write operations
app.use(cacheInvalidationMiddleware({
  patterns: ['cache:*:GET:/api/services*', 'cache:*:GET:/api/recommendations*']
}));

// Static files
app.use(express.static('public', {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0 // Cache static files in production
}));

// Rate limiting is now handled in the security configuration

// API Documentation
const swaggerJsonPath = path.join(__dirname, 'public/swagger.json');
if (fs.existsSync(swaggerJsonPath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerJsonPath, 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'ONE Albania API Documentation',
    customfavIcon: '/favicon.ico'
  }));
  logger.info('Swagger documentation loaded successfully');
} else {
  logger.warn('Swagger documentation not found. Run "npm run docs" to generate it.');
}

// Routes
app.use('/api/services', serviceRoutes);
app.use('/api/costs', costRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/database', databaseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/telecom', telecomRoutes);
app.use('/api/notifications', notificationRoutes);

// Metrics endpoint
app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    logger.error('Error generating metrics:', { error: error.message, stack: error.stack });
    res.status(500).end('Error generating metrics');
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler for undefined routes
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Database initialization
const initializeDatabase = async () => {
  try {
    // Validate environment variables
    const envValid = validateEnv();

    if (!envValid) {
      logger.error('Environment validation failed. Please check your configuration.');
      process.exit(1);
    }

    // Test database connection
    const connected = await testConnection();

    if (!connected) {
      logger.error('Database connection failed. Exiting application.');
      process.exit(1);
    }

    // Sync database (without dropping tables)
    await syncDatabase(false);

    // Start server after database is initialized
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      const apiTesterPath = process.env.API_TESTER_PATH || '/test.html';
      logger.info(`API tester available at: http://localhost:${PORT}${apiTesterPath}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      logger.error('Server error:', { error: error.message, stack: error.stack });
      process.exit(1);
    });

    // Register shutdown handlers
    shutdownHandler.registerHandler('server', () => {
      return new Promise((resolve) => {
        logger.info('Closing HTTP server...');
        server.close(() => {
          logger.info('HTTP server closed');
          resolve();
        });
      });
    }, 10); // Higher priority (runs first)

    shutdownHandler.registerHandler('database', async () => {
      logger.info('Closing database connections...');
      await closeConnection();
      logger.info('Database connections closed');
    }, 5);

  } catch (error) {
    logger.error('Failed to initialize database:', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

// Start the server with database
initializeDatabase();

export default app;