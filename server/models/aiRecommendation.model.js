const { pool } = require('../config/db.config');

/**
 * AI Recommendation Model
 */
class AIRecommendation {
  constructor(recommendation) {
    this.id = recommendation.id;
    this.title = recommendation.title;
    this.description = recommendation.description;
    this.savings_amount = recommendation.savings_amount;
    this.priority = recommendation.priority || 'medium';
    this.user_id = recommendation.user_id;
    this.is_applied = recommendation.is_applied || false;
    this.created_at = recommendation.created_at;
    this.updated_at = recommendation.updated_at;
  }

  /**
   * Create a new AI recommendation
   * @param {Object} newRecommendation - AI recommendation object
   * @returns {Promise} - Created AI recommendation
   */
  static async create(newRecommendation) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO ai_recommendations (title, description, savings_amount, priority, user_id, is_applied) VALUES (?, ?, ?, ?, ?, ?)',
        [
          newRecommendation.title,
          newRecommendation.description,
          newRecommendation.savings_amount,
          newRecommendation.priority || 'medium',
          newRecommendation.user_id,
          newRecommendation.is_applied || false
        ]
      );

      const [recommendation] = await pool.execute('SELECT * FROM ai_recommendations WHERE id = ?', [result.insertId]);
      return recommendation[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find AI recommendation by ID
   * @param {number} id - AI recommendation ID
   * @returns {Promise} - AI recommendation object
   */
  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM ai_recommendations WHERE id = ?', [id]);
      if (rows.length) {
        return rows[0];
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all AI recommendations for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options (limit, offset, priority, applied)
   * @returns {Promise} - Array of AI recommendations
   */
  static async findAllByUser(userId, options = {}) {
    try {
      let query = 'SELECT * FROM ai_recommendations WHERE user_id = ?';
      const queryParams = [userId];
      
      // Add priority filter if provided
      if (options.priority) {
        query += ' AND priority = ?';
        queryParams.push(options.priority);
      }
      
      // Add applied filter if provided
      if (options.applied !== undefined) {
        query += ' AND is_applied = ?';
        queryParams.push(options.applied ? 1 : 0);
      }
      
      // Add sorting
      query += ' ORDER BY priority = "high" DESC, savings_amount DESC';
      
      // Add pagination
      if (options.limit) {
        query += ' LIMIT ?';
        queryParams.push(parseInt(options.limit));
        
        if (options.offset) {
          query += ' OFFSET ?';
          queryParams.push(parseInt(options.offset));
        }
      }
      
      const [rows] = await pool.execute(query, queryParams);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update AI recommendation
   * @param {number} id - AI recommendation ID
   * @param {Object} recommendation - AI recommendation object with updated fields
   * @returns {Promise} - Updated AI recommendation
   */
  static async update(id, recommendation) {
    try {
      let query = 'UPDATE ai_recommendations SET ';
      const values = [];
      const fields = [];

      if (recommendation.title) {
        fields.push('title = ?');
        values.push(recommendation.title);
      }

      if (recommendation.description) {
        fields.push('description = ?');
        values.push(recommendation.description);
      }

      if (recommendation.savings_amount) {
        fields.push('savings_amount = ?');
        values.push(recommendation.savings_amount);
      }

      if (recommendation.priority) {
        fields.push('priority = ?');
        values.push(recommendation.priority);
      }

      if (recommendation.is_applied !== undefined) {
        fields.push('is_applied = ?');
        values.push(recommendation.is_applied ? 1 : 0);
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      query += fields.join(', ');
      query += ' WHERE id = ?';
      values.push(id);

      await pool.execute(query, values);
      
      const [updatedRecommendation] = await pool.execute('SELECT * FROM ai_recommendations WHERE id = ?', [id]);
      return updatedRecommendation[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete AI recommendation
   * @param {number} id - AI recommendation ID
   * @returns {Promise} - Boolean indicating success
   */
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM ai_recommendations WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get total count of AI recommendations for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options (priority, applied)
   * @returns {Promise} - Count of AI recommendations
   */
  static async getTotalCount(userId, options = {}) {
    try {
      let query = 'SELECT COUNT(*) as count FROM ai_recommendations WHERE user_id = ?';
      const queryParams = [userId];
      
      // Add priority filter if provided
      if (options.priority) {
        query += ' AND priority = ?';
        queryParams.push(options.priority);
      }
      
      // Add applied filter if provided
      if (options.applied !== undefined) {
        query += ' AND is_applied = ?';
        queryParams.push(options.applied ? 1 : 0);
      }
      
      const [rows] = await pool.execute(query, queryParams);
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate recommendations for a user
   * @param {number} userId - User ID
   * @returns {Promise} - Array of generated recommendations
   */
  static async generateRecommendations(userId) {
    try {
      // Get user's telecom lines
      const [lines] = await pool.execute(`
        SELECT tl.*, sp.name as plan_name, sp.data_limit, sp.calls, sp.sms, sp.price
        FROM telecom_lines tl
        JOIN service_plans sp ON tl.plan_id = sp.id
        WHERE tl.user_id = ?
      `, [userId]);
      
      // Get all service plans
      const [plans] = await pool.execute('SELECT * FROM service_plans');
      
      // Get usage history
      const [usageHistory] = await pool.execute(`
        SELECT uh.*
        FROM usage_history uh
        JOIN telecom_lines tl ON uh.line_id = tl.id
        WHERE tl.user_id = ?
        ORDER BY uh.year DESC, uh.month DESC
      `, [userId]);
      
      // Generate recommendations based on data
      const recommendations = [];
      
      // Example: Recommend upgrading plans for lines close to their data limit
      for (const line of lines) {
        // If usage is consistently high (>80% of limit), suggest upgrading
        if (line.current_usage > line.monthly_limit * 0.8) {
          // Find a better plan
          const betterPlan = plans.find(p => 
            p.data_limit > line.monthly_limit && 
            p.price < line.price * 1.5 // Not too expensive
          );
          
          if (betterPlan) {
            const monthlySavings = line.price * 1.2 - betterPlan.price; // Assuming overage charges
            
            if (monthlySavings > 0) {
              recommendations.push({
                title: `Upgrade plan for ${line.phone_number}`,
                description: `Based on usage patterns, upgrading from ${line.plan_name} to ${betterPlan.name} would save money by avoiding overage charges.`,
                savings_amount: monthlySavings,
                priority: monthlySavings > 10 ? 'high' : 'medium',
                user_id: userId,
                is_applied: false
              });
            }
          }
        }
        
        // If usage is consistently low (<30% of limit), suggest downgrading
        if (line.current_usage < line.monthly_limit * 0.3) {
          // Find a more economical plan
          const cheaperPlan = plans.find(p => 
            p.data_limit >= line.current_usage * 1.5 && // Some buffer
            p.price < line.price
          );
          
          if (cheaperPlan) {
            const monthlySavings = line.price - cheaperPlan.price;
            
            recommendations.push({
              title: `Downgrade plan for ${line.phone_number}`,
              description: `Based on low usage patterns, downgrading from ${line.plan_name} to ${cheaperPlan.name} would save €${monthlySavings} per month.`,
              savings_amount: monthlySavings,
              priority: monthlySavings > 10 ? 'high' : 'medium',
              user_id: userId,
              is_applied: false
            });
          }
        }
      }
      
      // Example: Recommend data sharing for multiple lines
      if (lines.length > 1) {
        // Check if some lines have high usage and others low
        const highUsageLines = lines.filter(l => l.current_usage > l.monthly_limit * 0.8);
        const lowUsageLines = lines.filter(l => l.current_usage < l.monthly_limit * 0.3);
        
        if (highUsageLines.length > 0 && lowUsageLines.length > 0) {
          const potentialSavings = 5 * highUsageLines.length; // Estimate savings
          
          recommendations.push({
            title: 'Enable data sharing between lines',
            description: `Some of your lines have excess data while others are close to their limits. Enabling data sharing could optimize usage and save approximately €${potentialSavings} per month.`,
            savings_amount: potentialSavings,
            priority: 'medium',
            user_id: userId,
            is_applied: false
          });
        }
      }
      
      // Save generated recommendations to database
      const savedRecommendations = [];
      
      for (const rec of recommendations) {
        // Check if similar recommendation already exists
        const [existing] = await pool.execute(
          'SELECT * FROM ai_recommendations WHERE user_id = ? AND title LIKE ? AND is_applied = 0',
          [userId, `%${rec.title.substring(0, 10)}%`]
        );
        
        if (existing.length === 0) {
          const saved = await this.create(rec);
          savedRecommendations.push(saved);
        }
      }
      
      return savedRecommendations;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AIRecommendation;
