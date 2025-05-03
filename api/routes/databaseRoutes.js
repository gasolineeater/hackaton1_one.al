import express from 'express';
import { syncDatabase } from '../models/index.js';
import { 
  CustomerRepository, 
  ServiceRepository,
  SubscriptionRepository,
  UsageRepository,
  BillingRepository
} from '../repositories/index.js';

const router = express.Router();

/**
 * @route GET /api/database/health
 * @desc Check database health
 */
router.get('/health', async (req, res) => {
  try {
    // Check if we can query the database
    const customerCount = await CustomerRepository.count();
    const serviceCount = await ServiceRepository.count();
    
    res.json({
      status: 'success',
      message: 'Database is healthy',
      data: {
        customerCount,
        serviceCount
      }
    });
  } catch (error) {
    console.error('Database health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database health check failed',
      error: error.message
    });
  }
});

/**
 * @route POST /api/database/sync
 * @desc Sync database (admin only)
 */
router.post('/sync', async (req, res) => {
  try {
    // This should be protected with authentication in production
    const { force = false } = req.body;
    
    await syncDatabase(force);
    
    res.json({
      status: 'success',
      message: `Database synchronized ${force ? 'with' : 'without'} dropping tables`
    });
  } catch (error) {
    console.error('Database sync error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to sync database',
      error: error.message
    });
  }
});

/**
 * @route GET /api/database/stats
 * @desc Get database statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      customers: await CustomerRepository.count(),
      services: await ServiceRepository.count(),
      subscriptions: await SubscriptionRepository.count(),
      usageRecords: await UsageRepository.count(),
      billings: await BillingRepository.count()
    };
    
    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    console.error('Database stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get database statistics',
      error: error.message
    });
  }
});

export default router;
