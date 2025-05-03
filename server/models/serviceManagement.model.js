const { pool } = require('../config/db.config');

/**
 * Service Management Model
 * Provides methods for managing telecom services
 */
class ServiceManagement {
  /**
   * Get all services for a user
   * @param {number} userId - User ID
   * @returns {Promise} - Array of services
   */
  static async getAllServices(userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM service_status WHERE user_id = ? ORDER BY name',
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get service by ID
   * @param {number} id - Service ID
   * @returns {Promise} - Service object
   */
  static async getServiceById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM service_status WHERE id = ?', [id]);
      if (rows.length) {
        return rows[0];
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get service by name for a user
   * @param {number} userId - User ID
   * @param {string} name - Service name
   * @returns {Promise} - Service object
   */
  static async getServiceByName(userId, name) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM service_status WHERE user_id = ? AND name = ?',
        [userId, name]
      );
      if (rows.length) {
        return rows[0];
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new service
   * @param {Object} serviceData - Service data
   * @returns {Promise} - Created service
   */
  static async createService(serviceData) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO service_status (name, status, user_id) VALUES (?, ?, ?)',
        [serviceData.name, serviceData.status || 'disabled', serviceData.user_id]
      );

      const [service] = await pool.execute('SELECT * FROM service_status WHERE id = ?', [result.insertId]);
      return service[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update service
   * @param {number} id - Service ID
   * @param {Object} serviceData - Updated service data
   * @returns {Promise} - Updated service
   */
  static async updateService(id, serviceData) {
    try {
      await pool.execute(
        'UPDATE service_status SET status = ? WHERE id = ?',
        [serviceData.status, id]
      );

      const [service] = await pool.execute('SELECT * FROM service_status WHERE id = ?', [id]);
      return service[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete service
   * @param {number} id - Service ID
   * @returns {Promise} - Boolean indicating success
   */
  static async deleteService(id) {
    try {
      const [result] = await pool.execute('DELETE FROM service_status WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Enable service
   * @param {number} id - Service ID
   * @returns {Promise} - Updated service
   */
  static async enableService(id) {
    try {
      await pool.execute(
        'UPDATE service_status SET status = ? WHERE id = ?',
        ['enabled', id]
      );

      const [service] = await pool.execute('SELECT * FROM service_status WHERE id = ?', [id]);
      return service[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Disable service
   * @param {number} id - Service ID
   * @returns {Promise} - Updated service
   */
  static async disableService(id) {
    try {
      await pool.execute(
        'UPDATE service_status SET status = ? WHERE id = ?',
        ['disabled', id]
      );

      const [service] = await pool.execute('SELECT * FROM service_status WHERE id = ?', [id]);
      return service[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get available services
   * @returns {Promise} - Array of available services
   */
  static async getAvailableServices() {
    try {
      return [
        { name: 'Data Roaming', description: 'Use your data plan while traveling abroad' },
        { name: 'International Calling', description: 'Make calls to international numbers' },
        { name: 'SMS Bundles', description: 'Additional SMS packages for your plan' },
        { name: 'Data Sharing', description: 'Share data between multiple lines' },
        { name: 'VoIP Services', description: 'Voice over IP calling features' },
        { name: 'Content Filtering', description: 'Filter content for business compliance' },
        { name: 'Call Forwarding', description: 'Forward calls to another number' },
        { name: 'Voicemail', description: 'Voicemail services for missed calls' },
        { name: 'Conference Calling', description: 'Multi-party conference calls' },
        { name: 'Premium Support', description: '24/7 dedicated support line' }
      ];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Initialize default services for a user
   * @param {number} userId - User ID
   * @returns {Promise} - Array of created services
   */
  static async initializeDefaultServices(userId) {
    try {
      const availableServices = await this.getAvailableServices();
      const createdServices = [];

      for (const service of availableServices) {
        // Check if service already exists
        const existingService = await this.getServiceByName(userId, service.name);
        
        if (!existingService) {
          const newService = await this.createService({
            name: service.name,
            status: 'disabled',
            user_id: userId
          });
          
          createdServices.push(newService);
        }
      }

      return createdServices;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get service usage for a user
   * @param {number} userId - User ID
   * @returns {Promise} - Service usage data
   */
  static async getServiceUsage(userId) {
    try {
      // Get all telecom lines for the user
      const [lines] = await pool.execute(`
        SELECT tl.*, sp.name as plan_name
        FROM telecom_lines tl
        JOIN service_plans sp ON tl.plan_id = sp.id
        WHERE tl.user_id = ?
      `, [userId]);
      
      // Get all services for the user
      const services = await this.getAllServices(userId);
      
      // Get enabled services
      const enabledServices = services.filter(service => service.status === 'enabled');
      
      // Calculate usage data
      const usageData = {
        totalLines: lines.length,
        enabledServices: enabledServices.length,
        serviceBreakdown: enabledServices.map(service => ({
          name: service.name,
          enabledAt: service.last_modified
        })),
        lineDetails: lines.map(line => ({
          id: line.id,
          phoneNumber: line.phone_number,
          assignedTo: line.assigned_to,
          planName: line.plan_name,
          services: enabledServices.map(service => service.name)
        }))
      };
      
      return usageData;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ServiceManagement;
