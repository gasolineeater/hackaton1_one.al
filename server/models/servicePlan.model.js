const { pool } = require('../config/db.config');

/**
 * Service Plan Model
 */
class ServicePlan {
  constructor(plan) {
    this.id = plan.id;
    this.name = plan.name;
    this.data_limit = plan.data_limit;
    this.calls = plan.calls;
    this.sms = plan.sms;
    this.price = plan.price;
    this.created_at = plan.created_at;
    this.updated_at = plan.updated_at;
  }

  /**
   * Create a new service plan
   * @param {Object} newPlan - Service plan object
   * @returns {Promise} - Created service plan
   */
  static async create(newPlan) {
    try {
      const connection = await pool.getConnection();
      
      try {
        await connection.beginTransaction();
        
        // Insert service plan
        const [result] = await connection.execute(
          'INSERT INTO service_plans (name, data_limit, calls, sms, price) VALUES (?, ?, ?, ?, ?)',
          [newPlan.name, newPlan.data_limit, newPlan.calls, newPlan.sms, newPlan.price]
        );
        
        const planId = result.insertId;
        
        // Insert plan features if provided
        if (newPlan.features && newPlan.features.length > 0) {
          for (const feature of newPlan.features) {
            await connection.execute(
              'INSERT INTO plan_features (plan_id, feature) VALUES (?, ?)',
              [planId, feature]
            );
          }
        }
        
        await connection.commit();
        
        // Get the created plan with features
        const plan = await this.findById(planId);
        return plan;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find service plan by ID
   * @param {number} id - Service plan ID
   * @returns {Promise} - Service plan object with features
   */
  static async findById(id) {
    try {
      // Get plan details
      const [planRows] = await pool.execute('SELECT * FROM service_plans WHERE id = ?', [id]);
      
      if (!planRows.length) {
        return null;
      }
      
      const plan = planRows[0];
      
      // Get plan features
      const [featureRows] = await pool.execute(
        'SELECT feature FROM plan_features WHERE plan_id = ?',
        [id]
      );
      
      // Add features to plan object
      plan.features = featureRows.map(row => row.feature);
      
      return plan;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all service plans
   * @returns {Promise} - Array of service plans with features
   */
  static async findAll() {
    try {
      // Get all plans
      const [planRows] = await pool.execute('SELECT * FROM service_plans ORDER BY price ASC');
      
      // Get features for all plans
      const plans = [];
      
      for (const plan of planRows) {
        const [featureRows] = await pool.execute(
          'SELECT feature FROM plan_features WHERE plan_id = ?',
          [plan.id]
        );
        
        plan.features = featureRows.map(row => row.feature);
        plans.push(plan);
      }
      
      return plans;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update service plan
   * @param {number} id - Service plan ID
   * @param {Object} plan - Service plan object with updated fields
   * @returns {Promise} - Updated service plan
   */
  static async update(id, plan) {
    try {
      const connection = await pool.getConnection();
      
      try {
        await connection.beginTransaction();
        
        // Update plan details
        let query = 'UPDATE service_plans SET ';
        const values = [];
        const fields = [];

        if (plan.name) {
          fields.push('name = ?');
          values.push(plan.name);
        }

        if (plan.data_limit) {
          fields.push('data_limit = ?');
          values.push(plan.data_limit);
        }

        if (plan.calls) {
          fields.push('calls = ?');
          values.push(plan.calls);
        }

        if (plan.sms) {
          fields.push('sms = ?');
          values.push(plan.sms);
        }

        if (plan.price) {
          fields.push('price = ?');
          values.push(plan.price);
        }

        if (fields.length > 0) {
          query += fields.join(', ');
          query += ' WHERE id = ?';
          values.push(id);

          await connection.execute(query, values);
        }
        
        // Update features if provided
        if (plan.features) {
          // Delete existing features
          await connection.execute('DELETE FROM plan_features WHERE plan_id = ?', [id]);
          
          // Insert new features
          for (const feature of plan.features) {
            await connection.execute(
              'INSERT INTO plan_features (plan_id, feature) VALUES (?, ?)',
              [id, feature]
            );
          }
        }
        
        await connection.commit();
        
        // Get the updated plan
        const updatedPlan = await this.findById(id);
        return updatedPlan;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete service plan
   * @param {number} id - Service plan ID
   * @returns {Promise} - Boolean indicating success
   */
  static async delete(id) {
    try {
      const connection = await pool.getConnection();
      
      try {
        await connection.beginTransaction();
        
        // Delete plan features
        await connection.execute('DELETE FROM plan_features WHERE plan_id = ?', [id]);
        
        // Delete plan
        const [result] = await connection.execute('DELETE FROM service_plans WHERE id = ?', [id]);
        
        await connection.commit();
        
        return result.affectedRows > 0;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ServicePlan;
