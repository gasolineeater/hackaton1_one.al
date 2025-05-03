import { Op } from 'sequelize';
import { Customer, Service, Subscription, Usage } from '../models/index.js';
import dataProcessingService from './dataProcessingService.js';

/**
 * Service for machine learning operations
 * Implements algorithms for pattern recognition and predictions
 */
class MLService {
  /**
   * Perform collaborative filtering for service recommendations
   * @param {number} customerId - Customer ID
   * @returns {Promise<Object>} Recommended services
   */
  async collaborativeFiltering(customerId) {
    try {
      // Get customer profile
      const customerResult = await dataProcessingService.extractCustomerFeatures(customerId);
      
      if (!customerResult.success) {
        return customerResult;
      }
      
      const customerProfile = customerResult.data;
      
      // Find similar customers
      const similarCustomers = await this.findSimilarCustomers(customerProfile);
      
      if (similarCustomers.length === 0) {
        return {
          success: true,
          data: {
            recommendedServices: []
          }
        };
      }
      
      // Get services used by similar customers but not by this customer
      const customerSubscriptions = await Subscription.findAll({
        where: {
          customerId,
          status: 'active'
        },
        attributes: ['serviceId']
      });
      
      const subscribedServiceIds = customerSubscriptions.map(sub => sub.serviceId);
      
      // Get services from similar customers
      const similarCustomerIds = similarCustomers.map(c => c.id);
      
      const similarCustomerSubscriptions = await Subscription.findAll({
        where: {
          customerId: { [Op.in]: similarCustomerIds },
          status: 'active',
          serviceId: { [Op.notIn]: subscribedServiceIds }
        },
        include: [Service],
        attributes: ['serviceId']
      });
      
      // Count service popularity among similar customers
      const servicePopularity = {};
      
      similarCustomerSubscriptions.forEach(sub => {
        const serviceId = sub.serviceId;
        if (!servicePopularity[serviceId]) {
          servicePopularity[serviceId] = {
            count: 0,
            service: sub.Service
          };
        }
        servicePopularity[serviceId].count += 1;
      });
      
      // Convert to array and sort by popularity
      const recommendedServices = Object.keys(servicePopularity).map(serviceId => ({
        serviceId: parseInt(serviceId),
        name: servicePopularity[serviceId].service.name,
        type: servicePopularity[serviceId].service.type,
        popularity: servicePopularity[serviceId].count / similarCustomers.length,
        price: servicePopularity[serviceId].service.price,
        features: servicePopularity[serviceId].service.features
      })).sort((a, b) => b.popularity - a.popularity);
      
      return {
        success: true,
        data: {
          recommendedServices: recommendedServices.slice(0, 5) // Top 5 recommendations
        }
      };
    } catch (error) {
      console.error('Error in collaborative filtering:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Find similar customers based on profile
   * @param {Object} customerProfile - Customer profile
   * @returns {Promise<Array>} Similar customers
   */
  async findSimilarCustomers(customerProfile) {
    try {
      // Find customers with similar business type and size
      const customers = await Customer.findAll({
        where: {
          id: { [Op.ne]: customerProfile.id }, // Exclude this customer
          businessType: customerProfile.businessType,
          employeeCount: {
            [Op.between]: [
              Math.max(1, customerProfile.employeeCount * 0.5), // 50% smaller
              customerProfile.employeeCount * 1.5 // 50% larger
            ]
          },
          status: 'active'
        },
        limit: 10
      });
      
      return customers;
    } catch (error) {
      console.error('Error finding similar customers:', error);
      return [];
    }
  }
  
  /**
   * Perform customer segmentation using clustering
   * @returns {Promise<Object>} Customer segments
   */
  async customerSegmentation() {
    try {
      // Get all active customers
      const customers = await Customer.findAll({
        where: {
          status: 'active'
        },
        include: [{
          model: Subscription,
          include: [Service]
        }]
      });
      
      if (customers.length === 0) {
        return {
          success: true,
          data: {
            segments: []
          }
        };
      }
      
      // Extract features for clustering
      const customerFeatures = [];
      
      for (const customer of customers) {
        // Calculate basic metrics
        const subscriptionCount = customer.Subscriptions.length;
        let totalMonthlyCost = 0;
        const serviceTypes = {};
        
        customer.Subscriptions.forEach(subscription => {
          totalMonthlyCost += subscription.monthlyCost || 0;
          
          const serviceType = subscription.Service.type;
          if (!serviceTypes[serviceType]) {
            serviceTypes[serviceType] = 0;
          }
          serviceTypes[serviceType] += 1;
        });
        
        // Create feature vector
        customerFeatures.push({
          id: customer.id,
          companyName: customer.companyName,
          businessType: customer.businessType,
          employeeCount: customer.employeeCount,
          subscriptionCount,
          totalMonthlyCost,
          serviceTypes,
          // Normalized features for clustering
          features: [
            customer.employeeCount / 1000, // Normalize employee count
            subscriptionCount / 10, // Normalize subscription count
            totalMonthlyCost / 5000 // Normalize monthly cost
          ]
        });
      }
      
      // Perform k-means clustering (simplified version)
      const k = Math.min(3, customerFeatures.length); // Number of clusters
      const segments = this.kMeansClustering(customerFeatures, k);
      
      return {
        success: true,
        data: {
          segments
        }
      };
    } catch (error) {
      console.error('Error in customer segmentation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Simplified k-means clustering algorithm
   * @param {Array} data - Data points with features
   * @param {number} k - Number of clusters
   * @returns {Array} Clusters
   */
  kMeansClustering(data, k) {
    if (data.length === 0 || !data[0].features) return [];
    
    // Initialize centroids randomly
    const centroids = [];
    const usedIndices = new Set();
    
    for (let i = 0; i < k; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * data.length);
      } while (usedIndices.has(randomIndex));
      
      usedIndices.add(randomIndex);
      centroids.push([...data[randomIndex].features]);
    }
    
    // Assign points to clusters
    const clusters = Array(k).fill().map(() => []);
    
    data.forEach(point => {
      let minDistance = Infinity;
      let clusterIndex = 0;
      
      centroids.forEach((centroid, index) => {
        const distance = this.euclideanDistance(point.features, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          clusterIndex = index;
        }
      });
      
      clusters[clusterIndex].push(point);
    });
    
    // Create segment descriptions
    return clusters.map((cluster, index) => {
      // Calculate average values for the cluster
      const avgEmployeeCount = cluster.reduce((sum, p) => sum + p.employeeCount, 0) / cluster.length;
      const avgSubscriptionCount = cluster.reduce((sum, p) => sum + p.subscriptionCount, 0) / cluster.length;
      const avgMonthlyCost = cluster.reduce((sum, p) => sum + p.totalMonthlyCost, 0) / cluster.length;
      
      // Count service types
      const serviceTypeCounts = {};
      cluster.forEach(customer => {
        Object.entries(customer.serviceTypes).forEach(([type, count]) => {
          if (!serviceTypeCounts[type]) {
            serviceTypeCounts[type] = 0;
          }
          serviceTypeCounts[type] += count;
        });
      });
      
      // Find dominant service type
      let dominantServiceType = 'none';
      let maxCount = 0;
      
      Object.entries(serviceTypeCounts).forEach(([type, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantServiceType = type;
        }
      });
      
      // Generate segment name and description
      let segmentName = '';
      let segmentDescription = '';
      
      if (avgMonthlyCost > 1000) {
        segmentName = 'Enterprise';
        segmentDescription = 'Large enterprises with high service usage';
      } else if (avgMonthlyCost > 500) {
        segmentName = 'Mid-Market';
        segmentDescription = 'Medium-sized businesses with moderate service usage';
      } else {
        segmentName = 'Small Business';
        segmentDescription = 'Small businesses with basic service needs';
      }
      
      if (dominantServiceType !== 'none') {
        segmentName += ` ${dominantServiceType.charAt(0).toUpperCase() + dominantServiceType.slice(1)} Users`;
        segmentDescription += ` primarily using ${dominantServiceType} services`;
      }
      
      return {
        segmentId: index + 1,
        segmentName,
        segmentDescription,
        customerCount: cluster.length,
        avgEmployeeCount: Math.round(avgEmployeeCount),
        avgSubscriptionCount: Math.round(avgSubscriptionCount * 10) / 10,
        avgMonthlyCost: Math.round(avgMonthlyCost * 100) / 100,
        dominantServiceType,
        customers: cluster.map(c => ({
          id: c.id,
          companyName: c.companyName,
          businessType: c.businessType,
          employeeCount: c.employeeCount,
          monthlyCost: c.totalMonthlyCost
        }))
      };
    });
  }
  
  /**
   * Calculate Euclidean distance between two points
   * @param {Array} point1 - First point
   * @param {Array} point2 - Second point
   * @returns {number} Distance
   */
  euclideanDistance(point1, point2) {
    let sum = 0;
    for (let i = 0; i < point1.length; i++) {
      sum += Math.pow(point1[i] - point2[i], 2);
    }
    return Math.sqrt(sum);
  }
  
  /**
   * Predict future usage using time series forecasting
   * @param {number} customerId - Customer ID
   * @param {Object} options - Prediction options
   * @returns {Promise<Object>} Usage predictions
   */
  async predictFutureUsage(customerId, options = {}) {
    try {
      const { 
        months = 3,
        serviceType = 'all'
      } = options;
      
      // Get historical usage data
      const usageResult = await dataProcessingService.extractUsageFeatures(customerId, {
        months: 6, // Use 6 months of historical data
        serviceType
      });
      
      if (!usageResult.success) {
        return usageResult;
      }
      
      const usageFeatures = usageResult.data;
      
      // Get customer subscriptions
      const subscriptions = await Subscription.findAll({
        where: {
          customerId,
          status: 'active'
        },
        include: [{
          model: Service,
          where: serviceType !== 'all' ? { type: serviceType } : {}
        }]
      });
      
      const subscriptionIds = subscriptions.map(sub => sub.id);
      
      if (subscriptionIds.length === 0) {
        return {
          success: false,
          error: 'No active subscriptions found'
        };
      }
      
      // Get monthly usage data for the past 6 months
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      
      const usageData = await Usage.findAll({
        where: {
          subscriptionId: { [Op.in]: subscriptionIds },
          date: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['date', 'ASC']]
      });
      
      // Group usage by month
      const monthlyUsage = {};
      
      usageData.forEach(usage => {
        const date = new Date(usage.date);
        const monthKey = \`\${date.getFullYear()}-\${date.getMonth() + 1}\`;
        
        if (!monthlyUsage[monthKey]) {
          monthlyUsage[monthKey] = {
            dataUsage: 0,
            voiceUsage: 0,
            smsUsage: 0,
            month: date.getMonth() + 1,
            year: date.getFullYear()
          };
        }
        
        monthlyUsage[monthKey].dataUsage += usage.dataUsage || 0;
        monthlyUsage[monthKey].voiceUsage += usage.voiceUsage || 0;
        monthlyUsage[monthKey].smsUsage += usage.smsUsage || 0;
      });
      
      // Convert to array and sort by date
      const monthlyUsageArray = Object.values(monthlyUsage).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });
      
      // Perform simple linear regression for prediction
      const dataUsagePredictions = this.linearRegressionForecast(
        monthlyUsageArray.map(m => m.dataUsage),
        months
      );
      
      const voiceUsagePredictions = this.linearRegressionForecast(
        monthlyUsageArray.map(m => m.voiceUsage),
        months
      );
      
      const smsUsagePredictions = this.linearRegressionForecast(
        monthlyUsageArray.map(m => m.smsUsage),
        months
      );
      
      // Generate prediction months
      const predictionMonths = [];
      const lastMonth = monthlyUsageArray.length > 0 ? monthlyUsageArray[monthlyUsageArray.length - 1] : { month: new Date().getMonth() + 1, year: new Date().getFullYear() };
      
      for (let i = 1; i <= months; i++) {
        let month = lastMonth.month + i;
        let year = lastMonth.year;
        
        while (month > 12) {
          month -= 12;
          year += 1;
        }
        
        predictionMonths.push({
          month,
          year
        });
      }
      
      // Combine predictions with months
      const predictions = predictionMonths.map((date, index) => ({
        month: date.month,
        year: date.year,
        dataUsage: Math.max(0, dataUsagePredictions[index]),
        voiceUsage: Math.max(0, voiceUsagePredictions[index]),
        smsUsage: Math.max(0, smsUsagePredictions[index])
      }));
      
      // Calculate growth rates
      const dataGrowthRate = usageFeatures.usageGrowthRate;
      const lastMonthData = monthlyUsageArray.length > 0 ? monthlyUsageArray[monthlyUsageArray.length - 1].dataUsage : 0;
      const predictedDataUsage = predictions.length > 0 ? predictions[predictions.length - 1].dataUsage : 0;
      const dataGrowthPercentage = lastMonthData > 0 ? ((predictedDataUsage - lastMonthData) / lastMonthData) * 100 : 0;
      
      return {
        success: true,
        data: {
          historicalUsage: monthlyUsageArray,
          predictions,
          growthRates: {
            dataGrowthRate: dataGrowthPercentage,
            dataGrowthTrend: dataGrowthRate > 0 ? 'increasing' : (dataGrowthRate < 0 ? 'decreasing' : 'stable')
          }
        }
      };
    } catch (error) {
      console.error('Error predicting future usage:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Perform linear regression forecast
   * @param {Array} data - Historical data points
   * @param {number} periods - Number of periods to forecast
   * @returns {Array} Forecasted values
   */
  linearRegressionForecast(data, periods) {
    if (data.length <= 1) {
      // Not enough data for regression, return flat forecast
      return Array(periods).fill(data.length > 0 ? data[0] : 0);
    }
    
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i); // Time indices
    
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = data.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + (val * data[i]), 0);
    const sumXX = x.reduce((sum, val) => sum + (val * val), 0);
    
    // Calculate slope (m) and y-intercept (b) of linear regression line
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Generate forecasts
    const forecasts = [];
    for (let i = 1; i <= periods; i++) {
      const forecastValue = intercept + slope * (n + i - 1);
      forecasts.push(forecastValue);
    }
    
    return forecasts;
  }
  
  /**
   * Detect anomalies in usage patterns
   * @param {number} customerId - Customer ID
   * @returns {Promise<Object>} Detected anomalies
   */
  async detectAnomalies(customerId) {
    try {
      // Get usage features
      const usageResult = await dataProcessingService.extractUsageFeatures(customerId, {
        months: 3
      });
      
      if (!usageResult.success) {
        return usageResult;
      }
      
      const usageFeatures = usageResult.data;
      
      // Get customer subscriptions
      const subscriptions = await Subscription.findAll({
        where: {
          customerId,
          status: 'active'
        },
        include: [Service]
      });
      
      const subscriptionIds = subscriptions.map(sub => sub.id);
      
      if (subscriptionIds.length === 0) {
        return {
          success: false,
          error: 'No active subscriptions found'
        };
      }
      
      // Get daily usage data for the past 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const usageData = await Usage.findAll({
        where: {
          subscriptionId: { [Op.in]: subscriptionIds },
          date: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['date', 'ASC']]
      });
      
      // Group usage by day
      const dailyUsage = {};
      
      usageData.forEach(usage => {
        const date = new Date(usage.date);
        const dateKey = date.toISOString().split('T')[0];
        
        if (!dailyUsage[dateKey]) {
          dailyUsage[dateKey] = {
            date: dateKey,
            dataUsage: 0,
            voiceUsage: 0,
            smsUsage: 0
          };
        }
        
        dailyUsage[dateKey].dataUsage += usage.dataUsage || 0;
        dailyUsage[dateKey].voiceUsage += usage.voiceUsage || 0;
        dailyUsage[dateKey].smsUsage += usage.smsUsage || 0;
      });
      
      // Convert to array and sort by date
      const dailyUsageArray = Object.values(dailyUsage).sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      
      // Detect anomalies using Z-score method
      const dataUsageValues = dailyUsageArray.map(d => d.dataUsage);
      const voiceUsageValues = dailyUsageArray.map(d => d.voiceUsage);
      const smsUsageValues = dailyUsageArray.map(d => d.smsUsage);
      
      const dataAnomalies = this.detectAnomaliesWithZScore(dataUsageValues, dailyUsageArray.map(d => d.date), 2.5);
      const voiceAnomalies = this.detectAnomaliesWithZScore(voiceUsageValues, dailyUsageArray.map(d => d.date), 2.5);
      const smsAnomalies = this.detectAnomaliesWithZScore(smsUsageValues, dailyUsageArray.map(d => d.date), 2.5);
      
      // Combine anomalies
      const anomalies = [
        ...dataAnomalies.map(a => ({ ...a, type: 'data' })),
        ...voiceAnomalies.map(a => ({ ...a, type: 'voice' })),
        ...smsAnomalies.map(a => ({ ...a, type: 'sms' }))
      ];
      
      return {
        success: true,
        data: {
          anomalies,
          anomalyCount: anomalies.length
        }
      };
    } catch (error) {
      console.error('Error detecting anomalies:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Detect anomalies using Z-score method
   * @param {Array} values - Data values
   * @param {Array} dates - Corresponding dates
   * @param {number} threshold - Z-score threshold
   * @returns {Array} Detected anomalies
   */
  detectAnomaliesWithZScore(values, dates, threshold) {
    if (values.length === 0) return [];
    
    // Calculate mean and standard deviation
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev === 0) return []; // No variation in data
    
    // Calculate Z-scores and find anomalies
    const anomalies = [];
    
    values.forEach((value, index) => {
      const zScore = (value - mean) / stdDev;
      
      if (Math.abs(zScore) > threshold) {
        anomalies.push({
          date: dates[index],
          value,
          zScore,
          direction: zScore > 0 ? 'high' : 'low',
          severity: Math.abs(zScore) > 3 ? 'high' : 'medium'
        });
      }
    });
    
    return anomalies;
  }
}

// Export a singleton instance
export default new MLService();
