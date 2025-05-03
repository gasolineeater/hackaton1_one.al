/**
 * AI Algorithms for ONE Albania SME Dashboard
 * Contains algorithms for generating recommendations and analyzing usage patterns
 */

/**
 * Analyze usage patterns to identify trends
 * @param {Array} usageHistory - Array of usage history records
 * @returns {Object} - Analysis results
 */
const analyzeUsagePatterns = (usageHistory) => {
  if (!usageHistory || usageHistory.length === 0) {
    return {
      trend: 'insufficient_data',
      averageUsage: 0,
      peakUsage: 0,
      growthRate: 0
    };
  }

  // Sort by year and month
  const sortedHistory = [...usageHistory].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return getMonthIndex(a.month) - getMonthIndex(b.month);
  });

  // Calculate average usage
  const totalDataUsage = sortedHistory.reduce((sum, record) => sum + record.data_usage, 0);
  const averageUsage = totalDataUsage / sortedHistory.length;

  // Find peak usage
  const peakUsage = Math.max(...sortedHistory.map(record => record.data_usage));

  // Calculate growth rate (if enough data)
  let growthRate = 0;
  if (sortedHistory.length >= 3) {
    const firstHalf = sortedHistory.slice(0, Math.floor(sortedHistory.length / 2));
    const secondHalf = sortedHistory.slice(Math.floor(sortedHistory.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, record) => sum + record.data_usage, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, record) => sum + record.data_usage, 0) / secondHalf.length;
    
    growthRate = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
  }

  // Determine trend
  let trend = 'stable';
  if (growthRate > 10) {
    trend = 'increasing';
  } else if (growthRate < -10) {
    trend = 'decreasing';
  }

  return {
    trend,
    averageUsage,
    peakUsage,
    growthRate
  };
};

/**
 * Detect anomalies in usage data
 * @param {Array} usageHistory - Array of usage history records
 * @returns {Array} - Detected anomalies
 */
