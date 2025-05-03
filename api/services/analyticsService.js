import { Op, Sequelize } from 'sequelize';
import { Customer, Service, Subscription, Usage, Billing, BillingItem } from '../models/index.js';

/**
 * Service for analytics operations
 * Handles data aggregation, cost optimization, and reporting
 */
class AnalyticsService {
  /**
   * Get usage analytics data
   * @param {Object} options - Query parameters
   * @returns {Promise<Object>} Usage analytics data
   */
  async getUsageAnalytics(options = {}) {
    try {
      const { 
        customerId, 
        period = 'monthly', 
        serviceType = 'all',
        startDate,
        endDate,
        groupBy = 'service'
      } = options;
      
      // Build date range filter
      const dateFilter = {};
      if (startDate) {
        dateFilter[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        dateFilter[Op.lte] = new Date(endDate);
      }
      
      // Build where clause
      const whereClause = {};
      if (Object.keys(dateFilter).length > 0) {
        whereClause.date = dateFilter;
      }
      if (customerId) {
        whereClause.customerId = customerId;
      }
      
      // Build service type filter
      const serviceTypeFilter = {};
      if (serviceType !== 'all') {
        serviceTypeFilter.type = serviceType;
      }
      
      // Determine group by attributes based on period
      let dateAttribute;
      switch (period) {
        case 'daily':
          dateAttribute = [Sequelize.fn('DATE', Sequelize.col('date'))];
          break;
        case 'weekly':
          dateAttribute = [
            Sequelize.fn('YEAR', Sequelize.col('date')),
            Sequelize.fn('WEEK', Sequelize.col('date'))
          ];
          break;
        case 'monthly':
          dateAttribute = [
            Sequelize.fn('YEAR', Sequelize.col('date')),
            Sequelize.fn('MONTH', Sequelize.col('date'))
          ];
          break;
        case 'quarterly':
          dateAttribute = [
            Sequelize.fn('YEAR', Sequelize.col('date')),
            Sequelize.fn('QUARTER', Sequelize.col('date'))
          ];
          break;
        case 'yearly':
          dateAttribute = [Sequelize.fn('YEAR', Sequelize.col('date'))];
          break;
        default:
          dateAttribute = [Sequelize.fn('DATE', Sequelize.col('date'))];
      }
      
      // Determine group by attributes based on groupBy parameter
      let groupByAttributes = [];
      let includeModels = [];
      
      if (groupBy === 'service') {
        groupByAttributes = ['serviceId'];
        includeModels = [{
          model: Service,
          attributes: ['name', 'type'],
          where: serviceTypeFilter
        }];
      } else if (groupBy === 'customer') {
        groupByAttributes = ['customerId'];
        includeModels = [{
          model: Customer,
          attributes: ['companyName']
        }];
      } else if (groupBy === 'subscription') {
        groupByAttributes = ['subscriptionId'];
      }
      
      // Get usage data with aggregations
      const usageData = await Usage.findAll({
        attributes: [
          ...groupByAttributes,
          [Sequelize.fn('SUM', Sequelize.col('dataUsage')), 'totalDataUsage'],
          [Sequelize.fn('SUM', Sequelize.col('voiceUsage')), 'totalVoiceUsage'],
          [Sequelize.fn('SUM', Sequelize.col('smsUsage')), 'totalSmsUsage'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          ...dateAttribute.map((fn, i) => [fn, \`date_part_\${i}\`])
        ],
        where: whereClause,
        include: includeModels,
        group: [...groupByAttributes, ...dateAttribute],
        order: [...dateAttribute.map((fn, i) => [\`date_part_\${i}\`, 'ASC'])]
      });
      
      // Format the results
      const formattedData = usageData.map(item => {
        const data = item.toJSON();
        
        // Format date parts based on period
        let periodLabel = '';
        if (period === 'daily') {
          periodLabel = data.date_part_0;
        } else if (period === 'weekly') {
          periodLabel = \`\${data.date_part_0}-W\${data.date_part_1}\`;
        } else if (period === 'monthly') {
          periodLabel = \`\${data.date_part_0}-\${data.date_part_1}\`;
        } else if (period === 'quarterly') {
          periodLabel = \`\${data.date_part_0}-Q\${data.date_part_1}\`;
        } else if (period === 'yearly') {
          periodLabel = data.date_part_0;
        }
        
        // Build result object
        const result = {
          period: periodLabel,
          totalDataUsage: parseFloat(data.totalDataUsage) || 0,
          totalVoiceUsage: parseFloat(data.totalVoiceUsage) || 0,
          totalSmsUsage: parseFloat(data.totalSmsUsage) || 0,
          count: parseInt(data.count)
        };
        
        // Add group by specific data
        if (groupBy === 'service' && data.Service) {
          result.serviceId = data.serviceId;
          result.serviceName = data.Service.name;
          result.serviceType = data.Service.type;
        } else if (groupBy === 'customer' && data.Customer) {
          result.customerId = data.customerId;
          result.customerName = data.Customer.companyName;
        } else if (groupBy === 'subscription') {
          result.subscriptionId = data.subscriptionId;
        }
        
        return result;
      });
      
      return {
        success: true,
        data: {
          period,
          serviceType,
          groupBy,
          usageData: formattedData
        }
      };
    } catch (error) {
      console.error('Error in analytics service - getUsageAnalytics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get cost analytics data
   * @param {Object} options - Query parameters
   * @returns {Promise<Object>} Cost analytics data
   */
  async getCostAnalytics(options = {}) {
    try {
      const { 
        customerId, 
        period = 'monthly', 
        serviceType = 'all',
        startDate,
        endDate,
        groupBy = 'service'
      } = options;
      
      // Build date range filter
      const dateFilter = {};
      if (startDate) {
        dateFilter[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        dateFilter[Op.lte] = new Date(endDate);
      }
      
      // Build where clause for billing
      const billingWhereClause = {};
      if (Object.keys(dateFilter).length > 0) {
        billingWhereClause.billingDate = dateFilter;
      }
      if (customerId) {
        billingWhereClause.customerId = customerId;
      }
      
      // Build service type filter
      const serviceTypeFilter = {};
      if (serviceType !== 'all') {
        serviceTypeFilter.type = serviceType;
      }
      
      // Determine group by attributes based on period
      let dateAttribute;
      switch (period) {
        case 'monthly':
          dateAttribute = [
            Sequelize.fn('YEAR', Sequelize.col('Billing.billingDate')),
            Sequelize.fn('MONTH', Sequelize.col('Billing.billingDate'))
          ];
          break;
        case 'quarterly':
          dateAttribute = [
            Sequelize.fn('YEAR', Sequelize.col('Billing.billingDate')),
            Sequelize.fn('QUARTER', Sequelize.col('Billing.billingDate'))
          ];
          break;
        case 'yearly':
          dateAttribute = [Sequelize.fn('YEAR', Sequelize.col('Billing.billingDate'))];
          break;
        default:
          dateAttribute = [
            Sequelize.fn('YEAR', Sequelize.col('Billing.billingDate')),
            Sequelize.fn('MONTH', Sequelize.col('Billing.billingDate'))
          ];
      }
      
      // Determine group by attributes based on groupBy parameter
      let groupByAttributes = [];
      let includeModels = [];
      
      // Base include for Billing
      const billingInclude = {
        model: Billing,
        attributes: [],
        where: billingWhereClause,
        required: true
      };
      
      if (groupBy === 'service') {
        groupByAttributes = ['BillingItem.serviceId'];
        includeModels = [
          billingInclude,
          {
            model: Service,
            attributes: ['name', 'type'],
            where: serviceTypeFilter
          }
        ];
      } else if (groupBy === 'customer') {
        groupByAttributes = ['Billing.customerId'];
        includeModels = [
          billingInclude,
          {
            model: Customer,
            attributes: ['companyName']
          }
        ];
      } else if (groupBy === 'subscription') {
        groupByAttributes = ['BillingItem.subscriptionId'];
        includeModels = [billingInclude];
      }
      
      // Get cost data with aggregations
      const costData = await BillingItem.findAll({
        attributes: [
          ...groupByAttributes,
          [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalCost'],
          [Sequelize.fn('COUNT', Sequelize.col('BillingItem.id')), 'count'],
          ...dateAttribute.map((fn, i) => [fn, \`date_part_\${i}\`])
        ],
        include: includeModels,
        group: [...groupByAttributes, ...dateAttribute],
        order: [...dateAttribute.map((fn, i) => [\`date_part_\${i}\`, 'ASC'])]
      });
      
      // Format the results
      const formattedData = costData.map(item => {
        const data = item.toJSON();
        
        // Format date parts based on period
        let periodLabel = '';
        if (period === 'monthly') {
          periodLabel = \`\${data.date_part_0}-\${data.date_part_1}\`;
        } else if (period === 'quarterly') {
          periodLabel = \`\${data.date_part_0}-Q\${data.date_part_1}\`;
        } else if (period === 'yearly') {
          periodLabel = data.date_part_0;
        }
        
        // Build result object
        const result = {
          period: periodLabel,
          totalCost: parseFloat(data.totalCost) || 0,
          count: parseInt(data.count)
        };
        
        // Add group by specific data
        if (groupBy === 'service' && data.Service) {
          result.serviceId = data.serviceId;
          result.serviceName = data.Service.name;
          result.serviceType = data.Service.type;
        } else if (groupBy === 'customer' && data.Customer) {
          result.customerId = data.customerId;
          result.customerName = data.Customer.companyName;
        } else if (groupBy === 'subscription') {
          result.subscriptionId = data.subscriptionId;
        }
        
        return result;
      });
      
      return {
        success: true,
        data: {
          period,
          serviceType,
          groupBy,
          costData: formattedData
        }
      };
    } catch (error) {
      console.error('Error in analytics service - getCostAnalytics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get performance analytics data
   * @param {Object} options - Query parameters
   * @returns {Promise<Object>} Performance analytics data
   */
  async getPerformanceAnalytics(options = {}) {
    try {
      const { 
        customerId, 
        serviceIds,
        period = 'monthly',
        startDate,
        endDate
      } = options;
      
      // Parse service IDs if provided
      let serviceIdArray = [];
      if (serviceIds) {
        serviceIdArray = serviceIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      }
      
      // Build date range filter
      const dateFilter = {};
      if (startDate) {
        dateFilter[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        dateFilter[Op.lte] = new Date(endDate);
      }
      
      // Build where clause for usage
      const usageWhereClause = {};
      if (Object.keys(dateFilter).length > 0) {
        usageWhereClause.date = dateFilter;
      }
      if (customerId) {
        usageWhereClause.customerId = customerId;
      }
      
      // Build subscription filter
      const subscriptionFilter = {};
      if (serviceIdArray.length > 0) {
        subscriptionFilter.serviceId = { [Op.in]: serviceIdArray };
      }
      
      // Get usage data for performance metrics
      const usageData = await Usage.findAll({
        attributes: [
          'subscriptionId',
          [Sequelize.fn('AVG', Sequelize.col('dataUsage')), 'avgDataUsage'],
          [Sequelize.fn('MAX', Sequelize.col('dataUsage')), 'maxDataUsage'],
          [Sequelize.fn('AVG', Sequelize.col('voiceUsage')), 'avgVoiceUsage'],
          [Sequelize.fn('MAX', Sequelize.col('voiceUsage')), 'maxVoiceUsage'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'usageCount']
        ],
        where: usageWhereClause,
        include: [{
          model: Subscription,
          attributes: ['serviceId'],
          where: subscriptionFilter,
          include: [{
            model: Service,
            attributes: ['name', 'type']
          }]
        }],
        group: ['subscriptionId', 'Subscription.id', 'Subscription.serviceId', 'Subscription.Service.id']
      });
      
      // Get cost data for ROI calculation
      const costData = await BillingItem.findAll({
        attributes: [
          'subscriptionId',
          [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalCost']
        ],
        include: [{
          model: Subscription,
          attributes: ['serviceId'],
          where: subscriptionFilter
        }],
        group: ['subscriptionId', 'Subscription.id', 'Subscription.serviceId']
      });
      
      // Create a map of subscription costs
      const costMap = new Map();
      costData.forEach(item => {
        costMap.set(item.subscriptionId, parseFloat(item.get('totalCost')) || 0);
      });
      
      // Format the results with performance metrics
      const performanceData = usageData.map(item => {
        const data = item.toJSON();
        const subscription = data.Subscription;
        const service = subscription.Service;
        const cost = costMap.get(data.subscriptionId) || 0;
        
        // Calculate performance metrics
        const avgDataUsage = parseFloat(data.avgDataUsage) || 0;
        const maxDataUsage = parseFloat(data.maxDataUsage) || 0;
        const avgVoiceUsage = parseFloat(data.avgVoiceUsage) || 0;
        const maxVoiceUsage = parseFloat(data.maxVoiceUsage) || 0;
        const usageCount = parseInt(data.usageCount);
        
        // Calculate utilization (as percentage of max capacity)
        // This is a simplified calculation - in a real system, you'd have capacity data
        const dataUtilization = maxDataUsage > 0 ? (avgDataUsage / maxDataUsage) * 100 : 0;
        const voiceUtilization = maxVoiceUsage > 0 ? (avgVoiceUsage / maxVoiceUsage) * 100 : 0;
        
        // Calculate ROI (simplified)
        // In a real system, you'd have revenue data to calculate actual ROI
        const usageValue = (avgDataUsage * 0.1) + (avgVoiceUsage * 0.05); // Simplified value calculation
        const roi = cost > 0 ? (usageValue / cost) * 100 : 0;
        
        return {
          subscriptionId: data.subscriptionId,
          serviceId: subscription.serviceId,
          serviceName: service.name,
          serviceType: service.type,
          metrics: {
            avgDataUsage,
            maxDataUsage,
            avgVoiceUsage,
            maxVoiceUsage,
            dataUtilization: parseFloat(dataUtilization.toFixed(2)),
            voiceUtilization: parseFloat(voiceUtilization.toFixed(2)),
            usageCount,
            totalCost: cost,
            roi: parseFloat(roi.toFixed(2))
          }
        };
      });
      
      return {
        success: true,
        data: {
          period,
          performanceData
        }
      };
    } catch (error) {
      console.error('Error in analytics service - getPerformanceAnalytics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get cost optimization recommendations
   * @param {Object} options - Query parameters
   * @returns {Promise<Object>} Cost optimization recommendations
   */
  async getCostOptimization(options = {}) {
    try {
      const { customerId, threshold = 50 } = options;
      
      // Build where clause
      const whereClause = {};
      if (customerId) {
        whereClause.customerId = customerId;
      }
      
      // Get all active subscriptions
      const subscriptions = await Subscription.findAll({
        where: {
          ...whereClause,
          status: 'active'
        },
        include: [
          {
            model: Service,
            attributes: ['id', 'name', 'type', 'monthlyCost', 'features']
          },
          {
            model: Customer,
            attributes: ['id', 'companyName']
          }
        ]
      });
      
      // Get usage data for the last 3 months
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      const usageData = await Usage.findAll({
        attributes: [
          'subscriptionId',
          [Sequelize.fn('AVG', Sequelize.col('dataUsage')), 'avgDataUsage'],
          [Sequelize.fn('MAX', Sequelize.col('dataUsage')), 'maxDataUsage'],
          [Sequelize.fn('AVG', Sequelize.col('voiceUsage')), 'avgVoiceUsage'],
          [Sequelize.fn('MAX', Sequelize.col('voiceUsage')), 'maxVoiceUsage'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'usageCount']
        ],
        where: {
          ...whereClause,
          date: { [Op.gte]: threeMonthsAgo }
        },
        group: ['subscriptionId']
      });
      
      // Create a map of subscription usage
      const usageMap = new Map();
      usageData.forEach(item => {
        usageMap.set(item.subscriptionId, {
          avgDataUsage: parseFloat(item.get('avgDataUsage')) || 0,
          maxDataUsage: parseFloat(item.get('maxDataUsage')) || 0,
          avgVoiceUsage: parseFloat(item.get('avgVoiceUsage')) || 0,
          maxVoiceUsage: parseFloat(item.get('maxVoiceUsage')) || 0,
          usageCount: parseInt(item.get('usageCount'))
        });
      });
      
      // Generate optimization recommendations
      const recommendations = [];
      
      subscriptions.forEach(subscription => {
        const usage = usageMap.get(subscription.id);
        const service = subscription.Service;
        const customer = subscription.Customer;
        
        // Skip if no usage data
        if (!usage) return;
        
        // Calculate utilization percentage (simplified)
        const dataUtilization = usage.maxDataUsage > 0 ? (usage.avgDataUsage / usage.maxDataUsage) * 100 : 0;
        const voiceUtilization = usage.maxVoiceUsage > 0 ? (usage.avgVoiceUsage / usage.maxVoiceUsage) * 100 : 0;
        
        // Identify underutilized subscriptions
        if (dataUtilization < threshold && voiceUtilization < threshold) {
          recommendations.push({
            type: 'downgrade',
            subscriptionId: subscription.id,
            customerId: customer.id,
            customerName: customer.companyName,
            serviceId: service.id,
            serviceName: service.name,
            serviceType: service.type,
            currentCost: parseFloat(subscription.monthlyCost),
            utilization: {
              data: parseFloat(dataUtilization.toFixed(2)),
              voice: parseFloat(voiceUtilization.toFixed(2))
            },
            potentialSavings: parseFloat((subscription.monthlyCost * 0.3).toFixed(2)), // Estimated savings
            recommendation: `Consider downgrading this service due to low utilization (${dataUtilization.toFixed(0)}% data, ${voiceUtilization.toFixed(0)}% voice)`
          });
        }
        
        // Identify quantity optimizations for multiple subscriptions
        if (subscription.quantity > 1 && usage.usageCount < subscription.quantity) {
          const unusedQuantity = subscription.quantity - usage.usageCount;
          const potentialSavings = parseFloat((service.monthlyCost * unusedQuantity).toFixed(2));
          
          recommendations.push({
            type: 'quantity',
            subscriptionId: subscription.id,
            customerId: customer.id,
            customerName: customer.companyName,
            serviceId: service.id,
            serviceName: service.name,
            serviceType: service.type,
            currentQuantity: subscription.quantity,
            usedQuantity: usage.usageCount,
            currentCost: parseFloat(subscription.monthlyCost),
            potentialSavings,
            recommendation: `Consider reducing quantity from ${subscription.quantity} to ${usage.usageCount} to save ${potentialSavings} per month`
          });
        }
        
        // Identify billing cycle optimizations
        if (subscription.billingCycle === 'monthly' && subscription.autoRenew) {
          const annualDiscount = parseFloat((subscription.monthlyCost * subscription.quantity * 1.2).toFixed(2));
          
          recommendations.push({
            type: 'billing',
            subscriptionId: subscription.id,
            customerId: customer.id,
            customerName: customer.companyName,
            serviceId: service.id,
            serviceName: service.name,
            serviceType: service.type,
            currentBillingCycle: subscription.billingCycle,
            recommendedBillingCycle: 'annually',
            currentCost: parseFloat((subscription.monthlyCost * subscription.quantity * 12).toFixed(2)),
            potentialSavings: annualDiscount,
            recommendation: `Switch to annual billing to save approximately ${annualDiscount} per year`
          });
        }
      });
      
      // Calculate total potential savings
      const totalPotentialSavings = recommendations.reduce((total, rec) => total + rec.potentialSavings, 0);
      
      return {
        success: true,
        data: {
          totalPotentialSavings: parseFloat(totalPotentialSavings.toFixed(2)),
          recommendationCount: recommendations.length,
          recommendations
        }
      };
    } catch (error) {
      console.error('Error in analytics service - getCostOptimization:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get dashboard summary data
   * @param {Object} options - Query parameters
   * @returns {Promise<Object>} Dashboard summary data
   */
  async getDashboardSummary(options = {}) {
    try {
      const { customerId } = options;
      
      // Build where clause
      const whereClause = {};
      if (customerId) {
        whereClause.customerId = customerId;
      }
      
      // Get customer count
      const customerCount = await Customer.count({
        where: whereClause
      });
      
      // Get active subscription count
      const activeSubscriptionCount = await Subscription.count({
        where: {
          ...whereClause,
          status: 'active'
        }
      });
      
      // Get service type distribution
      const serviceDistribution = await Subscription.findAll({
        attributes: [
          'Service.type',
          [Sequelize.fn('COUNT', Sequelize.col('Subscription.id')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('Subscription.monthlyCost')), 'totalCost']
        ],
        where: {
          ...whereClause,
          status: 'active'
        },
        include: [{
          model: Service,
          attributes: []
        }],
        group: ['Service.type']
      });
      
      // Format service distribution
      const formattedServiceDistribution = serviceDistribution.map(item => ({
        type: item.get('type'),
        count: parseInt(item.get('count')),
        totalCost: parseFloat(item.get('totalCost')) || 0
      }));
      
      // Get monthly cost trend (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const monthlyCostTrend = await Billing.findAll({
        attributes: [
          [Sequelize.fn('YEAR', Sequelize.col('billingDate')), 'year'],
          [Sequelize.fn('MONTH', Sequelize.col('billingDate')), 'month'],
          [Sequelize.fn('SUM', Sequelize.col('totalAmount')), 'totalCost']
        ],
        where: {
          ...whereClause,
          billingDate: { [Op.gte]: sixMonthsAgo }
        },
        group: [
          Sequelize.fn('YEAR', Sequelize.col('billingDate')),
          Sequelize.fn('MONTH', Sequelize.col('billingDate'))
        ],
        order: [
          [Sequelize.fn('YEAR', Sequelize.col('billingDate')), 'ASC'],
          [Sequelize.fn('MONTH', Sequelize.col('billingDate')), 'ASC']
        ]
      });
      
      // Format monthly cost trend
      const formattedMonthlyCostTrend = monthlyCostTrend.map(item => ({
        period: \`\${item.get('year')}-\${item.get('month')}\`,
        totalCost: parseFloat(item.get('totalCost')) || 0
      }));
      
      // Get total monthly cost
      const totalMonthlyCost = await Subscription.sum('monthlyCost', {
        where: {
          ...whereClause,
          status: 'active'
        }
      });
      
      // Get cost optimization recommendations (simplified)
      const optimizationResult = await this.getCostOptimization(options);
      const optimizationData = optimizationResult.success ? optimizationResult.data : { 
        totalPotentialSavings: 0,
        recommendationCount: 0
      };
      
      return {
        success: true,
        data: {
          customerCount,
          activeSubscriptionCount,
          totalMonthlyCost: parseFloat(totalMonthlyCost) || 0,
          potentialSavings: optimizationData.totalPotentialSavings,
          recommendationCount: optimizationData.recommendationCount,
          serviceDistribution: formattedServiceDistribution,
          monthlyCostTrend: formattedMonthlyCostTrend
        }
      };
    } catch (error) {
      console.error('Error in analytics service - getDashboardSummary:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export a singleton instance
export default new AnalyticsService();
