import dotenv from 'dotenv';
import Joi from 'joi';
import logger from '../utils/logger.js';

// Load environment variables
dotenv.config();

/**
 * Validate environment variables
 * @returns {boolean} - True if validation passes, false otherwise
 */
export function validateEnv() {
  const envSchema = Joi.object({
    // Server Configuration
    NODE_ENV: Joi.string().valid('development', 'test', 'staging', 'production').required(),
    PORT: Joi.number().default(3001),
    ALLOWED_ORIGINS: Joi.string().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    FRONTEND_URL: Joi.string().uri().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),

    // Database Configuration
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(3306),
    DB_NAME: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_POOL_MAX: Joi.number().default(10),
    DB_POOL_MIN: Joi.number().default(2),
    DB_SSL: Joi.boolean().default(false),

    // JWT Configuration
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_ACCESS_EXPIRATION: Joi.string().default('15m'),
    JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
    JWT_RESET_EXPIRATION: Joi.string().default('1h'),
    JWT_COOKIE_SECURE: Joi.boolean().default(false),
    JWT_COOKIE_HTTPONLY: Joi.boolean().default(true),
    JWT_COOKIE_SAMESITE: Joi.string().valid('strict', 'lax', 'none').default('lax'),

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: Joi.number().default(60000),
    RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
    AUTH_RATE_LIMIT_WINDOW_MS: Joi.number().default(60000),
    AUTH_RATE_LIMIT_MAX_REQUESTS: Joi.number().default(5),

    // Logging
    LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'http', 'debug').default('info'),
    LOG_MAX_SIZE: Joi.string().default('10m'),
    LOG_MAX_FILES: Joi.string().default('14d'),

    // ONE Albania API Configuration
    ONE_ALBANIA_API_URL: Joi.string().uri().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    ONE_ALBANIA_API_KEY: Joi.string().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    ONE_ALBANIA_API_SECRET: Joi.string().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),

    // Email Configuration
    EMAIL_HOST: Joi.string().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    EMAIL_PORT: Joi.number().default(587),
    EMAIL_USER: Joi.string().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    EMAIL_PASSWORD: Joi.string().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    EMAIL_FROM: Joi.string().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    EMAIL_SECURE: Joi.boolean().default(true),

    // SMS Configuration
    SMS_PROVIDER: Joi.string().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    SMS_API_KEY: Joi.string().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    SMS_API_SECRET: Joi.string().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    SMS_FROM: Joi.string().when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),

    // Gemini API Configuration
    GEMINI_API_KEY: Joi.string().required(),
    GEMINI_MODEL: Joi.string().default('gemini-pro'),
    GEMINI_TEMPERATURE: Joi.number().min(0).max(1).default(0.7),
    GEMINI_MAX_TOKENS: Joi.number().default(2048),

    // Security Configuration
    HELMET_CONTENT_SECURITY_POLICY: Joi.boolean().default(false),
    HELMET_HSTS_MAX_AGE: Joi.number().default(31536000),
    CORS_MAX_AGE: Joi.number().default(86400)
  }).unknown();

  const { error, value } = envSchema.validate(process.env, { abortEarly: false });

  if (error) {
    logger.error('Environment validation failed:', {
      errors: error.details.map(detail => ({
        message: detail.message,
        path: detail.path.join('.')
      }))
    });
    return false;
  }

  // Check for insecure JWT secret
  if (process.env.JWT_SECRET === 'your_jwt_secret_key_change_this_in_production') {
    logger.warn('JWT_SECRET is using the default value. This is insecure and should be changed.');
  }

  // Check for missing API keys
  if (process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    logger.warn('GEMINI_API_KEY is using the default value. AI features will be limited.');
  }

  if (process.env.ONE_ALBANIA_API_KEY === 'your_one_albania_api_key') {
    logger.warn('ONE_ALBANIA_API_KEY is using the default value. ONE Albania API integration will be limited.');
  }

  // Log successful validation
  logger.info('Environment validation passed');

  // Update process.env with default values
  Object.assign(process.env, value);

  return true;
}

export default validateEnv;
