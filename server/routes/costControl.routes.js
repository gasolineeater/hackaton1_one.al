const express = require('express');
const costControlController = require('../controllers/costControl.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all budgets
router.get('/budgets', costControlController.getAllBudgets);

// Get budget for a specific month and year
router.get('/budgets/:month/:year', costControlController.getBudget);

// Set budget for a specific month and year
router.post('/budgets/:month/:year', costControlController.setBudget);

// Get cost alerts
router.get('/alerts', costControlController.getCostAlerts);

// Get budget alert threshold
router.get('/alert-threshold', costControlController.getBudgetAlertThreshold);

// Set budget alert threshold
router.post('/alert-threshold', costControlController.setBudgetAlertThreshold);

module.exports = router;
