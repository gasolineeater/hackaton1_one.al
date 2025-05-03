const express = require('express');
const telecomController = require('../controllers/telecom.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Telecom lines routes
router.get('/lines', telecomController.getAllLines);
router.get('/lines/:id', telecomController.getLineById);
router.post('/lines', telecomController.createLine);
router.put('/lines/:id', telecomController.updateLine);
router.delete('/lines/:id', telecomController.deleteLine);

// Service plans routes
router.get('/plans', telecomController.getAllPlans);
router.get('/plans/:id', telecomController.getPlanById);

module.exports = router;
