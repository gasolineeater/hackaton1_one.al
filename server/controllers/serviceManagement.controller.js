const ServiceManagement = require('../models/serviceManagement.model');
const Notification = require('../models/notification.model');

/**
 * Get all services for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with services
 */
exports.getAllServices = async (req, res) => {
  try {
    // Get services
    const services = await ServiceManagement.getAllServices(req.userId);
    
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get service by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with service
 */
exports.getServiceById = async (req, res) => {
  try {
    const service = await ServiceManagement.getServiceById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found!' });
    }
    
    // Check if the service belongs to the user
    if (service.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }
    
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new service
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with created service
 */
exports.createService = async (req, res) => {
  try {
    // Check if service already exists
    const existingService = await ServiceManagement.getServiceByName(req.userId, req.body.name);
    
    if (existingService) {
      return res.status(400).json({ message: 'Service already exists!' });
    }
    
    // Create service
    const service = await ServiceManagement.createService({
      name: req.body.name,
      status: req.body.status || 'disabled',
      user_id: req.userId
    });
    
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update service
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated service
 */
exports.updateService = async (req, res) => {
  try {
    const service = await ServiceManagement.getServiceById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found!' });
    }
    
    // Check if the service belongs to the user
    if (service.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }
    
    // Update service
    const updatedService = await ServiceManagement.updateService(req.params.id, {
      status: req.body.status
    });
    
    // Create notification for service update
    await Notification.createSystemNotification(
      req.userId,
      'Service Update',
      `${service.name} service has been ${req.body.status === 'enabled' ? 'enabled' : 'disabled'}.`,
      'success'
    );
    
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete service
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with success message
 */
exports.deleteService = async (req, res) => {
  try {
    const service = await ServiceManagement.getServiceById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found!' });
    }
    
    // Check if the service belongs to the user
    if (service.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }
    
    // Delete service
    const result = await ServiceManagement.deleteService(req.params.id);
    
    if (result) {
      res.status(200).json({ message: 'Service deleted successfully!' });
    } else {
      res.status(500).json({ message: 'Failed to delete service!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Enable service
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated service
 */
exports.enableService = async (req, res) => {
  try {
    const service = await ServiceManagement.getServiceById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found!' });
    }
    
    // Check if the service belongs to the user
    if (service.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }
    
    // Enable service
    const updatedService = await ServiceManagement.enableService(req.params.id);
    
    // Create notification for service update
    await Notification.createSystemNotification(
      req.userId,
      'Service Enabled',
      `${service.name} service has been enabled.`,
      'success'
    );
    
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Disable service
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with updated service
 */
exports.disableService = async (req, res) => {
  try {
    const service = await ServiceManagement.getServiceById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found!' });
    }
    
    // Check if the service belongs to the user
    if (service.user_id !== req.userId) {
      return res.status(403).json({ message: 'Access denied!' });
    }
    
    // Disable service
    const updatedService = await ServiceManagement.disableService(req.params.id);
    
    // Create notification for service update
    await Notification.createSystemNotification(
      req.userId,
      'Service Disabled',
      `${service.name} service has been disabled.`,
      'info'
    );
    
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get available services
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with available services
 */
exports.getAvailableServices = async (req, res) => {
  try {
    // Get available services
    const services = await ServiceManagement.getAvailableServices();
    
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Initialize default services for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with created services
 */
exports.initializeDefaultServices = async (req, res) => {
  try {
    // Initialize default services
    const services = await ServiceManagement.initializeDefaultServices(req.userId);
    
    res.status(200).json({
      message: `Initialized ${services.length} default services.`,
      services
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get service usage for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Response with service usage data
 */
exports.getServiceUsage = async (req, res) => {
  try {
    // Get service usage
    const usageData = await ServiceManagement.getServiceUsage(req.userId);
    
    res.status(200).json(usageData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
