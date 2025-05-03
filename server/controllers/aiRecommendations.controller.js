const AIRecommendation = require('../models/aiRecommendation.model');
const logger = require('../utils/logger');
const apiResponse = require('../utils/apiResponse');

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

    return apiResponse.success(res, {
      recommendations,
      totalCount,
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null
    });
  } catch (error) {
    logger.error('Error getting AI recommendations:', error);
    return apiResponse.error(res, error.message);
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
      return apiResponse.notFound(res, 'AI recommendation not found!');
    }

    // Check if the recommendation belongs to the user
    if (recommendation.user_id !== req.userId) {
      return apiResponse.forbidden(res, 'Access denied!');
    }

    return apiResponse.success(res, { recommendation });
  } catch (error) {
    logger.error('Error getting AI recommendation by ID:', error);
    return apiResponse.error(res, error.message);
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
      return apiResponse.notFound(res, 'AI recommendation not found!');
    }

    // Check if the recommendation belongs to the user
    if (recommendation.user_id !== req.userId) {
      return apiResponse.forbidden(res, 'Access denied!');
    }

    // Update recommendation to mark as applied
    const updatedRecommendation = await AIRecommendation.update(req.params.id, { is_applied: true });

    return apiResponse.success(res, { recommendation: updatedRecommendation }, 'Recommendation applied successfully');
  } catch (error) {
    logger.error('Error applying AI recommendation:', error);
    return apiResponse.error(res, error.message);
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
      return apiResponse.notFound(res, 'AI recommendation not found!');
    }

    // Check if the recommendation belongs to the user
    if (recommendation.user_id !== req.userId) {
      return apiResponse.forbidden(res, 'Access denied!');
    }

    // Delete recommendation
    const result = await AIRecommendation.delete(req.params.id);

    if (result) {
      return apiResponse.success(res, null, 'AI recommendation dismissed successfully!');
    } else {
      return apiResponse.error(res, 'Failed to dismiss AI recommendation!', 500);
    }
  } catch (error) {
    logger.error('Error dismissing AI recommendation:', error);
    return apiResponse.error(res, error.message);
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

    return apiResponse.success(res, {
      recommendations,
      count: recommendations.length
    }, `Generated ${recommendations.length} new recommendations.`);
  } catch (error) {
    logger.error('Error generating AI recommendations:', error);
    return apiResponse.error(res, error.message);
  }
};
