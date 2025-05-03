/**
 * Budget Routes
 * Handles budget management endpoints
 */

const express = require('express');
const budgetController = require('../controllers/budget.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const budgetValidation = require('../validations/budget.validation');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Check budget thresholds
router.get('/check/thresholds', validate(budgetValidation.checkThresholds), budgetController.checkThresholds);

// Get spending summary
router.get('/summary/spending', validate(budgetValidation.getSpendingSummary), budgetController.getSpendingSummary);

// Get all budgets
router.get('/', validate(budgetValidation.getAllBudgets), budgetController.getAllBudgets);

// Create a new budget
router.post('/', validate(budgetValidation.createBudget), budgetController.createBudget);

// Get budget by ID
router.get('/:id', validate(budgetValidation.getBudget), budgetController.getBudgetById);

// Update budget
router.put('/:id', validate(budgetValidation.updateBudget), budgetController.updateBudget);

// Delete budget
router.delete('/:id', validate(budgetValidation.deleteBudget), budgetController.deleteBudget);

module.exports = router;
