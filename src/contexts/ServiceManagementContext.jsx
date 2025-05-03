import React, { createContext, useState, useEffect, useContext } from 'react';
import { serviceManagementService } from '../services/api.service';
import { useAuth } from './AuthContext';

// Create service management context
const ServiceManagementContext = createContext();

/**
 * Service Management Provider Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Provider component
 */
export const ServiceManagementProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [serviceUsage, setServiceUsage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated } = useAuth();

  // Load services when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchServices();
      fetchAvailableServices();
    }
  }, [isAuthenticated]);

  /**
   * Fetch all services
   * @returns {Promise} - Resolved with services
   */
  const fetchServices = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await serviceManagementService.getAllServices();
      setServices(data);
      return data;
    } catch (error) {
      setError(error);
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch available services
   * @returns {Promise} - Resolved with available services
   */
  const fetchAvailableServices = async () => {
    if (!isAuthenticated) return;
    
    try {
      const data = await serviceManagementService.getAvailableServices();
      setAvailableServices(data);
      return data;
    } catch (error) {
      console.error('Error fetching available services:', error);
    }
  };

  /**
   * Fetch service usage
   * @returns {Promise} - Resolved with service usage data
   */
  const fetchServiceUsage = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await serviceManagementService.getServiceUsage();
      setServiceUsage(data);
      return data;
    } catch (error) {
      setError(error);
      console.error('Error fetching service usage:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initialize default services
   * @returns {Promise} - Resolved with created services
   */
  const initializeDefaultServices = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await serviceManagementService.initializeDefaultServices();
      await fetchServices();
      return data;
    } catch (error) {
      setError(error);
      console.error('Error initializing default services:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Enable service
   * @param {string} id - Service ID
   * @returns {Promise} - Resolved with updated service
   */
  const enableService = async (id) => {
    if (!isAuthenticated) return;
    
    try {
      const updatedService = await serviceManagementService.enableService(id);
      
      // Update services list
      setServices(prevServices =>
        prevServices.map(service =>
          service.id === id ? { ...service, status: 'enabled' } : service
        )
      );
      
      return updatedService;
    } catch (error) {
      console.error('Error enabling service:', error);
      throw error;
    }
  };

  /**
   * Disable service
   * @param {string} id - Service ID
   * @returns {Promise} - Resolved with updated service
   */
  const disableService = async (id) => {
    if (!isAuthenticated) return;
    
    try {
      const updatedService = await serviceManagementService.disableService(id);
      
      // Update services list
      setServices(prevServices =>
        prevServices.map(service =>
          service.id === id ? { ...service, status: 'disabled' } : service
        )
      );
      
      return updatedService;
    } catch (error) {
      console.error('Error disabling service:', error);
      throw error;
    }
  };

  /**
   * Toggle service status
   * @param {string} id - Service ID
   * @param {string} currentStatus - Current service status
   * @returns {Promise} - Resolved with updated service
   */
  const toggleService = async (id, currentStatus) => {
    if (currentStatus === 'enabled') {
      return disableService(id);
    } else {
      return enableService(id);
    }
  };

  // Context value
  const value = {
    services,
    availableServices,
    serviceUsage,
    loading,
    error,
    fetchServices,
    fetchAvailableServices,
    fetchServiceUsage,
    initializeDefaultServices,
    enableService,
    disableService,
    toggleService
  };

  return <ServiceManagementContext.Provider value={value}>{children}</ServiceManagementContext.Provider>;
};

/**
 * Custom hook to use service management context
 * @returns {Object} - Service management context value
 */
export const useServiceManagement = () => {
  const context = useContext(ServiceManagementContext);
  
  if (!context) {
    throw new Error('useServiceManagement must be used within a ServiceManagementProvider');
  }
  
  return context;
};

export default ServiceManagementContext;
