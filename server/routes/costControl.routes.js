const express = require('express');
const costBreakdownController = require('../controllers/costBreakdown.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const costControlValidation = require('../validations/costControl.validation');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all cost breakdowns
router.get('/breakdowns', costBreakdownController.getAllCostBreakdowns);

// Get cost breakdown by ID
router.get('/breakdowns/:id', validate(costControlValidation.getCostBreakdown), costBreakdownController.getCostBreakdownById);

// Generate cost breakdown for a month
router.post('/breakdowns/:year/:month', validate(costControlValidation.generateCostBreakdown), costBreakdownController.generateForMonth);

// Get cost trends
router.get('/trends', costBreakdownController.getCostTrends);

// Get cost breakdown by category
router.get('/by-category', costBreakdownController.getCostByCategory);

// Get cost breakdown by line
router.get('/by-line', costBreakdownController.getCostByLine);

// Get cost breakdown by department
router.get('/by-department', costBreakdownController.getCostByDepartment);

// Export financial report
router.get('/export', costBreakdownController.exportFinancialReport);

// Get cost optimization recommendations
router.get('/recommendations', costBreakdownController.getOptimizationRecommendations);

module.exports = router;
