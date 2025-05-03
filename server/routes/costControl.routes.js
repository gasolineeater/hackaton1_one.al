const express = require('express');
const costBreakdownController = require('../controllers/costBreakdown.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const costControlValidation = require('../validations/costControl.validation');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all cost breakdowns
router.get('/breakdowns', validate(costControlValidation.getAllCostBreakdowns), costBreakdownController.getAllCostBreakdowns);

// Get cost breakdown by ID
router.get('/breakdowns/:id', validate(costControlValidation.getCostBreakdown), costBreakdownController.getCostBreakdownById);

// Generate cost breakdown for a month
router.post('/breakdowns/:year/:month', validate(costControlValidation.generateCostBreakdown), costBreakdownController.generateForMonth);

// Get cost trends
router.get('/trends', validate(costControlValidation.getCostTrends), costBreakdownController.getCostTrends);

// Get cost breakdown by category
router.get('/by-category', validate(costControlValidation.getCostByCategory), costBreakdownController.getCostByCategory);

// Get cost breakdown by line
router.get('/by-line', validate(costControlValidation.getCostByLine), costBreakdownController.getCostByLine);

// Get cost breakdown by department
router.get('/by-department', validate(costControlValidation.getCostByDepartment), costBreakdownController.getCostByDepartment);

// Export financial report
router.get('/export', validate(costControlValidation.exportFinancialReport), costBreakdownController.exportFinancialReport);

// Get cost optimization recommendations
router.get('/recommendations', validate(costControlValidation.getOptimizationRecommendations), costBreakdownController.getOptimizationRecommendations);

module.exports = router;
