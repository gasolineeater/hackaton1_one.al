const express = require('express');
const serviceManagementController = require('../controllers/serviceManagement.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const serviceManagementValidation = require('../validations/serviceManagement.validation');

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
router.get('/:id', validate(serviceManagementValidation.getService), serviceManagementController.getServiceById);

// Create a new service
router.post('/', validate(serviceManagementValidation.createService), serviceManagementController.createService);

// Update service
router.put('/:id', validate(serviceManagementValidation.updateService), serviceManagementController.updateService);

// Delete service
router.delete('/:id', validate(serviceManagementValidation.deleteService), serviceManagementController.deleteService);

// Enable service
router.put('/:id/enable', validate(serviceManagementValidation.enableService), serviceManagementController.enableService);

// Disable service
router.put('/:id/disable', validate(serviceManagementValidation.disableService), serviceManagementController.disableService);

module.exports = router;
