import promBundle from 'express-prom-bundle';
import { register, Counter, Histogram, Gauge } from 'prom-client';
import logger from '../utils/logger.js';

// Create custom metrics
const httpRequestDurationMicroseconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10]
});

const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const httpErrorsTotal = new Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP errors',
  labelNames: ['method', 'route', 'status_code', 'error_type']
});

const activeConnections = new Gauge({
  name: 'http_active_connections',
  help: 'Number of active HTTP connections'
});

const databaseQueriesTotal = new Counter({
  name: 'database_queries_total',
  help: 'Total number of database queries',
  labelNames: ['operation', 'model']
});

const databaseQueryDurationSeconds = new Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'model'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2]
});

const aiRequestsTotal = new Counter({
  name: 'ai_requests_total',
  help: 'Total number of AI API requests',
  labelNames: ['endpoint', 'status']
});

const aiRequestDurationSeconds = new Histogram({
  name: 'ai_request_duration_seconds',
  help: 'Duration of AI API requests in seconds',
  labelNames: ['endpoint'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 20, 30]
});

const cacheHitsTotal = new Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['cache_type']
});

const cacheMissesTotal = new Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['cache_type']
});

// Create Prometheus middleware
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { app: 'one_albania_api' },
  promClient: { collectDefaultMetrics: {} },
  promRegistry: register
});

// Connection tracking middleware
const connectionTrackingMiddleware = (req, res, next) => {
  activeConnections.inc();
  
  res.on('finish', () => {
    activeConnections.dec();
    
    // Record request metrics
    const route = req.route ? req.route.path : req.path;
    const method = req.method;
    const statusCode = res.statusCode;
    
    httpRequestsTotal.inc({ method, route, status_code: statusCode });
    
    // Record error metrics if applicable
    if (statusCode >= 400) {
      const errorType = statusCode >= 500 ? 'server_error' : 'client_error';
      httpErrorsTotal.inc({ method, route, status_code: statusCode, error_type: errorType });
    }
  });
  
  next();
};

// Request timing middleware
const requestTimingMiddleware = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const end = process.hrtime(start);
    const duration = end[0] + end[1] / 1e9; // Convert to seconds
    
    const route = req.route ? req.route.path : req.path;
    const method = req.method;
    const statusCode = res.statusCode;
    
    httpRequestDurationMicroseconds.observe({ method, route, status_code: statusCode }, duration);
    
    // Log slow requests
    if (duration > 1) {
      logger.warn(`Slow request: ${method} ${route} took ${duration.toFixed(2)}s`);
    }
  });
  
  next();
};

// Export metrics registry and middleware
export {
  register,
  metricsMiddleware,
  connectionTrackingMiddleware,
  requestTimingMiddleware,
  httpRequestsTotal,
  httpErrorsTotal,
  activeConnections,
  databaseQueriesTotal,
  databaseQueryDurationSeconds,
  aiRequestsTotal,
  aiRequestDurationSeconds,
  cacheHitsTotal,
  cacheMissesTotal
};
