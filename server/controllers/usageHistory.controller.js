const UsageHistory = require('../models/usageHistory.model');
const TelecomLine = require('../models/telecomLine.model');
const { pool } = require('../config/db.config');

/**
 * Get usage history for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with usage history
 */
exports.getUserUsageHistory = async (req, res) => {
  try {
    const {
      limit,
      offset,
      lineId,
      startYear,
      startMonth,
      endYear,
      endMonth
    } = req.query;

    const options = {
      limit,
      offset,
      lineId,
      startYear: startYear ? parseInt(startYear) : undefined,
      startMonth,
      endYear: endYear ? parseInt(endYear) : undefined,
      endMonth
    };

    // Get usage history
    const usageHistory = await UsageHistory.findByUserId(req.userId, options);

    res.status(200).json(usageHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get usage history for a specific line
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with usage history
 */
exports.getLineUsageHistory = async (req, res) => {
  try {
    // Check if line exists and belongs to user
    const line = await TelecomLine.findById(req.params.lineId);

    if (!line) {
      return res.status(404).json({ message: 'Telecom line not found!' });
    }

    if (line.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }

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

    // Get usage history
    const usageHistory = await UsageHistory.findByLineId(req.params.lineId, options);

    res.status(200).json(usageHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create usage history record
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with created usage history
 */
exports.createUsageHistory = async (req, res) => {
  try {
    // Check if line exists and belongs to user
    const line = await TelecomLine.findById(req.body.line_id);

    if (!line) {
      return res.status(404).json({ message: 'Telecom line not found!' });
    }

    if (line.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }

    // Check if record already exists for this month/year
    const [existingRows] = await pool.execute(
      'SELECT * FROM usage_history WHERE line_id = ? AND month = ? AND year = ?',
      [req.body.line_id, req.body.month, req.body.year]
    );

    if (existingRows.length > 0) {
      return res.status(400).json({ message: 'Usage history record already exists for this month and year!' });
    }

    // Create usage history record
    const usageHistory = await UsageHistory.create(req.body);

    res.status(201).json(usageHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update usage history record
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated usage history
 */
exports.updateUsageHistory = async (req, res) => {
  try {
    // Get usage history record
    const usageHistory = await UsageHistory.findById(req.params.id);

    if (!usageHistory) {
      return res.status(404).json({ message: 'Usage history record not found!' });
    }

    // Check if line belongs to user
    const line = await TelecomLine.findById(usageHistory.line_id);

    if (!line) {
      return res.status(404).json({ message: 'Telecom line not found!' });
    }

    if (line.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }

    // Update usage history record
    const updatedUsageHistory = await UsageHistory.update(req.params.id, req.body);

    res.status(200).json(updatedUsageHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete usage history record
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success message
 */
exports.deleteUsageHistory = async (req, res) => {
  try {
    // Get usage history record
    const usageHistory = await UsageHistory.findById(req.params.id);

    if (!usageHistory) {
      return res.status(404).json({ message: 'Usage history record not found!' });
    }

    // Check if line belongs to user
    const line = await TelecomLine.findById(usageHistory.line_id);

    if (!line) {
      return res.status(404).json({ message: 'Telecom line not found!' });
    }

    if (line.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }

    // Delete usage history record
    const result = await UsageHistory.delete(req.params.id);

    if (result) {
      res.status(200).json({ message: 'Usage history record deleted successfully!' });
    } else {
      res.status(500).json({ message: 'Failed to delete usage history record!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get aggregated usage data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with aggregated usage data
 */
exports.getAggregatedUsage = async (req, res) => {
  try {
    const {
      groupBy,
      lineId,
      startYear,
      startMonth,
      endYear,
      endMonth
    } = req.query;

    const options = {
      groupBy: groupBy || 'month',
      lineId,
      startYear: startYear ? parseInt(startYear) : undefined,
      startMonth,
      endYear: endYear ? parseInt(endYear) : undefined,
      endMonth
    };

    // Get aggregated usage data
    const aggregatedUsage = await UsageHistory.getAggregatedUsage(req.userId, options);

    res.status(200).json(aggregatedUsage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Generate sample usage history data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with generated usage history
 */
exports.generateSampleData = async (req, res) => {
  try {
    // Check if line exists and belongs to user
    const line = await TelecomLine.findById(req.params.lineId);

    if (!line) {
      return res.status(404).json({ message: 'Telecom line not found!' });
    }

    if (line.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }

    const months = req.query.months ? parseInt(req.query.months) : 6;

    // Generate sample data
    const generatedData = await UsageHistory.generateSampleData(req.params.lineId, months);

    res.status(200).json({
      message: `Generated ${generatedData.length} usage history records.`,
      records: generatedData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
