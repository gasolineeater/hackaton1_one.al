const express = require('express');
const serviceManagementController = require('../controllers/serviceManagement.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all services
router.get('/', serviceManagementController.getAllServices);

// Get available services
router.get('/available', serviceManagementController.getAvailableServices);

// Initialize default services
router.post('/initialize', serviceManagementController.initializeDefaultServices);

// Get service usage
router.get('/usage', serviceManagementController.getServiceUsage);

// Get service by ID
router.get('/:id', serviceManagementController.getServiceById);

// Create a new service
router.post('/', serviceManagementController.createService);

// Update service
router.put('/:id', serviceManagementController.updateService);

// Delete service
router.delete('/:id', serviceManagementController.deleteService);

// Enable service
router.put('/:id/enable', serviceManagementController.enableService);

// Disable service
router.put('/:id/disable', serviceManagementController.disableService);

module.exports = router;
