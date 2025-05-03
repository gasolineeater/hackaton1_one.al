/**
 * Cost Breakdown Controller
 * Handles cost analytics and reporting endpoints
 */

const CostBreakdown = require('../models/costBreakdown.model');
const logger = require('../utils/logger');
const apiResponse = require('../utils/apiResponse');
const path = require('path');
const fs = require('fs');

/**
 * Get all cost breakdowns for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with cost breakdowns
 */
exports.getAllCostBreakdowns = async (req, res) => {
  try {
    const options = {
      year: req.query.year,
      month: req.query.month,
      limit: req.query.limit,
      offset: req.query.offset
    };

    const costBreakdowns = await CostBreakdown.findAllByUser(req.userId, options);
    
    return apiResponse.success(res, { costBreakdowns });
  } catch (error) {
    logger.error('Error getting cost breakdowns:', error);
    return apiResponse.error(res, error.message);
  }
};

/**
 * Get cost breakdown by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with cost breakdown
 */
exports.getCostBreakdownById = async (req, res) => {
  try {
    const costBreakdown = await CostBreakdown.findById(req.params.id);
    
    if (!costBreakdown) {
      return apiResponse.notFound(res, 'Cost breakdown not found');
    }
    
    // Check if cost breakdown belongs to user
    if (costBreakdown.user_id !== req.userId) {
      return apiResponse.forbidden(res, 'Access denied');
    }
    
    return apiResponse.success(res, { costBreakdown });
  } catch (error) {
    logger.error('Error getting cost breakdown:', error);
    return apiResponse.error(res, error.message);
  }
};

/**
 * Generate cost breakdown for a month
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with generated cost breakdown
 */
exports.generateForMonth = async (req, res) => {
  try {
    const month = parseInt(req.params.month);
    const year = parseInt(req.params.year);
    
    // Validate month and year
    if (isNaN(month) || month < 1 || month > 12) {
      return apiResponse.badRequest(res, 'Invalid month');
    }
    
    if (isNaN(year) || year < 2000 || year > 2100) {
      return apiResponse.badRequest(res, 'Invalid year');
    }
    
    // Generate cost breakdown
    const costBreakdown = await CostBreakdown.generateForMonth(req.userId, month, year);
    
    return apiResponse.success(res, { costBreakdown }, 'Cost breakdown generated successfully');
  } catch (error) {
    logger.error('Error generating cost breakdown:', error);
    return apiResponse.error(res, error.message);
  }
};

/**
 * Get cost trends
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with cost trends
 */
exports.getCostTrends = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 12;
    
    // Validate months
    if (isNaN(months) || months < 1 || months > 36) {
      return apiResponse.badRequest(res, 'Invalid months parameter (1-36)');
    }
    
    // Get cost trends
    const trends = await CostBreakdown.getCostTrends(req.userId, months);
    
    return apiResponse.success(res, { trends });
  } catch (error) {
    logger.error('Error getting cost trends:', error);
    return apiResponse.error(res, error.message);
  }
};

/**
 * Get cost breakdown by category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with cost breakdown by category
 */
exports.getCostByCategory = async (req, res) => {
  try {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
    
    // Default to current month if not specified
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    const targetMonth = isNaN(month) ? currentMonth : month;
    const targetYear = isNaN(year) ? currentYear : year;
    
    // Get cost breakdown by category
    const breakdown = await CostBreakdown.getCostByCategory(req.userId, targetMonth, targetYear);
    
    return apiResponse.success(res, { breakdown });
  } catch (error) {
    logger.error('Error getting cost by category:', error);
    return apiResponse.error(res, error.message);
  }
};

/**
 * Get cost breakdown by line
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with cost breakdown by line
 */
exports.getCostByLine = async (req, res) => {
  try {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
    
    // Default to current month if not specified
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    const targetMonth = isNaN(month) ? currentMonth : month;
    const targetYear = isNaN(year) ? currentYear : year;
    
    // Get cost breakdown by line
    const breakdown = await CostBreakdown.getCostByLine(req.userId, targetMonth, targetYear);
    
    return apiResponse.success(res, { breakdown });
  } catch (error) {
    logger.error('Error getting cost by line:', error);
    return apiResponse.error(res, error.message);
  }
};

/**
 * Get cost breakdown by department
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with cost breakdown by department
 */
exports.getCostByDepartment = async (req, res) => {
  try {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
    
    // Default to current month if not specified
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    const targetMonth = isNaN(month) ? currentMonth : month;
    const targetYear = isNaN(year) ? currentYear : year;
    
    // Get cost breakdown by department
    const breakdown = await CostBreakdown.getCostByDepartment(req.userId, targetMonth, targetYear);
    
    return apiResponse.success(res, { breakdown });
  } catch (error) {
    logger.error('Error getting cost by department:', error);
    return apiResponse.error(res, error.message);
  }
};

/**
 * Export financial report
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with download link or file
 */
exports.exportFinancialReport = async (req, res) => {
  try {
    const format = req.query.format || 'csv';
    const type = req.query.type || 'monthly';
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year) || new Date().getFullYear();
    
    // Validate format
    if (!['csv', 'json'].includes(format)) {
      return apiResponse.badRequest(res, 'Invalid format (csv or json)');
    }
    
    // Validate type
    if (!['monthly', 'line', 'department'].includes(type)) {
      return apiResponse.badRequest(res, 'Invalid type (monthly, line, or department)');
    }
    
    // Validate month for line and department reports
    if (['line', 'department'].includes(type) && (isNaN(month) || month < 1 || month > 12)) {
      return apiResponse.badRequest(res, 'Month is required for line and department reports');
    }
    
    // Export report
    const filePath = await CostBreakdown.exportFinancialReport(req.userId, format, {
      type,
      month,
      year
    });
    
    // Send file
    res.download(filePath, path.basename(filePath), (err) => {
      if (err) {
        logger.error('Error sending file:', err);
        return apiResponse.error(res, 'Error sending file');
      }
      
      // Delete file after sending
      setTimeout(() => {
        fs.unlink(filePath, (err) => {
          if (err) {
            logger.error('Error deleting file:', err);
          }
        });
      }, 60000); // Delete after 1 minute
    });
  } catch (error) {
    logger.error('Error exporting financial report:', error);
    return apiResponse.error(res, error.message);
  }
};

/**
 * Get cost optimization recommendations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with recommendations
 */
exports.getOptimizationRecommendations = async (req, res) => {
  try {
    // Get recommendations
    const recommendations = await CostBreakdown.getOptimizationRecommendations(req.userId);
    
    return apiResponse.success(res, { recommendations });
  } catch (error) {
    logger.error('Error getting optimization recommendations:', error);
    return apiResponse.error(res, error.message);
  }
};
