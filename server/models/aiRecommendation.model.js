const { pool } = require('../config/db.config');
const {
  analyzeUsagePatterns,
  detectAnomalies,
  findOptimalPlan,
  identifyDataSharingOpportunities
} = require('../utils/aiAlgorithms');

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

      // Generate recommendations based on data
      const recommendations = [];

      // Process each line for plan optimization recommendations
      for (const line of lines) {
        // Get usage history for this line
        const [lineUsageHistory] = await pool.execute(`
          SELECT * FROM usage_history
          WHERE line_id = ?
          ORDER BY year DESC, month DESC
        `, [line.id]);

        // Find optimal plan using AI algorithm
        const planRecommendation = findOptimalPlan(line, plans, lineUsageHistory);

        if (planRecommendation.hasRecommendation) {
          const { currentPlan, recommendedPlan, savings, reason, priority } = planRecommendation;

          let title, description;

          if (reason === 'underutilization') {
            title = `Downgrade plan for ${line.phone_number}`;
            description = `Based on your usage patterns, downgrading from ${currentPlan.name} to ${recommendedPlan.name} would save €${savings.toFixed(2)} per month while still meeting your needs.`;
          } else if (reason === 'approaching_limit') {
            title = `Upgrade plan for ${line.phone_number}`;
            description = `Your usage is ${line.current_usage > line.monthly_limit ? 'exceeding' : 'approaching'} your current limit. Upgrading from ${currentPlan.name} to ${recommendedPlan.name} would save approximately €${savings.toFixed(2)} per month by avoiding overage charges.`;
          }

          recommendations.push({
            title,
            description,
            savings_amount: savings,
            priority,
            user_id: userId,
            is_applied: false
          });
        }

        // Check for anomalies in usage
        const anomalies = detectAnomalies(lineUsageHistory);

        if (anomalies.length > 0) {
          // Only report significant anomalies
          const significantAnomalies = anomalies.filter(a => a.type === 'high');

          if (significantAnomalies.length > 0) {
            // Sort by deviation (highest first)
            significantAnomalies.sort((a, b) => b.deviation - a.deviation);

            const topAnomaly = significantAnomalies[0];
            const potentialSavings = topAnomaly.deviation * 5; // Estimate savings

            recommendations.push({
              title: `Unusual data usage detected for ${line.phone_number}`,
              description: `We detected unusually high data usage in ${topAnomaly.month} ${topAnomaly.year}. Investigating this could save approximately €${potentialSavings.toFixed(2)} per month if it's an ongoing issue.`,
              savings_amount: potentialSavings,
              priority: potentialSavings > 15 ? 'high' : 'medium',
              user_id: userId,
              is_applied: false
            });
          }
        }
      }

      // Check for data sharing opportunities across lines
      const dataSharingOpportunity = identifyDataSharingOpportunities(lines);

      if (dataSharingOpportunity.hasOpportunity) {
        recommendations.push({
          title: 'Enable data sharing between lines',
          description: `You have ${dataSharingOpportunity.highUsageLines} lines with high usage and ${dataSharingOpportunity.lowUsageLines} lines with excess data. Enabling data sharing could save approximately €${dataSharingOpportunity.potentialSavings.toFixed(2)} per month.`,
          savings_amount: dataSharingOpportunity.potentialSavings,
          priority: dataSharingOpportunity.priority,
          user_id: userId,
          is_applied: false
        });
      }

      // International calling recommendations
      if (lines.length > 0) {
        // This would typically use call history data, but for now we'll make a simple recommendation
        const internationalCallRecommendation = {
          title: 'Add international calling package',
          description: 'Based on your calling patterns, adding an international calling package could reduce your costs by approximately €12 per month.',
          savings_amount: 12,
          priority: 'medium',
          user_id: userId,
          is_applied: false
        };

        recommendations.push(internationalCallRecommendation);
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