const detectAnomalies = (usageHistory) => {
  if (!usageHistory || usageHistory.length < 3) {
    return [];
  }

  const anomalies = [];
  
  // Calculate mean and standard deviation
  const dataUsages = usageHistory.map(record => record.data_usage);
  const mean = dataUsages.reduce((sum, usage) => sum + usage, 0) / dataUsages.length;
  
  const squaredDiffs = dataUsages.map(usage => Math.pow(usage - mean, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / squaredDiffs.length;
  const stdDev = Math.sqrt(variance);
  
  // Threshold for anomaly detection (2 standard deviations)
  const threshold = 2 * stdDev;
  
  // Detect anomalies
  usageHistory.forEach(record => {
    const deviation = Math.abs(record.data_usage - mean);
    
    if (deviation > threshold) {
      anomalies.push({
        month: record.month,
        year: record.year,
        usage: record.data_usage,
        deviation: deviation,
        type: record.data_usage > mean ? 'high' : 'low'
      });
    }
  });
  
  return anomalies;
};

/**
 * Find optimal plan based on usage patterns
 * @param {Object} line - Telecom line data
 * @param {Array} plans - Available service plans
 * @param {Array} usageHistory - Usage history for the line
 * @returns {Object} - Recommendation result
 */
const findOptimalPlan = (line, plans, usageHistory) => {
  if (!line || !plans || plans.length === 0) {
    return {
      hasRecommendation: false,
      reason: 'insufficient_data'
    };
  }

  // Get current plan
  const currentPlan = plans.find(p => p.id === line.plan_id);
  if (!currentPlan) {
    return {
      hasRecommendation: false,
      reason: 'plan_not_found'
    };
  }

  // Analyze usage patterns
  const usageAnalysis = analyzeUsagePatterns(usageHistory);
  
  // Calculate effective usage (considering growth trend)
  let effectiveUsage = line.current_usage;
  if (usageAnalysis.trend === 'increasing') {
    // Add a buffer for increasing trend
    effectiveUsage = effectiveUsage * (1 + (usageAnalysis.growthRate / 200));
  }
  
  // Find better plans
  const betterPlans = [];
  
  // Case 1: Current usage is consistently low - suggest downgrading
  if (effectiveUsage < currentPlan.data_limit * 0.7) {
    const cheaperPlans = plans.filter(p => 
      p.price < currentPlan.price && 
      p.data_limit >= effectiveUsage * 1.2 // Add 20% buffer
    );
    
    if (cheaperPlans.length > 0) {
      // Sort by price (descending) to get the best value plan
      const recommendedPlan = [...cheaperPlans].sort((a, b) => b.price - a.price)[0];
      
      betterPlans.push({
        plan: recommendedPlan,
        savings: currentPlan.price - recommendedPlan.price,
        reason: 'underutilization',
        priority: 'medium'
      });
    }
  }
  
  // Case 2: Current usage is close to or exceeds the limit - suggest upgrading
  if (effectiveUsage > currentPlan.data_limit * 0.85) {
    const upgradePlans = plans.filter(p => 
      p.data_limit > currentPlan.data_limit &&
      p.data_limit >= effectiveUsage * 1.2 // Add 20% buffer
    );
    
    if (upgradePlans.length > 0) {
      // Sort by price (ascending) to get the most economical upgrade
      const recommendedPlan = [...upgradePlans].sort((a, b) => a.price - b.price)[0];
      
      // Calculate potential overage charges (assuming 10€ per GB over limit)
      const potentialOverage = Math.max(0, effectiveUsage - currentPlan.data_limit) * 10;
      const savings = potentialOverage - (recommendedPlan.price - currentPlan.price);
      
      if (savings > 0) {
        betterPlans.push({
          plan: recommendedPlan,
          savings: savings,
          reason: 'approaching_limit',
          priority: effectiveUsage > currentPlan.data_limit ? 'high' : 'medium'
        });
      }
    }
  }
  
  // Return the recommendation with the highest savings
  if (betterPlans.length > 0) {
    betterPlans.sort((a, b) => b.savings - a.savings);
    
    return {
      hasRecommendation: true,
      currentPlan: currentPlan,
      recommendedPlan: betterPlans[0].plan,
      savings: betterPlans[0].savings,
      reason: betterPlans[0].reason,
      priority: betterPlans[0].priority
    };
  }
  
  return {
    hasRecommendation: false,
    reason: 'optimal_plan'
  };
};

/**
 * Identify data sharing opportunities across multiple lines
 * @param {Array} lines - Array of telecom lines
 * @returns {Object} - Data sharing recommendation
 */
const identifyDataSharingOpportunities = (lines) => {
  if (!lines || lines.length < 2) {
    return {
      hasOpportunity: false,
      reason: 'insufficient_lines'
    };
  }
  
  // Identify high and low usage lines
  const highUsageLines = lines.filter(line => 
    line.current_usage > line.monthly_limit * 0.85
  );
  
  const lowUsageLines = lines.filter(line => 
    line.current_usage < line.monthly_limit * 0.4
  );
  
  if (highUsageLines.length === 0 || lowUsageLines.length === 0) {
    return {
      hasOpportunity: false,
      reason: 'no_usage_imbalance'
    };
  }
  
  // Calculate potential savings
  const excessUsage = highUsageLines.reduce((sum, line) => 
    sum + Math.max(0, line.current_usage - line.monthly_limit), 0
  );
  
  const availableData = lowUsageLines.reduce((sum, line) => 
    sum + Math.max(0, line.monthly_limit - line.current_usage), 0
  );
  
  const usableSurplus = Math.min(excessUsage, availableData);
  
  // Estimate savings (assuming 10€ per GB over limit)
  const potentialSavings = usableSurplus * 10;
  
  if (potentialSavings > 5) { // Only recommend if savings are significant
    return {
      hasOpportunity: true,
      highUsageLines: highUsageLines.length,
      lowUsageLines: lowUsageLines.length,
      potentialSavings: potentialSavings,
      priority: potentialSavings > 20 ? 'high' : 'medium'
    };
  }
  
  return {
    hasOpportunity: false,
    reason: 'insufficient_savings'
  };
};

/**
 * Helper function to convert month name to index
 * @param {string} month - Month name (Jan, Feb, etc.)
 * @returns {number} - Month index (0-11)
 */
const getMonthIndex = (month) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.indexOf(month);
};

module.exports = {
  analyzeUsagePatterns,
  detectAnomalies,
  findOptimalPlan,
  identifyDataSharingOpportunities
};
