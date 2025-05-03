/**
 * API Service for ONE Albania SME Dashboard
 * Handles all API requests to the backend server
 */

// API base URL from environment variables or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get authentication token from local storage
 * @returns {string|null} - JWT token or null if not found
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Set authentication token in local storage
 * @param {string} token - JWT token
 */
const setToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Remove authentication token from local storage
 */
const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Get authenticated user from local storage
 * @returns {Object|null} - User object or null if not found
 */
const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Set authenticated user in local storage
 * @param {Object} user - User object
 */
const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Remove authenticated user from local storage
 */
const removeUser = () => {
  localStorage.removeItem('user');
};

/**
 * Create request headers with authentication token if available
 * @param {boolean} includeContentType - Whether to include Content-Type header
 * @returns {Object} - Headers object
 */
const createHeaders = (includeContentType = true) => {
  const headers = {};

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Handle API response
 * @param {Response} response - Fetch API response
 * @returns {Promise} - Resolved with response data or rejected with error
 */
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      removeToken();
      removeUser();
      window.location.href = '/login-page';
    }

    const error = (data && data.message) || response.statusText;
    return Promise.reject(error);
  }

  return data;
};

/**
 * Authentication API
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Resolved with user data and token
   */
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(userData)
    });

    const data = await handleResponse(response);

    // Store token and user data
    if (data.accessToken) {
      setToken(data.accessToken);
      setUser(data);
    }

    return data;
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Resolved with user data and token
   */
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ email, password })
    });

    const data = await handleResponse(response);

    // Store token and user data
    if (data.accessToken) {
      setToken(data.accessToken);
      setUser(data);
    }

    return data;
  },

  /**
   * Logout user
   */
  logout: () => {
    removeToken();
    removeUser();
  },

  /**
   * Get current user profile
   * @returns {Promise} - Resolved with user profile data
   */
  getProfile: async () => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  }
};

/**
 * Telecom API
 */
