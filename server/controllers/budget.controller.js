/**
 * Budget Controller
 * Handles budget management endpoints
 */

const Budget = require('../models/budget.model');
const Notification = require('../models/notification.model');
const logger = require('../utils/logger');
const apiResponse = require('../utils/apiResponse');

/**
 * Get all budgets for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with budgets
 */
exports.getAllBudgets = async (req, res) => {
  try {
    const options = {
      entityType: req.query.entityType,
      period: req.query.period
    };

    const budgets = await Budget.findAllByUser(req.userId, options);
    
    return apiResponse.success(res, { budgets });
  } catch (error) {
    logger.error('Error getting budgets:', error);
    return apiResponse.error(res, error.message);
  }
};

/**
 * Get budget by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with budget
 */
exports.getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return apiResponse.notFound(res, 'Budget not found');
    }
    
    // Check if budget belongs to user
    if (budget.user_id !== req.userId) {
      return apiResponse.forbidden(res, 'Access denied');
    }
    
    return apiResponse.success(res, { budget });
  } catch (error) {
    logger.error('Error getting budget:', error);
    return apiResponse.error(res, error.message);
  }
};

/**
 * Create a new budget
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with created budget
 */
exports.createBudget = async (req, res) => {
  try {
    // Create budget
    const budgetData = {
      user_id: req.userId,
      entity_type: req.body.entity_type,
      entity_id: req.body.entity_id,
      entity_name: req.body.entity_name,
      amount: req.body.amount,
      period: req.body.period,
      currency: req.body.currency,
      alert_threshold: req.body.alert_threshold,
      start_date: req.body.start_date,
      end_date: req.body.end_date
    };
    
    const budget = await Budget.create(budgetData);
    
    // Create notification
    await Notification.createSystemNotification(
      req.userId,
      'Budget Created',
      `Budget of ${budget.amount} ${budget.currency} created for ${budget.entity_name}`,
      'success'
    );
    
    return apiResponse.success(res, { budget }, 'Budget created successfully', 201);
  } catch (error) {
    logger.error('Error creating budget:', error);
    return apiResponse.error(res, error.message);
  }
};

/**
 * Update budget
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated budget
 */
exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return apiResponse.notFound(res, 'Budget not found');
    }
    
    // Check if budget belongs to user
    if (budget.user_id !== req.userId) {
      return apiResponse.forbidden(res, 'Access denied');
    }
    
    // Update budget
    const updatedBudget = await Budget.update(req.params.id, req.body);
    
    // Create notification
    await Notification.createSystemNotification(
      req.userId,
      'Budget Updated',
      `Budget for ${updatedBudget.entity_name} updated to ${updatedBudget.amount} ${updatedBudget.currency}`,
      'info'
    );
    
    return apiResponse.success(res, { budget: updatedBudget }, 'Budget updated successfully');
  } catch (error) {
    logger.error('Error updating budget:', error);
    return apiResponse.error(res, error.message);
  }
};

/**
 * Delete budget
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success message
 */
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return apiResponse.notFound(res, 'Budget not found');
    }
    
    // Check if budget belongs to user
    if (budget.user_id !== req.userId) {
      return apiResponse.forbidden(res, 'Access denied');
    }
    
    // Delete budget
    await Budget.delete(req.params.id);
    
    // Create notification
    await Notification.createSystemNotification(
      req.userId,
      'Budget Deleted',
      `Budget for ${budget.entity_name} has been deleted`,
      'info'
    );
    
    return apiResponse.success(res, null, 'Budget deleted successfully');
  } catch (error) {
    logger.error('Error deleting budget:', error);
    return apiResponse.error(res, error.message);
  }
};

/**
 * Check budget thresholds
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with exceeded budgets
 */
exports.checkThresholds = async (req, res) => {
  try {
    const exceededBudgets = await Budget.checkThresholds(req.userId);
    
    // Create notifications for exceeded budgets
    for (const item of exceededBudgets) {
      await Notification.createCostAlertNotification(
        req.userId,
        `Budget Alert: ${item.budget.entity_name} has reached ${item.spendingPercentage.toFixed(0)}% of its budget`,
        `Current spending: ${item.currentSpending} ${item.budget.currency} of ${item.budget.amount} ${item.budget.currency} budget`
      );
    }
    
    return apiResponse.success(res, { exceededBudgets });
  } catch (error) {
    logger.error('Error checking thresholds:', error);
    return apiResponse.error(res, error.message);
  }
};

/**
 * Get spending summary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with spending summary
 */
exports.getSpendingSummary = async (req, res) => {
  try {
    const period = req.query.period || 'monthly';
    
    const summary = await Budget.getSpendingSummary(req.userId, period);
    
    return apiResponse.success(res, { summary });
  } catch (error) {
    logger.error('Error getting spending summary:', error);
    return apiResponse.error(res, error.message);
  }
};
