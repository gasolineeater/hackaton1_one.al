import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import logger from '../utils/logger.js';

/**
 * Configure security middleware
 * @param {Object} app - Express app
 */
export function configureSecurity(app) {
  // Helmet configuration
  const helmetOptions = {
    contentSecurityPolicy: process.env.NODE_ENV === 'production' || process.env.HELMET_CONTENT_SECURITY_POLICY === 'true',
    xssFilter: true,
    noSniff: true,
    hidePoweredBy: true,
    hsts: {
      maxAge: parseInt(process.env.HELMET_HSTS_MAX_AGE) || 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true
    },
    frameguard: {
      action: 'deny'
    },
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin'
    }
  };
  
  app.use(helmet(helmetOptions));
  logger.info('Helmet security headers configured');
  
  // CORS configuration
  const corsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
      
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: parseInt(process.env.CORS_MAX_AGE) || 86400 // 24 hours
  };
  
  app.use(cors(corsOptions));
  logger.info('CORS configured with allowed origins:', { origins: process.env.ALLOWED_ORIGINS });
  
  // General rate limiting
  const generalLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 'error',
      message: 'Too many requests, please try again later.'
    },
    skip: (req) => req.path === '/api/health' || req.path === '/metrics', // Skip rate limiting for health check and metrics
    handler: (req, res, next, options) => {
      logger.warn('Rate limit exceeded:', { 
        ip: req.ip, 
        path: req.path,
        method: req.method,
        userAgent: req.get('user-agent')
      });
      res.status(429).json(options.message);
    }
  });
  
  // Authentication rate limiting (stricter)
  const authLimiter = rateLimit({
    windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 5, // limit each IP to 5 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 'error',
      message: 'Too many authentication attempts, please try again later.'
    },
    handler: (req, res, next, options) => {
      logger.warn('Authentication rate limit exceeded:', { 
        ip: req.ip, 
        path: req.path,
        method: req.method,
        userAgent: req.get('user-agent')
      });
      res.status(429).json(options.message);
    }
  });
  
  return {
    generalLimiter,
    authLimiter
  };
}

export default configureSecurity;