const telecomService = {
  /**
   * Get all telecom lines
   * @param {Object} options - Query options (limit, offset, search, status)
   * @returns {Promise} - Resolved with telecom lines data
   */
  getLines: async (options = {}) => {
    const queryParams = new URLSearchParams();

    if (options.limit) queryParams.append('limit', options.limit);
    if (options.offset) queryParams.append('offset', options.offset);
    if (options.search) queryParams.append('search', options.search);
    if (options.status) queryParams.append('status', options.status);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(`${API_URL}/telecom/lines${queryString}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get telecom line by ID
   * @param {string} id - Telecom line ID
   * @returns {Promise} - Resolved with telecom line data
   */
  getLineById: async (id) => {
    const response = await fetch(`${API_URL}/telecom/lines/${id}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Create a new telecom line
   * @param {Object} lineData - Telecom line data
   * @returns {Promise} - Resolved with created telecom line
   */
  createLine: async (lineData) => {
    const response = await fetch(`${API_URL}/telecom/lines`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(lineData)
    });

    return handleResponse(response);
  },

  /**
   * Update telecom line
   * @param {string} id - Telecom line ID
   * @param {Object} lineData - Updated telecom line data
   * @returns {Promise} - Resolved with updated telecom line
   */
  updateLine: async (id, lineData) => {
    const response = await fetch(`${API_URL}/telecom/lines/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(lineData)
    });

    return handleResponse(response);
  },

  /**
   * Delete telecom line
   * @param {string} id - Telecom line ID
   * @returns {Promise} - Resolved with success message
   */
  deleteLine: async (id) => {
    const response = await fetch(`${API_URL}/telecom/lines/${id}`, {
      method: 'DELETE',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get all service plans
   * @returns {Promise} - Resolved with service plans data
   */
  getPlans: async () => {
    const response = await fetch(`${API_URL}/telecom/plans`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get service plan by ID
   * @param {string} id - Service plan ID
   * @returns {Promise} - Resolved with service plan data
   */
  getPlanById: async (id) => {
    const response = await fetch(`${API_URL}/telecom/plans/${id}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  }
};

/**
 * AI Recommendations API
 */
const aiRecommendationsService = {
  /**
   * Get all AI recommendations
   * @param {Object} options - Query options (limit, offset, priority, applied)
   * @returns {Promise} - Resolved with AI recommendations data
   */
  getRecommendations: async (options = {}) => {
    const queryParams = new URLSearchParams();

    if (options.limit) queryParams.append('limit', options.limit);
    if (options.offset) queryParams.append('offset', options.offset);
    if (options.priority) queryParams.append('priority', options.priority);
    if (options.applied !== undefined) queryParams.append('applied', options.applied);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(`${API_URL}/ai-recommendations${queryString}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get AI recommendation by ID
   * @param {string} id - AI recommendation ID
   * @returns {Promise} - Resolved with AI recommendation data
   */
  getRecommendationById: async (id) => {
    const response = await fetch(`${API_URL}/ai-recommendations/${id}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Generate new AI recommendations
   * @returns {Promise} - Resolved with generated recommendations
   */
  generateRecommendations: async () => {
    const response = await fetch(`${API_URL}/ai-recommendations/generate`, {
      method: 'POST',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Apply AI recommendation
   * @param {string} id - AI recommendation ID
   * @returns {Promise} - Resolved with updated AI recommendation
   */
  applyRecommendation: async (id) => {
    const response = await fetch(`${API_URL}/ai-recommendations/${id}/apply`, {
      method: 'PUT',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Dismiss AI recommendation
   * @param {string} id - AI recommendation ID
   * @returns {Promise} - Resolved with success message
   */
  dismissRecommendation: async (id) => {
    const response = await fetch(`${API_URL}/ai-recommendations/${id}`, {
      method: 'DELETE',
      headers: createHeaders()
    });

    return handleResponse(response);
  }
};

/**
 * Usage History API
 */
const usageHistoryService = {
  /**
   * Get usage history for a user
   * @param {Object} options - Query options (limit, offset, lineId, startYear, startMonth, endYear, endMonth)
   * @returns {Promise} - Resolved with usage history data
   */
  getUserUsageHistory: async (options = {}) => {
    const queryParams = new URLSearchParams();

    if (options.limit) queryParams.append('limit', options.limit);
    if (options.offset) queryParams.append('offset', options.offset);
    if (options.lineId) queryParams.append('lineId', options.lineId);
    if (options.startYear) queryParams.append('startYear', options.startYear);
    if (options.startMonth) queryParams.append('startMonth', options.startMonth);
    if (options.endYear) queryParams.append('endYear', options.endYear);
    if (options.endMonth) queryParams.append('endMonth', options.endMonth);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(`${API_URL}/usage-history${queryString}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get usage history for a specific line
   * @param {string} lineId - Telecom line ID
   * @param {Object} options - Query options (limit, offset, startYear, startMonth, endYear, endMonth)
   * @returns {Promise} - Resolved with usage history data
   */
  getLineUsageHistory: async (lineId, options = {}) => {
    const queryParams = new URLSearchParams();

    if (options.limit) queryParams.append('limit', options.limit);
    if (options.offset) queryParams.append('offset', options.offset);
    if (options.startYear) queryParams.append('startYear', options.startYear);
    if (options.startMonth) queryParams.append('startMonth', options.startMonth);
    if (options.endYear) queryParams.append('endYear', options.endYear);
    if (options.endMonth) queryParams.append('endMonth', options.endMonth);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(`${API_URL}/usage-history/line/${lineId}${queryString}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Create usage history record
   * @param {Object} historyData - Usage history data
   * @returns {Promise} - Resolved with created usage history
   */
  createUsageHistory: async (historyData) => {
    const response = await fetch(`${API_URL}/usage-history`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(historyData)
    });

    return handleResponse(response);
  },

  /**
   * Update usage history record
   * @param {string} id - Usage history ID
   * @param {Object} historyData - Updated usage history data
   * @returns {Promise} - Resolved with updated usage history
   */
  updateUsageHistory: async (id, historyData) => {
    const response = await fetch(`${API_URL}/usage-history/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(historyData)
    });

    return handleResponse(response);
  },

  /**
   * Delete usage history record
   * @param {string} id - Usage history ID
   * @returns {Promise} - Resolved with success message
   */
  deleteUsageHistory: async (id) => {
    const response = await fetch(`${API_URL}/usage-history/${id}`, {
      method: 'DELETE',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get aggregated usage data
   * @param {Object} options - Query options (groupBy, lineId, startYear, startMonth, endYear, endMonth)
   * @returns {Promise} - Resolved with aggregated usage data
   */
  getAggregatedUsage: async (options = {}) => {
    const queryParams = new URLSearchParams();

    if (options.groupBy) queryParams.append('groupBy', options.groupBy);
    if (options.lineId) queryParams.append('lineId', options.lineId);
    if (options.startYear) queryParams.append('startYear', options.startYear);
    if (options.startMonth) queryParams.append('startMonth', options.startMonth);
    if (options.endYear) queryParams.append('endYear', options.endYear);
    if (options.endMonth) queryParams.append('endMonth', options.endMonth);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(`${API_URL}/usage-history/aggregated${queryString}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Generate sample usage history data
   * @param {string} lineId - Telecom line ID
   * @param {number} months - Number of months to generate
   * @returns {Promise} - Resolved with generated usage history
   */
  generateSampleData: async (lineId, months = 6) => {
    const response = await fetch(`${API_URL}/usage-history/generate/${lineId}?months=${months}`, {
      method: 'POST',
      headers: createHeaders()
    });

    return handleResponse(response);
  }
};

/**
 * Analytics API
 */
const analyticsService = {
  /**
   * Get usage trends
   * @param {Object} options - Query options (period, groupBy, startYear, startMonth, endYear, endMonth)
   * @returns {Promise} - Resolved with usage trend data
   */
  getUsageTrends: async (options = {}) => {
    const queryParams = new URLSearchParams();

    if (options.period) queryParams.append('period', options.period);
    if (options.groupBy) queryParams.append('groupBy', options.groupBy);
    if (options.startYear) queryParams.append('startYear', options.startYear);
    if (options.startMonth) queryParams.append('startMonth', options.startMonth);
    if (options.endYear) queryParams.append('endYear', options.endYear);
    if (options.endMonth) queryParams.append('endMonth', options.endMonth);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(`${API_URL}/analytics/usage-trends${queryString}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get cost breakdown
   * @param {Object} options - Query options (period, startYear, startMonth, endYear, endMonth)
   * @returns {Promise} - Resolved with cost breakdown data
   */
  getCostBreakdown: async (options = {}) => {
    const queryParams = new URLSearchParams();

    if (options.period) queryParams.append('period', options.period);
    if (options.startYear) queryParams.append('startYear', options.startYear);
    if (options.startMonth) queryParams.append('startMonth', options.startMonth);
    if (options.endYear) queryParams.append('endYear', options.endYear);
    if (options.endMonth) queryParams.append('endMonth', options.endMonth);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(`${API_URL}/analytics/cost-breakdown${queryString}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get usage by line
   * @param {Object} options - Query options (period, startYear, startMonth, endYear, endMonth)
   * @returns {Promise} - Resolved with usage by line data
   */
  getUsageByLine: async (options = {}) => {
    const queryParams = new URLSearchParams();

    if (options.period) queryParams.append('period', options.period);
    if (options.startYear) queryParams.append('startYear', options.startYear);
    if (options.startMonth) queryParams.append('startMonth', options.startMonth);
    if (options.endYear) queryParams.append('endYear', options.endYear);
    if (options.endMonth) queryParams.append('endMonth', options.endMonth);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(`${API_URL}/analytics/usage-by-line${queryString}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get usage anomalies
   * @param {Object} options - Query options (threshold)
   * @returns {Promise} - Resolved with usage anomalies data
   */
  getUsageAnomalies: async (options = {}) => {
    const queryParams = new URLSearchParams();

    if (options.threshold) queryParams.append('threshold', options.threshold);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(`${API_URL}/analytics/usage-anomalies${queryString}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get cost optimization opportunities
   * @returns {Promise} - Resolved with cost optimization opportunities
   */
  getCostOptimizationOpportunities: async () => {
    const response = await fetch(`${API_URL}/analytics/cost-optimization`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Generate sample cost data
   * @param {number} months - Number of months to generate
   * @returns {Promise} - Resolved with generated cost data
   */
  generateSampleCostData: async (months = 6) => {
    const response = await fetch(`${API_URL}/analytics/generate-sample-cost?months=${months}`, {
      method: 'POST',
      headers: createHeaders()
    });

    return handleResponse(response);
  }
};

/**
 * Budget API
 */
const budgetService = {
  /**
   * Get all budgets
   * @param {Object} options - Query options (entityType, period)
   * @returns {Promise} - Resolved with budgets data
   */
  getAllBudgets: async (options = {}) => {
    const queryParams = new URLSearchParams();

    if (options.entityType) queryParams.append('entityType', options.entityType);
    if (options.period) queryParams.append('period', options.period);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(`${API_URL}/budget${queryString}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get budget by ID
   * @param {string} id - Budget ID
   * @returns {Promise} - Resolved with budget data
   */
  getBudgetById: async (id) => {
    const response = await fetch(`${API_URL}/budget/${id}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Create a new budget
   * @param {Object} budgetData - Budget data
   * @returns {Promise} - Resolved with created budget
   */
  createBudget: async (budgetData) => {
    const response = await fetch(`${API_URL}/budget`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(budgetData)
    });

    return handleResponse(response);
  },

  /**
   * Update budget
   * @param {string} id - Budget ID
   * @param {Object} budgetData - Updated budget data
   * @returns {Promise} - Resolved with updated budget
   */
  updateBudget: async (id, budgetData) => {
    const response = await fetch(`${API_URL}/budget/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(budgetData)
    });

    return handleResponse(response);
  },

  /**
   * Delete budget
   * @param {string} id - Budget ID
   * @returns {Promise} - Resolved with success message
   */
  deleteBudget: async (id) => {
    const response = await fetch(`${API_URL}/budget/${id}`, {
      method: 'DELETE',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Check budget thresholds
   * @returns {Promise} - Resolved with exceeded budgets
   */
  checkThresholds: async () => {
    const response = await fetch(`${API_URL}/budget/check/thresholds`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get spending summary
   * @param {string} period - Period ('monthly', 'quarterly', 'yearly')
   * @returns {Promise} - Resolved with spending summary
   */
  getSpendingSummary: async (period = 'monthly') => {
    const response = await fetch(`${API_URL}/budget/summary/spending?period=${period}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  }
};

/**
 * Cost Control API
 */
const costControlService = {
  /**
   * Get all cost breakdowns
   * @param {Object} options - Query options (year, month, limit, offset)
   * @returns {Promise} - Resolved with cost breakdowns data
   */
  getAllCostBreakdowns: async (options = {}) => {
    const queryParams = new URLSearchParams();

    if (options.year) queryParams.append('year', options.year);
    if (options.month) queryParams.append('month', options.month);
    if (options.limit) queryParams.append('limit', options.limit);
    if (options.offset) queryParams.append('offset', options.offset);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(`${API_URL}/cost-control/breakdowns${queryString}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get cost breakdown by ID
   * @param {string} id - Cost breakdown ID
   * @returns {Promise} - Resolved with cost breakdown data
   */
  getCostBreakdownById: async (id) => {
    const response = await fetch(`${API_URL}/cost-control/breakdowns/${id}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Generate cost breakdown for a month
   * @param {number} year - Year
   * @param {number} month - Month (1-12)
   * @returns {Promise} - Resolved with generated cost breakdown
   */
  generateCostBreakdown: async (year, month) => {
    const response = await fetch(`${API_URL}/cost-control/breakdowns/${year}/${month}`, {
      method: 'POST',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get cost trends
   * @param {number} months - Number of months to include
   * @returns {Promise} - Resolved with cost trends data
   */
  getCostTrends: async (months = 12) => {
    const response = await fetch(`${API_URL}/cost-control/trends?months=${months}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get cost breakdown by category
   * @param {number} year - Year
   * @param {number} month - Month (1-12)
   * @returns {Promise} - Resolved with cost breakdown by category
   */
  getCostByCategory: async (year, month) => {
    const response = await fetch(`${API_URL}/cost-control/by-category?year=${year}&month=${month}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get cost breakdown by line
   * @param {number} year - Year
   * @param {number} month - Month (1-12)
   * @returns {Promise} - Resolved with cost breakdown by line
   */
  getCostByLine: async (year, month) => {
    const response = await fetch(`${API_URL}/cost-control/by-line?year=${year}&month=${month}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get cost breakdown by department
   * @param {number} year - Year
   * @param {number} month - Month (1-12)
   * @returns {Promise} - Resolved with cost breakdown by department
   */
  getCostByDepartment: async (year, month) => {
    const response = await fetch(`${API_URL}/cost-control/by-department?year=${year}&month=${month}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Export financial report
   * @param {string} format - Export format ('csv', 'json')
   * @param {string} type - Report type ('monthly', 'line', 'department')
   * @param {number} year - Year
   * @param {number} month - Month (1-12, required for line and department reports)
   * @returns {Promise} - Resolved with download URL
   */
  exportFinancialReport: async (format = 'csv', type = 'monthly', year, month) => {
    const queryParams = new URLSearchParams();

    queryParams.append('format', format);
    queryParams.append('type', type);
    queryParams.append('year', year);

    if (month) {
      queryParams.append('month', month);
    }

    const queryString = queryParams.toString();

    // Use window.open to trigger file download
    window.open(`${API_URL}/cost-control/export?${queryString}`);

    return { success: true, message: 'Export initiated' };
  },

  /**
   * Get cost optimization recommendations
   * @returns {Promise} - Resolved with recommendations
   */
  getOptimizationRecommendations: async () => {
    const response = await fetch(`${API_URL}/cost-control/recommendations`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  }
};

/**
 * Notifications API
 */
const notificationsService = {
  /**
   * Get all notifications
   * @param {Object} options - Query options (limit, offset, read, type)
   * @returns {Promise} - Resolved with notifications data
   */
  getAllNotifications: async (options = {}) => {
    const queryParams = new URLSearchParams();

    if (options.limit) queryParams.append('limit', options.limit);
    if (options.offset) queryParams.append('offset', options.offset);
    if (options.read !== undefined) queryParams.append('read', options.read);
    if (options.type) queryParams.append('type', options.type);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(`${API_URL}/notifications${queryString}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get notification by ID
   * @param {string} id - Notification ID
   * @returns {Promise} - Resolved with notification data
   */
  getNotificationById: async (id) => {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Create a new notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise} - Resolved with created notification
   */
  createNotification: async (notificationData) => {
    const response = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(notificationData)
    });

    return handleResponse(response);
  },

  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   * @returns {Promise} - Resolved with updated notification
   */
  markAsRead: async (id) => {
    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} - Resolved with success message
   */
  markAllAsRead: async () => {
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Delete notification
   * @param {string} id - Notification ID
   * @returns {Promise} - Resolved with success message
   */
  deleteNotification: async (id) => {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Delete all notifications
   * @param {Object} options - Query options (read)
   * @returns {Promise} - Resolved with success message
   */
  deleteAllNotifications: async (options = {}) => {
    const queryParams = new URLSearchParams();

    if (options.read !== undefined) queryParams.append('read', options.read);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await fetch(`${API_URL}/notifications${queryString}`, {
      method: 'DELETE',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get unread notification count
   * @returns {Promise} - Resolved with unread count
   */
  getUnreadCount: async () => {
    const response = await fetch(`${API_URL}/notifications/unread-count`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Generate sample notifications
   * @param {number} count - Number of notifications to generate
   * @returns {Promise} - Resolved with generated notifications
   */
  generateSampleNotifications: async (count = 5) => {
    const response = await fetch(`${API_URL}/notifications/generate-sample?count=${count}`, {
      method: 'POST',
      headers: createHeaders()
    });

    return handleResponse(response);
  }
};

/**
 * Service Management API
 */
const serviceManagementService = {
  /**
   * Get all services
   * @returns {Promise} - Resolved with services data
   */
  getAllServices: async () => {
    const response = await fetch(`${API_URL}/service-management`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get service by ID
   * @param {string} id - Service ID
   * @returns {Promise} - Resolved with service data
   */
  getServiceById: async (id) => {
    const response = await fetch(`${API_URL}/service-management/${id}`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Create a new service
   * @param {Object} serviceData - Service data
   * @returns {Promise} - Resolved with created service
   */
  createService: async (serviceData) => {
    const response = await fetch(`${API_URL}/service-management`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(serviceData)
    });

    return handleResponse(response);
  },

  /**
   * Update service
   * @param {string} id - Service ID
   * @param {Object} serviceData - Updated service data
   * @returns {Promise} - Resolved with updated service
   */
  updateService: async (id, serviceData) => {
    const response = await fetch(`${API_URL}/service-management/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(serviceData)
    });

    return handleResponse(response);
  },

  /**
   * Delete service
   * @param {string} id - Service ID
   * @returns {Promise} - Resolved with success message
   */
  deleteService: async (id) => {
    const response = await fetch(`${API_URL}/service-management/${id}`, {
      method: 'DELETE',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Enable service
   * @param {string} id - Service ID
   * @returns {Promise} - Resolved with updated service
   */
  enableService: async (id) => {
    const response = await fetch(`${API_URL}/service-management/${id}/enable`, {
      method: 'PUT',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Disable service
   * @param {string} id - Service ID
   * @returns {Promise} - Resolved with updated service
   */
  disableService: async (id) => {
    const response = await fetch(`${API_URL}/service-management/${id}/disable`, {
      method: 'PUT',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get available services
   * @returns {Promise} - Resolved with available services
   */
  getAvailableServices: async () => {
    const response = await fetch(`${API_URL}/service-management/available`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Initialize default services
   * @returns {Promise} - Resolved with created services
   */
  initializeDefaultServices: async () => {
    const response = await fetch(`${API_URL}/service-management/initialize`, {
      method: 'POST',
      headers: createHeaders()
    });

    return handleResponse(response);
  },

  /**
   * Get service usage
   * @returns {Promise} - Resolved with service usage data
   */
  getServiceUsage: async () => {
    const response = await fetch(`${API_URL}/service-management/usage`, {
      method: 'GET',
      headers: createHeaders()
    });

    return handleResponse(response);
  }
};

// Export all services
export {
  authService,
  telecomService,
  aiRecommendationsService,
  usageHistoryService,
  analyticsService,
  budgetService,
  costControlService,
  notificationsService,
  serviceManagementService,
  getToken,
  getUser,
  setToken,
  setUser,
  removeToken,
  removeUser
};
