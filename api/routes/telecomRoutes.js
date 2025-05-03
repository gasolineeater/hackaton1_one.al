import express from 'express';
import telecomService from '../services/telecomService.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { Subscription } from '../models/index.js';

const router = express.Router();

/**
 * @route GET /api/telecom/usage/:customerId
 * @desc Get customer usage statistics
 * @access Private
 */
router.get('/usage/:customerId', authenticate, async (req, res) => {
  try {
    const { customerId } = req.params;
    const { period, serviceType } = req.query;

    // Check if user has access to this customer
    if (req.user.role !== 'admin' && req.user.customerId !== parseInt(customerId)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this customer\'s data'
      });
    }

    const result = await telecomService.getCustomerUsage(customerId, {
      period,
      serviceType
    });

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }

    res.json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    console.error('Error in usage endpoint:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get usage data',
      error: error.message
    });
  }
});

/**
 * @route GET /api/telecom/usage/realtime/:customerId
 * @desc Get real-time usage for a customer
 * @access Private
 */
router.get('/usage/realtime/:customerId', authenticate, async (req, res) => {
  try {
    const { customerId } = req.params;
    const { serviceType } = req.query;

    // Check if user has access to this customer
    if (req.user.role !== 'admin' && req.user.customerId !== parseInt(customerId)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this customer\'s data'
      });
    }

    const result = await telecomService.getRealTimeUsage(customerId, serviceType);

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }

    res.json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    console.error('Error in real-time usage endpoint:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get real-time usage data',
      error: error.message
    });
  }
});

/**
 * @route POST /api/telecom/services/activate
 * @desc Activate a service for a customer
 * @access Private
 */
router.post('/services/activate', authenticate, async (req, res) => {
  try {
    const { customerId, serviceId, quantity, plan, billingCycle, autoRenew } = req.body;

    // Check if user has access to this customer
    if (req.user.role !== 'admin' && req.user.customerId !== parseInt(customerId)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to manage this customer\'s services'
      });
    }

    const result = await telecomService.activateService(customerId, serviceId, {
      quantity,
      plan,
      billingCycle,
      autoRenew
    });

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Service activated successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Error in activate service endpoint:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to activate service',
      error: error.message
    });
  }
});

/**
 * @route POST /api/telecom/services/deactivate
 * @desc Deactivate a service for a customer
 * @access Private
 */
router.post('/services/deactivate', authenticate, async (req, res) => {
  try {
    const { subscriptionId, reason, immediate } = req.body;

    // Get subscription to check permissions
    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      return res.status(404).json({
        status: 'error',
        message: 'Subscription not found'
      });
    }

    // Check if user has access to this customer
    if (req.user.role !== 'admin' && req.user.customerId !== subscription.customerId) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to manage this subscription'
      });
    }

    const result = await telecomService.deactivateService(subscriptionId, {
      reason,
      immediate
    });

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }

    res.json({
      status: 'success',
      message: 'Service deactivated successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Error in deactivate service endpoint:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to deactivate service',
      error: error.message
    });
  }
});

/**
 * @route POST /api/telecom/services/change-plan
 * @desc Change service plan
 * @access Private
 */
router.post('/services/change-plan', authenticate, async (req, res) => {
  try {
    const { subscriptionId, newPlan, effectiveDate } = req.body;

    // Get subscription to check permissions
    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      return res.status(404).json({
        status: 'error',
        message: 'Subscription not found'
      });
    }

    // Check if user has access to this customer
    if (req.user.role !== 'admin' && req.user.customerId !== subscription.customerId) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to manage this subscription'
      });
    }

    const result = await telecomService.changeServicePlan(subscriptionId, newPlan, {
      effectiveDate
    });

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }

    res.json({
      status: 'success',
      message: 'Service plan changed successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Error in change plan endpoint:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to change service plan',
      error: error.message
    });
  }
});

/**
 * @route GET /api/telecom/plans/:serviceType
 * @desc Get available service plans
 * @access Private
 */
router.get('/plans/:serviceType', authenticate, async (req, res) => {
  try {
    const { serviceType } = req.params;

    const result = await telecomService.getAvailablePlans(serviceType);

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }

    res.json({
      status: 'success',
      data: result.data
    });
  } catch (error) {
    console.error('Error in get plans endpoint:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get available plans',
      error: error.message
    });
  }
});

/**
 * @route POST /api/telecom/sync/:customerId
 * @desc Sync customer data with ONE Albania
 * @access Private (Admin only)
 */
router.post('/sync/:customerId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { customerId } = req.params;

    const result = await telecomService.syncCustomerData(customerId);

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }

    res.json({
      status: 'success',
      message: result.message,
      data: result.data
    });
  } catch (error) {
    console.error('Error in sync endpoint:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to sync customer data',
      error: error.message
    });
  }
});

export default router;
