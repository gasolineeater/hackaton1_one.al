/**
 * Service Management validation schemas
 */

const Joi = require('joi');

// Create service validation schema
const createService = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(100),
    status: Joi.string().valid('enabled', 'disabled').default('disabled')
  })
};

// Update service validation schema
const updateService = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  }),
  body: Joi.object().keys({
    status: Joi.string().valid('enabled', 'disabled').required()
  })
};

// Get service by ID validation schema
const getService = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  })
};

// Delete service validation schema
const deleteService = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  })
};

// Enable service validation schema
const enableService = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  })
};

// Disable service validation schema
const disableService = {
  params: Joi.object().keys({
    id: Joi.number().integer().required()
  })
};

module.exports = {
  createService,
  updateService,
  getService,
  deleteService,
  enableService,
  disableService
};
