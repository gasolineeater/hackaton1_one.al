const { pool } = require('../config/db.config');

/**
 * Analytics Model
 * Provides methods for retrieving and analyzing telecom usage data
 */
class Analytics {
  /**
   * Get usage trends for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options (period, startDate, endDate, groupBy)
   * @returns {Promise} - Usage trend data
   */
  static async getUsageTrends(userId, options = {}) {
    try {
      // Determine time period
      const period = options.period || 'last6months';
      const groupBy = options.groupBy || 'month';
      
      let timeFilter = '';
      const queryParams = [userId];
      
      // Calculate date ranges based on period
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
      
      if (period === 'last3months') {
        timeFilter = 'AND ((uh.year = ? AND uh.month >= ?) OR (uh.year > ?))';
        
        let threeMonthsAgoYear = currentYear;
        let threeMonthsAgoMonth = currentMonth - 3;
        
        if (threeMonthsAgoMonth <= 0) {
          threeMonthsAgoMonth += 12;
          threeMonthsAgoYear -= 1;
        }
        
        queryParams.push(threeMonthsAgoYear, threeMonthsAgoMonth, threeMonthsAgoYear);
      } else if (period === 'last6months') {
        timeFilter = 'AND ((uh.year = ? AND uh.month >= ?) OR (uh.year > ?))';
        
        let sixMonthsAgoYear = currentYear;
        let sixMonthsAgoMonth = currentMonth - 6;
        
        if (sixMonthsAgoMonth <= 0) {
          sixMonthsAgoMonth += 12;
          sixMonthsAgoYear -= 1;
        }
        
        queryParams.push(sixMonthsAgoYear, sixMonthsAgoMonth, sixMonthsAgoYear);
      } else if (period === 'last12months') {
        timeFilter = 'AND ((uh.year = ? AND uh.month >= ?) OR (uh.year > ?))';
        queryParams.push(currentYear - 1, currentMonth, currentYear - 1);
      } else if (period === 'custom' && options.startYear && options.startMonth && options.endYear && options.endMonth) {
        timeFilter = 'AND (uh.year > ? OR (uh.year = ? AND uh.month >= ?)) AND (uh.year < ? OR (uh.year = ? AND uh.month <= ?))';
        queryParams.push(
          options.startYear, options.startYear, options.startMonth,
          options.endYear, options.endYear, options.endMonth
        );
      }
      
      // Determine grouping
      let selectClause, groupByClause;
      
      if (groupBy === 'month') {
        selectClause = 'uh.year, uh.month';
        groupByClause = 'uh.year, uh.month';
      } else if (groupBy === 'quarter') {
        selectClause = 'uh.year, CEIL(FIELD(uh.month, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec") / 3) as quarter';
        groupByClause = 'uh.year, quarter';
      } else if (groupBy === 'year') {
        selectClause = 'uh.year';
        groupByClause = 'uh.year';
      } else {
        throw new Error('Invalid groupBy option');
      }
      
      // Build query
      const query = `
        SELECT ${selectClause},
          SUM(uh.data_usage) as total_data,
          SUM(uh.calls_usage) as total_calls,
          SUM(uh.sms_usage) as total_sms,
          COUNT(DISTINCT uh.line_id) as line_count
        FROM usage_history uh
        JOIN telecom_lines tl ON uh.line_id = tl.id
        WHERE tl.user_id = ? ${timeFilter}
        GROUP BY ${groupByClause}
        ORDER BY uh.year, FIELD(uh.month, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
      `;
      
      const [rows] = await pool.execute(query, queryParams);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get cost breakdown for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options (period, startDate, endDate, groupBy)
   * @returns {Promise} - Cost breakdown data
   */
  static async getCostBreakdown(userId, options = {}) {
    try {
      // Determine time period
      const period = options.period || 'last6months';
      
      let timeFilter = '';
      const queryParams = [userId];
      
      // Calculate date ranges based on period
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
      
      if (period === 'last3months') {
        timeFilter = 'AND ((cb.year = ? AND cb.month >= ?) OR (cb.year > ?))';
        
        let threeMonthsAgoYear = currentYear;
        let threeMonthsAgoMonth = currentMonth - 3;
        
        if (threeMonthsAgoMonth <= 0) {
          threeMonthsAgoMonth += 12;
          threeMonthsAgoYear -= 1;
        }
        
        queryParams.push(threeMonthsAgoYear, threeMonthsAgoMonth, threeMonthsAgoYear);
      } else if (period === 'last6months') {
        timeFilter = 'AND ((cb.year = ? AND cb.month >= ?) OR (cb.year > ?))';
        
        let sixMonthsAgoYear = currentYear;
        let sixMonthsAgoMonth = currentMonth - 6;
        
        if (sixMonthsAgoMonth <= 0) {
          sixMonthsAgoMonth += 12;
          sixMonthsAgoYear -= 1;
        }
        
        queryParams.push(sixMonthsAgoYear, sixMonthsAgoMonth, sixMonthsAgoYear);
      } else if (period === 'last12months') {
        timeFilter = 'AND ((cb.year = ? AND cb.month >= ?) OR (cb.year > ?))';
        queryParams.push(currentYear - 1, currentMonth, currentYear - 1);
      } else if (period === 'custom' && options.startYear && options.startMonth && options.endYear && options.endMonth) {
        timeFilter = 'AND (cb.year > ? OR (cb.year = ? AND cb.month >= ?)) AND (cb.year < ? OR (cb.year = ? AND cb.month <= ?))';
        queryParams.push(
          options.startYear, options.startYear, options.startMonth,
          options.endYear, options.endYear, options.endMonth
        );
      }
      
      // Build query
      const query = `
        SELECT cb.month, cb.year, 
          cb.data_cost, cb.calls_cost, cb.sms_cost, cb.roaming_cost, cb.other_cost, cb.total_cost
        FROM cost_breakdown cb
        WHERE cb.user_id = ? ${timeFilter}
        ORDER BY cb.year, FIELD(cb.month, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
      `;
      
      const [rows] = await pool.execute(query, queryParams);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get usage by line for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options (period, startDate, endDate)
   * @returns {Promise} - Usage by line data
   */
  static async getUsageByLine(userId, options = {}) {
    try {
      // Determine time period
      const period = options.period || 'last6months';
      
      let timeFilter = '';
      const queryParams = [userId];
      
      // Calculate date ranges based on period
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
      
      if (period === 'last3months') {
        timeFilter = 'AND ((uh.year = ? AND uh.month >= ?) OR (uh.year > ?))';
        
        let threeMonthsAgoYear = currentYear;
        let threeMonthsAgoMonth = currentMonth - 3;
        
        if (threeMonthsAgoMonth <= 0) {
          threeMonthsAgoMonth += 12;
          threeMonthsAgoYear -= 1;
        }
        
        queryParams.push(threeMonthsAgoYear, threeMonthsAgoMonth, threeMonthsAgoYear);
      } else if (period === 'last6months') {
        timeFilter = 'AND ((uh.year = ? AND uh.month >= ?) OR (uh.year > ?))';
        
        let sixMonthsAgoYear = currentYear;
        let sixMonthsAgoMonth = currentMonth - 6;
        
        if (sixMonthsAgoMonth <= 0) {
          sixMonthsAgoMonth += 12;
          sixMonthsAgoYear -= 1;
        }
        
        queryParams.push(sixMonthsAgoYear, sixMonthsAgoMonth, sixMonthsAgoYear);
      } else if (period === 'last12months') {
        timeFilter = 'AND ((uh.year = ? AND uh.month >= ?) OR (uh.year > ?))';
        queryParams.push(currentYear - 1, currentMonth, currentYear - 1);
      } else if (period === 'custom' && options.startYear && options.startMonth && options.endYear && options.endMonth) {
        timeFilter = 'AND (uh.year > ? OR (uh.year = ? AND uh.month >= ?)) AND (uh.year < ? OR (uh.year = ? AND uh.month <= ?))';
        queryParams.push(
          options.startYear, options.startYear, options.startMonth,
          options.endYear, options.endYear, options.endMonth
        );
      }
      
      // Build query
      const query = `
        SELECT tl.id, tl.phone_number, tl.assigned_to, tl.plan_id, sp.name as plan_name,
          SUM(uh.data_usage) as total_data,
          SUM(uh.calls_usage) as total_calls,
          SUM(uh.sms_usage) as total_sms,
          COUNT(DISTINCT CONCAT(uh.year, uh.month)) as month_count
        FROM telecom_lines tl
        JOIN service_plans sp ON tl.plan_id = sp.id
        LEFT JOIN usage_history uh ON tl.id = uh.line_id ${timeFilter}
        WHERE tl.user_id = ?
        GROUP BY tl.id, tl.phone_number, tl.assigned_to, tl.plan_id, sp.name
        ORDER BY total_data DESC
      `;
      
      const [rows] = await pool.execute(query, queryParams);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get usage anomalies for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options (threshold, period)
   * @returns {Promise} - Usage anomalies data
   */
  static async getUsageAnomalies(userId, options = {}) {
    try {
      // Get usage history for all lines
      const [usageHistory] = await pool.execute(`
        SELECT uh.*, tl.phone_number, tl.assigned_to, tl.monthly_limit
        FROM usage_history uh
        JOIN telecom_lines tl ON uh.line_id = tl.id
        WHERE tl.user_id = ?
        ORDER BY tl.id, uh.year DESC, FIELD(uh.month, "Dec", "Nov", "Oct", "Sep", "Aug", "Jul", "Jun", "May", "Apr", "Mar", "Feb", "Jan")
      `, [userId]);
      
      // Group by line
      const lineUsageMap = {};
      
      usageHistory.forEach(record => {
        if (!lineUsageMap[record.line_id]) {
          lineUsageMap[record.line_id] = {
            lineId: record.line_id,
            phoneNumber: record.phone_number,
            assignedTo: record.assigned_to,
            monthlyLimit: record.monthly_limit,
            usageRecords: []
          };
        }
        
        lineUsageMap[record.line_id].usageRecords.push({
          month: record.month,
          year: record.year,
          dataUsage: record.data_usage,
          callsUsage: record.calls_usage,
          smsUsage: record.sms_usage
        });
      });
      
      // Detect anomalies for each line
      const anomalies = [];
      const threshold = options.threshold || 1.5; // Default threshold is 1.5x the average
      
      Object.values(lineUsageMap).forEach(line => {
        // Need at least 3 records to detect anomalies
        if (line.usageRecords.length < 3) {
          return;
        }
        
        // Calculate average usage
        const totalDataUsage = line.usageRecords.reduce((sum, record) => sum + record.dataUsage, 0);
        const avgDataUsage = totalDataUsage / line.usageRecords.length;
        
        // Find anomalies
        line.usageRecords.forEach(record => {
          if (record.dataUsage > avgDataUsage * threshold) {
            anomalies.push({
              lineId: line.lineId,
              phoneNumber: line.phoneNumber,
              assignedTo: line.assignedTo,
              month: record.month,
              year: record.year,
              dataUsage: record.dataUsage,
              averageUsage: avgDataUsage,
              deviation: record.dataUsage / avgDataUsage,
              monthlyLimit: line.monthlyLimit
            });
          }
        });
      });
      
      // Sort by deviation (highest first)
      anomalies.sort((a, b) => b.deviation - a.deviation);
      
      return anomalies;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get cost optimization opportunities for a user
   * @param {number} userId - User ID
   * @returns {Promise} - Cost optimization opportunities
   */
  static async getCostOptimizationOpportunities(userId) {
    try {
      // Get all telecom lines for the user
      const [lines] = await pool.execute(`
        SELECT tl.*, sp.name as plan_name, sp.data_limit, sp.calls, sp.sms, sp.price
        FROM telecom_lines tl
        JOIN service_plans sp ON tl.plan_id = sp.id
        WHERE tl.user_id = ?
      `, [userId]);
      
      // Get all service plans
      const [plans] = await pool.execute('SELECT * FROM service_plans');
      
      // Get usage history for each line
      const lineUsageMap = {};
      
      for (const line of lines) {
        const [usageHistory] = await pool.execute(`
          SELECT *
          FROM usage_history
          WHERE line_id = ?
          ORDER BY year DESC, FIELD(month, "Dec", "Nov", "Oct", "Sep", "Aug", "Jul", "Jun", "May", "Apr", "Mar", "Feb", "Jan")
          LIMIT 6
        `, [line.id]);
        
        lineUsageMap[line.id] = usageHistory;
      }
      
      // Find optimization opportunities
      const opportunities = [];
      
      // 1. Plan downgrades for underutilized lines
      lines.forEach(line => {
        const usageHistory = lineUsageMap[line.id];
        
        // Skip if no usage history
        if (!usageHistory || usageHistory.length === 0) {
          return;
        }
        
        // Calculate average usage
        const totalDataUsage = usageHistory.reduce((sum, record) => sum + record.data_usage, 0);
        const avgDataUsage = totalDataUsage / usageHistory.length;
        
        // Check if consistently underutilized (less than 50% of limit)
        if (avgDataUsage < line.data_limit * 0.5) {
          // Find a more suitable plan
          const suitablePlans = plans.filter(p => 
            p.data_limit >= avgDataUsage * 1.2 && // 20% buffer
            p.price < line.price
          );
          
          if (suitablePlans.length > 0) {
            // Sort by price (descending) to get the best value plan
            suitablePlans.sort((a, b) => b.price - a.price);
            const recommendedPlan = suitablePlans[0];
            
            opportunities.push({
              type: 'plan_downgrade',
              lineId: line.id,
              phoneNumber: line.phone_number,
              assignedTo: line.assigned_to,
              currentPlan: line.plan_name,
              recommendedPlan: recommendedPlan.name,
              currentPrice: line.price,
              recommendedPrice: recommendedPlan.price,
              savings: line.price - recommendedPlan.price,
              averageUsage: avgDataUsage,
              currentLimit: line.data_limit
            });
          }
        }
      });
      
      // 2. Data sharing opportunities
      if (lines.length > 1) {
        const highUsageLines = lines.filter(l => {
          const usageHistory = lineUsageMap[l.id];
          if (!usageHistory || usageHistory.length === 0) return false;
          
          const totalDataUsage = usageHistory.reduce((sum, record) => sum + record.data_usage, 0);
          const avgDataUsage = totalDataUsage / usageHistory.length;
          
          return avgDataUsage > l.data_limit * 0.85;
        });
        
        const lowUsageLines = lines.filter(l => {
          const usageHistory = lineUsageMap[l.id];
          if (!usageHistory || usageHistory.length === 0) return false;
          
          const totalDataUsage = usageHistory.reduce((sum, record) => sum + record.data_usage, 0);
          const avgDataUsage = totalDataUsage / usageHistory.length;
          
          return avgDataUsage < l.data_limit * 0.4;
        });
        
        if (highUsageLines.length > 0 && lowUsageLines.length > 0) {
          // Calculate potential savings
          const excessUsage = highUsageLines.reduce((sum, line) => {
            const usageHistory = lineUsageMap[line.id];
            const totalDataUsage = usageHistory.reduce((sum, record) => sum + record.data_usage, 0);
            const avgDataUsage = totalDataUsage / usageHistory.length;
            
            return sum + Math.max(0, avgDataUsage - line.data_limit);
          }, 0);
          
          const availableData = lowUsageLines.reduce((sum, line) => {
            const usageHistory = lineUsageMap[line.id];
            const totalDataUsage = usageHistory.reduce((sum, record) => sum + record.data_usage, 0);
            const avgDataUsage = totalDataUsage / usageHistory.length;
            
            return sum + Math.max(0, line.data_limit - avgDataUsage);
          }, 0);
          
          const usableSurplus = Math.min(excessUsage, availableData);
          const potentialSavings = usableSurplus * 10; // Assuming €10 per GB overage charge
          
          if (potentialSavings > 5) {
            opportunities.push({
              type: 'data_sharing',
              highUsageLines: highUsageLines.length,
              lowUsageLines: lowUsageLines.length,
              excessUsage,
              availableData,
              usableSurplus,
              potentialSavings,
              highUsageLineDetails: highUsageLines.map(l => ({
                phoneNumber: l.phone_number,
                assignedTo: l.assigned_to
              })),
              lowUsageLineDetails: lowUsageLines.map(l => ({
                phoneNumber: l.phone_number,
                assignedTo: l.assigned_to
              }))
            });
          }
        }
      }
      
      // Sort by savings (highest first)
      opportunities.sort((a, b) => b.savings - a.savings);
      
      return opportunities;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate sample cost breakdown data for a user
   * @param {number} userId - User ID
   * @param {number} months - Number of months to generate
   * @returns {Promise} - Generated cost breakdown data
   */
  static async generateSampleCostData(userId, months = 6) {
    try {
      // Get all telecom lines for the user
      const [lines] = await pool.execute(`
        SELECT tl.*, sp.price
        FROM telecom_lines tl
        JOIN service_plans sp ON tl.plan_id = sp.id
        WHERE tl.user_id = ?
      `, [userId]);
      
      if (lines.length === 0) {
        throw new Error('No telecom lines found for this user');
      }
      
      // Get current date
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth(); // 0-11
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const createdRecords = [];
      
      // Generate data for each month
      for (let i = 0; i < months; i++) {
        // Calculate month and year
        let targetMonth = currentMonth - i;
        let targetYear = currentYear;
        
        // Handle previous year
        if (targetMonth < 0) {
          targetMonth += 12;
          targetYear--;
        }
        
        const monthName = monthNames[targetMonth];
        
        // Check if record already exists
        const [existingRows] = await pool.execute(
          'SELECT * FROM cost_breakdown WHERE user_id = ? AND month = ? AND year = ?',
          [userId, monthName, targetYear]
        );
        
        if (existingRows.length > 0) {
          continue; // Skip if record already exists
        }
        
        // Calculate costs based on lines and plans
        const baseCost = lines.reduce((sum, line) => sum + line.price, 0);
        const randomFactor = Math.random() * 0.3 + 0.9; // 0.9 to 1.2
        
        // Calculate cost components
        const dataCost = baseCost * 0.6 * randomFactor;
        const callsCost = baseCost * 0.2 * randomFactor;
        const smsCost = baseCost * 0.05 * randomFactor;
        const roamingCost = baseCost * 0.1 * randomFactor;
        const otherCost = baseCost * 0.05 * randomFactor;
        const totalCost = dataCost + callsCost + smsCost + roamingCost + otherCost;
        
        // Create cost breakdown record
        const [result] = await pool.execute(
          `INSERT INTO cost_breakdown 
            (user_id, month, year, data_cost, calls_cost, sms_cost, roaming_cost, other_cost, total_cost) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId, 
            monthName, 
            targetYear, 
            parseFloat(dataCost.toFixed(2)),
            parseFloat(callsCost.toFixed(2)),
            parseFloat(smsCost.toFixed(2)),
            parseFloat(roamingCost.toFixed(2)),
            parseFloat(otherCost.toFixed(2)),
            parseFloat(totalCost.toFixed(2))
          ]
        );
        
        const [createdRecord] = await pool.execute('SELECT * FROM cost_breakdown WHERE id = ?', [result.insertId]);
        createdRecords.push(createdRecord[0]);
      }
      
      return createdRecords;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Analytics;
