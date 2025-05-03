import winston from 'winston';
import 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import os from 'os';

dotenv.config();

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Define log formats
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
  winston.format.json()
);

// Console format with colors and better readability
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, metadata }) => {
    let metaStr = '';
    if (metadata && Object.keys(metadata).length > 0) {
      metaStr = JSON.stringify(metadata, null, 2);
    }
    return `${timestamp} ${level}: ${message}${metaStr ? `\n${metaStr}` : ''}`;
  })
);

// Get system info for metadata
const systemInfo = {
  hostname: os.hostname(),
  platform: os.platform(),
  nodeVersion: process.version,
  pid: process.pid
};

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'one-albania-api',
    environment: process.env.NODE_ENV || 'development',
    system: systemInfo
  },
  transports: [
    // Write all logs with level 'error' and below to error log with daily rotation
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: process.env.LOG_MAX_SIZE || '5m',
      maxFiles: process.env.LOG_MAX_FILES || '7d',
      zippedArchive: true
    }),

    // Write all logs with level 'info' and below to combined log with daily rotation
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: process.env.LOG_MAX_SIZE || '5m',
      maxFiles: process.env.LOG_MAX_FILES || '7d',
      zippedArchive: true
    }),

    // Write all logs with level 'http' and below to access log with daily rotation
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDir, 'access-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'http',
      maxSize: process.env.LOG_MAX_SIZE || '5m',
      maxFiles: process.env.LOG_MAX_FILES || '7d',
      zippedArchive: true
    })
  ]
});

// Add console transport with appropriate format
logger.add(new winston.transports.Console({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: consoleFormat,
  handleExceptions: true
}));

// Create a stream object for Morgan
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

// Add helper methods
logger.startTimer = () => {
  const start = process.hrtime();
  return {
    done: (info) => {
      const elapsed = process.hrtime(start);
      const duration = (elapsed[0] * 1000) + (elapsed[1] / 1000000); // Convert to ms
      logger.debug('Timer completed', {
        ...info,
        duration_ms: duration.toFixed(2)
      });
      return duration;
    }
  };
};

// Log uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error: error.message, stack: error.stack });
  // Give logger time to write before exiting
  setTimeout(() => process.exit(1), 1000);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason });
});

export default logger;
