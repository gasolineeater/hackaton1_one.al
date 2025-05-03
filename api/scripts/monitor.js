import express from 'express';
import { register } from 'prom-client';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.MONITOR_PORT || 9090;

// Endpoint to expose metrics
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    logger.error('Error generating metrics:', { error: error.message, stack: error.stack });
    res.status(500).end('Error generating metrics');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    cpuUsage: process.cpuUsage(),
    memoryUsage: process.memoryUsage(),
    systemMemory: {
      total: os.totalmem(),
      free: os.freemem()
    },
    loadAverage: os.loadavg()
  };
  
  res.json(healthcheck);
});

// System info endpoint
app.get('/system', (req, res) => {
  const systemInfo = {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    release: os.release(),
    cpus: os.cpus().length,
    uptime: os.uptime(),
    networkInterfaces: os.networkInterfaces(),
    loadAverage: os.loadavg(),
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
      usage: (1 - os.freemem() / os.totalmem()) * 100
    }
  };
  
  res.json(systemInfo);
});

// Log files endpoint
app.get('/logs', (req, res) => {
  const logsDir = path.join(__dirname, '../logs');
  
  try {
    if (!fs.existsSync(logsDir)) {
      return res.status(404).json({ error: 'Logs directory not found' });
    }
    
    const files = fs.readdirSync(logsDir)
      .filter(file => file.endsWith('.log'))
      .map(file => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      });
    
    res.json({ files });
  } catch (error) {
    logger.error('Error reading log files:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Error reading log files' });
  }
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Monitoring server running at http://localhost:${PORT}`);
  logger.info(`Metrics available at http://localhost:${PORT}/metrics`);
  logger.info(`Health check available at http://localhost:${PORT}/health`);
});
