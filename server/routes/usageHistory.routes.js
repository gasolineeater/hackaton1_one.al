const express = require('express');
const usageHistoryController = require('../controllers/usageHistory.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get usage history for a user
router.get('/', usageHistoryController.getUserUsageHistory);

// Get usage history for a specific line
router.get('/line/:lineId', usageHistoryController.getLineUsageHistory);

// Create usage history record
router.post('/', usageHistoryController.createUsageHistory);

// Update usage history record
router.put('/:id', usageHistoryController.updateUsageHistory);

// Delete usage history record
router.delete('/:id', usageHistoryController.deleteUsageHistory);

// Get aggregated usage data
router.get('/aggregated', usageHistoryController.getAggregatedUsage);

// Generate sample usage history data
router.post('/generate/:lineId', usageHistoryController.generateSampleData);

module.exports = router;
