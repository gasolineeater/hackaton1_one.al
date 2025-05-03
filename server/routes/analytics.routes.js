const express = require('express');
const analyticsController = require('../controllers/analytics.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get usage trends
router.get('/usage-trends', analyticsController.getUsageTrends);

// Get cost breakdown
router.get('/cost-breakdown', analyticsController.getCostBreakdown);

// Get usage by line
router.get('/usage-by-line', analyticsController.getUsageByLine);

// Get usage anomalies
router.get('/usage-anomalies', analyticsController.getUsageAnomalies);

// Get cost optimization opportunities
router.get('/cost-optimization', analyticsController.getCostOptimizationOpportunities);

// Generate sample cost data
router.post('/generate-sample-cost', analyticsController.generateSampleCostData);

module.exports = router;
