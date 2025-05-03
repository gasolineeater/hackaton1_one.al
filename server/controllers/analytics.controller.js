const Analytics = require('../models/analytics.model');

/**
 * Get usage trends for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with usage trend data
 */
exports.getUsageTrends = async (req, res) => {
  try {
    const { 
      period, 
      groupBy, 
      startYear, 
      startMonth, 
      endYear, 
      endMonth 
    } = req.query;
    
    const options = { 
      period,
      groupBy,
      startYear: startYear ? parseInt(startYear) : undefined,
      startMonth,
      endYear: endYear ? parseInt(endYear) : undefined,
      endMonth
    };
    
    // Get usage trends
    const trends = await Analytics.getUsageTrends(req.userId, options);
    
    res.status(200).json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get cost breakdown for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with cost breakdown data
 */
exports.getCostBreakdown = async (req, res) => {
  try {
    const { 
      period, 
      startYear, 
      startMonth, 
      endYear, 
      endMonth 
    } = req.query;
    
    const options = { 
      period,
      startYear: startYear ? parseInt(startYear) : undefined,
      startMonth,
      endYear: endYear ? parseInt(endYear) : undefined,
      endMonth
    };
    
    // Get cost breakdown
    const costBreakdown = await Analytics.getCostBreakdown(req.userId, options);
    
    res.status(200).json(costBreakdown);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get usage by line for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with usage by line data
 */
exports.getUsageByLine = async (req, res) => {
  try {
    const { 
      period, 
      startYear, 
      startMonth, 
      endYear, 
      endMonth 
    } = req.query;
    
    const options = { 
      period,
      startYear: startYear ? parseInt(startYear) : undefined,
      startMonth,
      endYear: endYear ? parseInt(endYear) : undefined,
      endMonth
    };
    
    // Get usage by line
    const usageByLine = await Analytics.getUsageByLine(req.userId, options);
    
    res.status(200).json(usageByLine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get usage anomalies for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with usage anomalies data
 */
exports.getUsageAnomalies = async (req, res) => {
  try {
    const { threshold } = req.query;
    
    const options = { 
      threshold: threshold ? parseFloat(threshold) : undefined
    };
    
    // Get usage anomalies
    const anomalies = await Analytics.getUsageAnomalies(req.userId, options);
    
    res.status(200).json(anomalies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get cost optimization opportunities for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with cost optimization opportunities
 */
exports.getCostOptimizationOpportunities = async (req, res) => {
  try {
    // Get cost optimization opportunities
    const opportunities = await Analytics.getCostOptimizationOpportunities(req.userId);
    
    res.status(200).json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Generate sample cost breakdown data for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with generated cost breakdown data
 */
exports.generateSampleCostData = async (req, res) => {
  try {
    const months = req.query.months ? parseInt(req.query.months) : 6;
    
    // Generate sample cost data
    const generatedData = await Analytics.generateSampleCostData(req.userId, months);
    
    res.status(200).json({
      message: `Generated ${generatedData.length} cost breakdown records.`,
      records: generatedData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
