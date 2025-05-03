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

// Export all services
export {
  authService,
  telecomService,
  aiRecommendationsService,
  getToken,
  getUser,
  setToken,
  setUser,
  removeToken,
  removeUser
};
