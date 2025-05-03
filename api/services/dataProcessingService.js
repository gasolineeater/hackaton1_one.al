import { Op, Sequelize } from 'sequelize';
import { Customer, Service, Subscription, Usage, Billing, BillingItem } from '../models/index.js';

/**
 * Service for data processing and feature extraction
 * Prepares data for machine learning and recommendation algorithms
 */
class DataProcessingService {
  /**
   * Extract usage features for a customer
   * @param {number} customerId - Customer ID
   * @param {Object} options - Options for feature extraction
   * @returns {Promise<Object>} Extracted features
   */
  async extractUsageFeatures(customerId, options = {}) {
    try {
      const { 
        period = 'monthly', 
        months = 3,
        serviceType = 'all'
      } = options;
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      
      // Build service type filter
      const serviceTypeFilter = {};
      if (serviceType !== 'all') {
        serviceTypeFilter.type = serviceType;
      }
      
      // Get customer subscriptions
      const subscriptions = await Subscription.findAll({
        where: {
          customerId,
          status: 'active'
        },
        include: [{
          model: Service,
          where: serviceTypeFilter
        }]
      });
      
      const subscriptionIds = subscriptions.map(sub => sub.id);
      
      if (subscriptionIds.length === 0) {
        return {
          success: false,
          error: 'No active subscriptions found'
        };
      }
      
      // Get usage data
      const usageData = await Usage.findAll({
        where: {
          subscriptionId: { [Op.in]: subscriptionIds },
          date: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['date', 'ASC']]
      });
      
      // Process usage data into features
      const features = {
        totalDataUsage: 0,
        totalVoiceUsage: 0,
        totalSmsUsage: 0,
        avgDataUsage: 0,
        avgVoiceUsage: 0,
        avgSmsUsage: 0,
        maxDataUsage: 0,
        maxVoiceUsage: 0,
        maxSmsUsage: 0,
        usageVariability: 0,
        usageGrowthRate: 0,
        peakUsageTimes: [],
        usageByService: {},
        usagePatterns: {}
      };
      
      if (usageData.length === 0) {
        return {
          success: true,
          data: features
        };
      }
      
      // Calculate basic metrics
      let dataUsages = [];
      let voiceUsages = [];
      let smsUsages = [];
      
      usageData.forEach(usage => {
        features.totalDataUsage += usage.dataUsage || 0;
        features.totalVoiceUsage += usage.voiceUsage || 0;
        features.totalSmsUsage += usage.smsUsage || 0;
        
        features.maxDataUsage = Math.max(features.maxDataUsage, usage.dataUsage || 0);
        features.maxVoiceUsage = Math.max(features.maxVoiceUsage, usage.voiceUsage || 0);
        features.maxSmsUsage = Math.max(features.maxSmsUsage, usage.smsUsage || 0);
        
        dataUsages.push(usage.dataUsage || 0);
        voiceUsages.push(usage.voiceUsage || 0);
        smsUsages.push(usage.smsUsage || 0);
        
        // Track usage by service
        const serviceId = usage.subscriptionId;
        if (!features.usageByService[serviceId]) {
          features.usageByService[serviceId] = {
            dataUsage: 0,
            voiceUsage: 0,
            smsUsage: 0,
            count: 0
          };
        }
        
        features.usageByService[serviceId].dataUsage += usage.dataUsage || 0;
        features.usageByService[serviceId].voiceUsage += usage.voiceUsage || 0;
        features.usageByService[serviceId].smsUsage += usage.smsUsage || 0;
        features.usageByService[serviceId].count += 1;
        
        // Track usage patterns by time
        const hour = new Date(usage.date).getHours();
        const dayOfWeek = new Date(usage.date).getDay();
        
        // Hour patterns
        if (!features.usagePatterns.hourly) {
          features.usagePatterns.hourly = Array(24).fill(0);
        }
        features.usagePatterns.hourly[hour] += usage.dataUsage || 0;
        
        // Day of week patterns
        if (!features.usagePatterns.daily) {
          features.usagePatterns.daily = Array(7).fill(0);
        }
        features.usagePatterns.daily[dayOfWeek] += usage.dataUsage || 0;
      });
      
      // Calculate averages
      features.avgDataUsage = features.totalDataUsage / usageData.length;
      features.avgVoiceUsage = features.totalVoiceUsage / usageData.length;
      features.avgSmsUsage = features.totalSmsUsage / usageData.length;
      
      // Calculate variability (standard deviation)
      features.usageVariability = this.calculateStandardDeviation(dataUsages);
      
      // Calculate growth rate (simple linear regression slope)
      if (dataUsages.length > 1) {
        features.usageGrowthRate = this.calculateGrowthRate(dataUsages);
      }
      
      // Find peak usage times
      features.peakUsageTimes = this.findPeakUsageTimes(features.usagePatterns.hourly);
      
      // Normalize usage patterns
      if (features.usagePatterns.hourly) {
        const maxHourlyUsage = Math.max(...features.usagePatterns.hourly);
        if (maxHourlyUsage > 0) {
          features.usagePatterns.hourly = features.usagePatterns.hourly.map(u => u / maxHourlyUsage);
        }
      }
      
      if (features.usagePatterns.daily) {
        const maxDailyUsage = Math.max(...features.usagePatterns.daily);
        if (maxDailyUsage > 0) {
          features.usagePatterns.daily = features.usagePatterns.daily.map(u => u / maxDailyUsage);
        }
      }
      
      return {
        success: true,
        data: features
      };
    } catch (error) {
      console.error('Error extracting usage features:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Extract customer profile features
   * @param {number} customerId - Customer ID
   * @returns {Promise<Object>} Customer profile features
   */
  async extractCustomerFeatures(customerId) {
    try {
      // Get customer data
      const customer = await Customer.findByPk(customerId, {
        include: [{
          model: Subscription,
          include: [Service]
        }]
      });
      
      if (!customer) {
        return {
          success: false,
          error: 'Customer not found'
        };
      }
      
      // Extract basic customer features
      const features = {
        businessType: customer.businessType,
        employeeCount: customer.employeeCount,
        status: customer.status,
        subscriptionCount: customer.Subscriptions.length,
        serviceTypes: {},
        totalMonthlyCost: 0,
        avgSubscriptionAge: 0,
        customerAge: this.calculateCustomerAge(customer.createdAt)
      };
      
      // Process subscriptions
      let totalAge = 0;
      
      customer.Subscriptions.forEach(subscription => {
        // Count service types
        const serviceType = subscription.Service.type;
        if (!features.serviceTypes[serviceType]) {
          features.serviceTypes[serviceType] = 0;
        }
        features.serviceTypes[serviceType] += 1;
        
        // Calculate costs
        features.totalMonthlyCost += subscription.monthlyCost || 0;
        
        // Calculate subscription age
        const subscriptionAge = this.calculateSubscriptionAge(subscription.startDate);
        totalAge += subscriptionAge;
      });
      
      // Calculate average subscription age
      if (customer.Subscriptions.length > 0) {
        features.avgSubscriptionAge = totalAge / customer.Subscriptions.length;
      }
      
      return {
        success: true,
        data: features
      };
    } catch (error) {
      console.error('Error extracting customer features:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Extract billing and cost features
   * @param {number} customerId - Customer ID
   * @param {Object} options - Options for feature extraction
   * @returns {Promise<Object>} Billing features
   */
  async extractBillingFeatures(customerId, options = {}) {
    try {
      const { months = 6 } = options;
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      
      // Get billing data
      const billingData = await Billing.findAll({
        where: {
          customerId,
          billingDate: {
            [Op.between]: [startDate, endDate]
          }
        },
        include: [{
          model: BillingItem,
          include: [{
            model: Subscription,
            include: [Service]
          }]
        }],
        order: [['billingDate', 'ASC']]
      });
      
      // Process billing data into features
      const features = {
        totalBilled: 0,
        avgMonthlyBill: 0,
        costByServiceType: {},
        costTrend: [],
        paymentHistory: {
          onTime: 0,
          late: 0,
          veryLate: 0
        },
        costGrowthRate: 0
      };
      
      if (billingData.length === 0) {
        return {
          success: true,
          data: features
        };
      }
      
      // Calculate basic metrics
      let monthlyCosts = [];
      
      billingData.forEach(billing => {
        features.totalBilled += billing.totalAmount || 0;
        monthlyCosts.push(billing.totalAmount || 0);
        
        // Track cost trend
        features.costTrend.push({
          date: billing.billingDate,
          amount: billing.totalAmount
        });
        
        // Track payment history
        if (billing.paymentStatus === 'paid') {
          const daysLate = this.calculateDaysLate(billing.billingDate, billing.paymentDate);
          if (daysLate <= 0) {
            features.paymentHistory.onTime += 1;
          } else if (daysLate <= 15) {
            features.paymentHistory.late += 1;
          } else {
            features.paymentHistory.veryLate += 1;
          }
        }
        
        // Track cost by service type
        billing.BillingItems.forEach(item => {
          if (item.Subscription && item.Subscription.Service) {
            const serviceType = item.Subscription.Service.type;
            if (!features.costByServiceType[serviceType]) {
              features.costByServiceType[serviceType] = 0;
            }
            features.costByServiceType[serviceType] += item.amount || 0;
          }
        });
      });
      
      // Calculate averages
      features.avgMonthlyBill = features.totalBilled / billingData.length;
      
      // Calculate growth rate
      if (monthlyCosts.length > 1) {
        features.costGrowthRate = this.calculateGrowthRate(monthlyCosts);
      }
      
      return {
        success: true,
        data: features
      };
    } catch (error) {
      console.error('Error extracting billing features:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Calculate standard deviation
   * @param {Array<number>} values - Array of values
   * @returns {number} Standard deviation
   */
  calculateStandardDeviation(values) {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    
    return Math.sqrt(variance);
  }
  
  /**
   * Calculate growth rate using simple linear regression
   * @param {Array<number>} values - Array of values
   * @returns {number} Growth rate (slope)
   */
  calculateGrowthRate(values) {
    if (values.length <= 1) return 0;
    
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i); // Time indices
    
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + (val * values[i]), 0);
    const sumXX = x.reduce((sum, val) => sum + (val * val), 0);
    
    // Calculate slope (m) of linear regression line
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    // Normalize by average value to get percentage growth
    const avgValue = sumY / n;
    return avgValue !== 0 ? (slope / avgValue) : 0;
  }
  
  /**
   * Find peak usage times
   * @param {Array<number>} hourlyUsage - Hourly usage data
   * @returns {Array<number>} Peak usage hours
   */
  findPeakUsageTimes(hourlyUsage) {
    if (!hourlyUsage || hourlyUsage.length === 0) return [];
    
    const threshold = 0.7 * Math.max(...hourlyUsage);
    const peakHours = [];
    
    hourlyUsage.forEach((usage, hour) => {
      if (usage >= threshold) {
        peakHours.push(hour);
      }
    });
    
    return peakHours;
  }
  
  /**
   * Calculate customer age in months
   * @param {Date} createdAt - Customer creation date
   * @returns {number} Customer age in months
   */
  calculateCustomerAge(createdAt) {
    if (!createdAt) return 0;
    
    const now = new Date();
    const created = new Date(createdAt);
    
    const monthDiff = (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth());
    return monthDiff;
  }
  
  /**
   * Calculate subscription age in months
   * @param {Date} startDate - Subscription start date
   * @returns {number} Subscription age in months
   */
  calculateSubscriptionAge(startDate) {
    if (!startDate) return 0;
    
    const now = new Date();
    const start = new Date(startDate);
    
    const monthDiff = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    return monthDiff;
  }
  
  /**
   * Calculate days late for payment
   * @param {Date} billingDate - Billing date
   * @param {Date} paymentDate - Payment date
   * @returns {number} Days late
   */
  calculateDaysLate(billingDate, paymentDate) {
    if (!billingDate || !paymentDate) return 0;
    
    const billing = new Date(billingDate);
    const payment = new Date(paymentDate);
    
    // Add 15 days grace period
    billing.setDate(billing.getDate() + 15);
    
    const diffTime = payment.getTime() - billing.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }
  
  /**
   * Normalize features for machine learning
   * @param {Object} features - Features to normalize
   * @returns {Object} Normalized features
   */
  normalizeFeatures(features) {
    const normalized = { ...features };
    
    // Normalize numeric features to 0-1 range
    // This is a simplified implementation - in a real system,
    // you would use more sophisticated normalization techniques
    
    return normalized;
  }
}

// Export a singleton instance
export default new DataProcessingService();
