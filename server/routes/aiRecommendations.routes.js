const express = require('express');
const aiRecommendationsController = require('../controllers/aiRecommendations.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// AI recommendations routes
router.get('/', aiRecommendationsController.getAllRecommendations);
router.get('/:id', aiRecommendationsController.getRecommendationById);
router.post('/generate', aiRecommendationsController.generateRecommendations);
router.put('/:id/apply', aiRecommendationsController.applyRecommendation);
router.delete('/:id', aiRecommendationsController.dismissRecommendation);

module.exports = router;
