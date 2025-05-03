const TelecomLine = require('../models/telecomLine.model');
const ServicePlan = require('../models/servicePlan.model');

/**
 * Get all telecom lines for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with telecom lines
 */
exports.getAllLines = async (req, res) => {
  try {
    const { limit, offset, search, status } = req.query;
    const options = { limit, offset, search, status };
    
    // Get telecom lines
    const lines = await TelecomLine.findAllByUser(req.userId, options);
    
    // Get total count for pagination
    const totalCount = await TelecomLine.getTotalCount(req.userId, { search, status });
    
    res.status(200).json({
      lines,
      totalCount,
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get telecom line by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with telecom line
 */
exports.getLineById = async (req, res) => {
  try {
    const line = await TelecomLine.findById(req.params.id);
    
    if (!line) {
      return res.status(404).json({ message: 'Telecom line not found!' });
    }
    
    // Check if the line belongs to the user
    if (line.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }
    
    res.status(200).json(line);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new telecom line
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with created telecom line
 */
exports.createLine = async (req, res) => {
  try {
    // Check if phone number already exists
    const existingLine = await TelecomLine.findByPhoneNumber(req.body.phone_number);
    if (existingLine) {
      return res.status(400).json({ message: 'Phone number already exists!' });
    }
    
    // Check if plan exists
    const plan = await ServicePlan.findById(req.body.plan_id);
    if (!plan) {
      return res.status(404).json({ message: 'Service plan not found!' });
    }
    
    // Create new telecom line
    const newLine = {
      phone_number: req.body.phone_number,
      assigned_to: req.body.assigned_to,
      plan_id: req.body.plan_id,
      monthly_limit: req.body.monthly_limit || plan.data_limit,
      current_usage: req.body.current_usage || 0,
      status: req.body.status || 'active',
      user_id: req.userId
    };
    
    const line = await TelecomLine.create(newLine);
    
    res.status(201).json(line);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update telecom line
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated telecom line
 */
exports.updateLine = async (req, res) => {
  try {
    // Check if line exists
    const line = await TelecomLine.findById(req.params.id);
    if (!line) {
      return res.status(404).json({ message: 'Telecom line not found!' });
    }
    
    // Check if the line belongs to the user
    if (line.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }
    
    // Check if phone number already exists (if changing phone number)
    if (req.body.phone_number && req.body.phone_number !== line.phone_number) {
      const existingLine = await TelecomLine.findByPhoneNumber(req.body.phone_number);
      if (existingLine) {
        return res.status(400).json({ message: 'Phone number already exists!' });
      }
    }
    
    // Check if plan exists (if changing plan)
    if (req.body.plan_id && req.body.plan_id !== line.plan_id) {
      const plan = await ServicePlan.findById(req.body.plan_id);
      if (!plan) {
        return res.status(404).json({ message: 'Service plan not found!' });
      }
    }
    
    // Update telecom line
    const updatedLine = await TelecomLine.update(req.params.id, req.body);
    
    res.status(200).json(updatedLine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete telecom line
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success message
 */
exports.deleteLine = async (req, res) => {
  try {
    // Check if line exists
    const line = await TelecomLine.findById(req.params.id);
    if (!line) {
      return res.status(404).json({ message: 'Telecom line not found!' });
    }
    
    // Check if the line belongs to the user
    if (line.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }
    
    // Delete telecom line
    const result = await TelecomLine.delete(req.params.id);
    
    if (result) {
      res.status(200).json({ message: 'Telecom line deleted successfully!' });
    } else {
      res.status(500).json({ message: 'Failed to delete telecom line!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all service plans
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with service plans
 */
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await ServicePlan.findAll();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get service plan by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with service plan
 */
exports.getPlanById = async (req, res) => {
  try {
    const plan = await ServicePlan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ message: 'Service plan not found!' });
    }
    
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
