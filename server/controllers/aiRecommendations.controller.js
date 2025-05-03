const AIRecommendation = require('../models/aiRecommendation.model');

/**
 * Get all AI recommendations for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with AI recommendations
 */
exports.getAllRecommendations = async (req, res) => {
  try {
    const { limit, offset, priority, applied } = req.query;
    const options = { 
      limit, 
      offset, 
      priority,
      applied: applied !== undefined ? applied === 'true' : undefined
    };
    
    // Get AI recommendations
    const recommendations = await AIRecommendation.findAllByUser(req.userId, options);
    
    // Get total count for pagination
    const totalCount = await AIRecommendation.getTotalCount(req.userId, { priority, applied: options.applied });
    
    res.status(200).json({
      recommendations,
      totalCount,
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get AI recommendation by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with AI recommendation
 */
exports.getRecommendationById = async (req, res) => {
  try {
    const recommendation = await AIRecommendation.findById(req.params.id);
    
    if (!recommendation) {
      return res.status(404).json({ message: 'AI recommendation not found!' });
    }
    
    // Check if the recommendation belongs to the user
    if (recommendation.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }
    
    res.status(200).json(recommendation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Apply AI recommendation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated AI recommendation
 */
exports.applyRecommendation = async (req, res) => {
  try {
    const recommendation = await AIRecommendation.findById(req.params.id);
    
    if (!recommendation) {
      return res.status(404).json({ message: 'AI recommendation not found!' });
    }
    
    // Check if the recommendation belongs to the user
    if (recommendation.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }
    
    // Update recommendation to mark as applied
    const updatedRecommendation = await AIRecommendation.update(req.params.id, { is_applied: true });
    
    res.status(200).json(updatedRecommendation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Dismiss AI recommendation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success message
 */
exports.dismissRecommendation = async (req, res) => {
  try {
    const recommendation = await AIRecommendation.findById(req.params.id);
    
    if (!recommendation) {
      return res.status(404).json({ message: 'AI recommendation not found!' });
    }
    
    // Check if the recommendation belongs to the user
    if (recommendation.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }
    
    // Delete recommendation
    const result = await AIRecommendation.delete(req.params.id);
    
    if (result) {
      res.status(200).json({ message: 'AI recommendation dismissed successfully!' });
    } else {
      res.status(500).json({ message: 'Failed to dismiss AI recommendation!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Generate new AI recommendations for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with generated recommendations
 */
exports.generateRecommendations = async (req, res) => {
  try {
    // Generate recommendations based on user data
    const recommendations = await AIRecommendation.generateRecommendations(req.userId);
    
    res.status(200).json({
      message: `Generated ${recommendations.length} new recommendations.`,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
