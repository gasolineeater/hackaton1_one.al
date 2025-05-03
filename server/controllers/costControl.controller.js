const CostControl = require('../models/costControl.model');

/**
 * Get budget for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with budget data
 */
exports.getBudget = async (req, res) => {
  try {
    const { month, year } = req.params;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required!' });
    }
    
    // Get budget
    const budget = await CostControl.getBudget(req.userId, month, year);
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found for the specified month and year!' });
    }
    
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Set budget for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated budget data
 */
exports.setBudget = async (req, res) => {
  try {
    const { month, year } = req.params;
    
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required!' });
    }
    
    // Set budget
    const budget = await CostControl.setBudget(req.userId, month, year, req.body);
    
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all budgets for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with budget data
 */
exports.getAllBudgets = async (req, res) => {
  try {
    const { 
      limit, 
      offset, 
      startYear, 
      startMonth, 
      endYear, 
      endMonth 
    } = req.query;
    
    const options = { 
      limit, 
      offset,
      startYear: startYear ? parseInt(startYear) : undefined,
      startMonth,
      endYear: endYear ? parseInt(endYear) : undefined,
      endMonth
    };
    
    // Get all budgets
    const budgets = await CostControl.getAllBudgets(req.userId, options);
    
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get cost alerts for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with cost alerts
 */
exports.getCostAlerts = async (req, res) => {
  try {
    // Get cost alerts
    const alerts = await CostControl.getCostAlerts(req.userId);
    
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Set budget alert threshold for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated user settings
 */
exports.setBudgetAlertThreshold = async (req, res) => {
  try {
    const { threshold } = req.body;
    
    if (threshold === undefined || threshold < 0 || threshold > 100) {
      return res.status(400).json({ message: 'Valid threshold percentage (0-100) is required!' });
    }
    
    // Set budget alert threshold
    const settings = await CostControl.setBudgetAlertThreshold(req.userId, threshold);
    
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get budget alert threshold for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with alert threshold
 */
exports.getBudgetAlertThreshold = async (req, res) => {
  try {
    // Get budget alert threshold
    const threshold = await CostControl.getBudgetAlertThreshold(req.userId);
    
    res.status(200).json({ threshold });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
