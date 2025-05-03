import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useServiceManagement } from '../../contexts/ServiceManagementContext';
import ServiceCard from './ServiceCard';

const ServiceManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [initializing, setInitializing] = useState(false);
  const [serviceDescriptions, setServiceDescriptions] = useState({});

  const {
    services,
    availableServices,
    serviceUsage,
    loading,
    error,
    fetchServices,
    fetchServiceUsage,
    initializeDefaultServices
  } = useServiceManagement();

  useEffect(() => {
    // Create a mapping of service names to descriptions
    if (availableServices.length > 0) {
      const descriptions = {};
      availableServices.forEach(service => {
        descriptions[service.name] = service.description;
      });
      setServiceDescriptions(descriptions);
    }
  }, [availableServices]);

  useEffect(() => {
    // Fetch service usage when component mounts
    fetchServiceUsage();
  }, [fetchServiceUsage]);

  const handleRefresh = () => {
    fetchServices();
    fetchServiceUsage();
  };

  const handleInitializeServices = async () => {
    setInitializing(true);
    try {
      await initializeDefaultServices();
    } finally {
      setInitializing(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Service Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Control and configure your telecom services.
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ mr: 1 }}
            disabled={loading}
          >
            Refresh
          </Button>
          {services.length === 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleInitializeServices}
              disabled={initializing}
            >
              {initializing ? <CircularProgress size={24} /> : 'Initialize Services'}
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="service management tabs">
          <Tab label="Services" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Usage" id="tab-1" aria-controls="tabpanel-1" />
        </Tabs>
      </Box>

      <div
        role="tabpanel"
        hidden={tabValue !== 0}
        id="tabpanel-0"
        aria-labelledby="tab-0"
      >
        {tabValue === 0 && (
          <>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
              </Box>
            ) : services.length === 0 ? (
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  No Services Found
                </Typography>
                <Typography variant="body1" paragraph>
                  You don't have any services configured yet. Click the "Initialize Services" button to set up default services.
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {services.map((service) => (
                  <Grid item xs={12} sm={6} md={4} key={service.id}>
                    <ServiceCard
                      service={service}
                      description={serviceDescriptions[service.name]}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </div>

      <div
        role="tabpanel"
        hidden={tabValue !== 1}
        id="tabpanel-1"
        aria-labelledby="tab-1"
      >
        {tabValue === 1 && (
          <>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
              </Box>
            ) : !serviceUsage ? (
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  No Usage Data
                </Typography>
                <Typography variant="body1">
                  There is no service usage data available. Try enabling some services first.
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Service Overview
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1">Total Lines:</Typography>
                        <Typography variant="body1" fontWeight="bold">{serviceUsage.totalLines}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1">Enabled Services:</Typography>
                        <Typography variant="body1" fontWeight="bold">{serviceUsage.enabledServices}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Active Services
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      {serviceUsage.serviceBreakdown.length === 0 ? (
                        <Typography variant="body1">No active services</Typography>
                      ) : (
                        serviceUsage.serviceBreakdown.map((service, index) => (
                          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body1">{service.name}:</Typography>
                            <Typography variant="body1" color="success.main">Enabled</Typography>
                          </Box>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {serviceUsage.lineDetails.map((line, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {line.phoneNumber} ({line.assignedTo})
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1">Plan:</Typography>
                          <Typography variant="body1" fontWeight="bold">{line.planName}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1">Active Services:</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {line.services.length > 0 ? line.services.join(', ') : 'None'}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </div>
    </Box>
  );
};

export default ServiceManagement;
