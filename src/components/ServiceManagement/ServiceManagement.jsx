import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Language as RoamingIcon,
  Phone as CallsIcon,
  Sms as SmsIcon,
  DataUsage as DataIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  History as HistoryIcon,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram
} from '@mui/icons-material';

const ServiceManagement = () => {
  // Mock data for services that can be enabled/disabled
  const initialServices = [
    {
      id: 1,
      name: 'International Roaming',
      description: 'Use your phone services while traveling abroad',
      icon: RoamingIcon,
      enabled: true,
      category: 'connectivity',
      lastChanged: '2023-06-15',
      restrictions: null,
      warningMessage: 'Enabling roaming may incur additional charges based on your destination'
    },
    {
      id: 2,
      name: 'International Calls',
      description: 'Make calls to international numbers',
      icon: CallsIcon,
      enabled: false,
      category: 'connectivity',
      lastChanged: '2023-05-22',
      restrictions: ['Europe', 'North America'],
      warningMessage: 'International call rates vary by country'
    },
    {
      id: 3,
      name: 'Premium SMS',
      description: 'Send and receive premium SMS services',
      icon: SmsIcon,
      enabled: false,
      category: 'messaging',
      lastChanged: '2023-04-10',
      restrictions: null,
      warningMessage: 'Premium SMS services may incur additional charges'
    },
    {
      id: 4,
      name: 'Data Sharing',
      description: 'Share your data plan with other devices',
      icon: DataIcon,
      enabled: true,
      category: 'data',
      lastChanged: '2023-06-01',
      restrictions: null,
      warningMessage: null
    },
    {
      id: 5,
      name: 'Content Filtering',
      description: 'Filter adult and inappropriate content',
      icon: SecurityIcon,
      enabled: true,
      category: 'security',
      lastChanged: '2023-03-15',
      restrictions: null,
      warningMessage: null
    },
    {
      id: 6,
      name: 'Usage Notifications',
      description: 'Receive notifications about your usage',
      icon: NotificationsIcon,
      enabled: true,
      category: 'notifications',
      lastChanged: '2023-05-05',
      restrictions: null,
      warningMessage: null
    }
  ];

  // State for managing services
  const [services, setServices] = useState(initialServices);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    service: null,
    newState: false
  });
  const [historyDialog, setHistoryDialog] = useState({
    open: false,
    serviceId: null
  });

  // Mock data for service change history
  const serviceHistory = [
    { id: 1, serviceId: 1, action: 'enabled', date: '2023-06-15', user: 'Admin' },
    { id: 2, serviceId: 1, action: 'disabled', date: '2023-05-30', user: 'Admin' },
    { id: 3, serviceId: 2, action: 'disabled', date: '2023-05-22', user: 'Admin' },
    { id: 4, serviceId: 3, action: 'disabled', date: '2023-04-10', user: 'Admin' },
    { id: 5, serviceId: 4, action: 'enabled', date: '2023-06-01', user: 'Admin' },
    { id: 6, serviceId: 5, action: 'enabled', date: '2023-03-15', user: 'Admin' },
    { id: 7, serviceId: 6, action: 'enabled', date: '2023-05-05', user: 'Admin' }
  ];

  // Handler for toggling service state
  const handleToggleService = (serviceId, newState) => {
    const service = services.find(s => s.id === serviceId);

    // If the service has a warning message and is being enabled, show confirmation dialog
    if (service.warningMessage && newState) {
      setConfirmDialog({
        open: true,
        service,
        newState
      });
    } else {
      // Otherwise, toggle the service directly
      updateServiceState(serviceId, newState);
    }
  };

  // Update service state after confirmation
  const updateServiceState = (serviceId, newState) => {
    setServices(prevServices =>
      prevServices.map(service =>
        service.id === serviceId
          ? { ...service, enabled: newState, lastChanged: new Date().toISOString().split('T')[0] }
          : service
      )
    );

    // Close dialog if open
    setConfirmDialog({ open: false, service: null, newState: false });
  };

  // Handler for showing service history
  const handleShowHistory = (serviceId) => {
    setHistoryDialog({
      open: true,
      serviceId
    });
  };

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  // Format category name for display
  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <Box>
      <Box sx={{
         mb: 2,
         mt: 9.5,
         background: 'linear-gradient(45deg, #6A1B9A 30%, #9575CD 90%)',
         backgroundClip: 'text',
         textFillColor: 'transparent',
         WebkitBackgroundClip: 'text',
         WebkitTextFillColor: 'transparent'
      }}>
        <Typography variant="h3" gutterBottom className="mont-bold" sx={{ textAlign: 'center' }}>
          Service Management
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mt: 1 }}>
          Enable or disable services for your telecom lines
        </Typography>
      </Box>

      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Special handling for connectivity and messaging in one row */}
        <Grid container spacing={10} sx={{ mb: 4 }}>
          {/* Connectivity Services */}
          <Grid item xs={12} md={5}>
            <Typography
              variant="h5"
              className="mont-semibold"
              sx={{
                color: '#6A1B9A',
                mb: 2,
                mt: 5,
                pb: 1,
                borderBottom: '1px solid rgba(106, 27, 154, 0.2)'
              }}
            >
              Connectivity Services
            </Typography>

            <Grid container spacing={4}>
              {servicesByCategory['connectivity'] && servicesByCategory['connectivity'].map((service) => (
                <Grid item xs={12} sm={6} key={service.id}>
                  <Card
                    elevation={2}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 0.2,
                      border: '1px solid',
                      borderColor: service.enabled ? 'rgba(106, 27, 154, 0.3)' : 'rgba(0, 0, 0, 0.12)',
                      bgcolor: service.enabled ? 'rgba(106, 27, 154, 0.03)' : 'transparent'
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            mr: 9,
                            bgcolor: service.enabled ? '#6A1B9A' : 'rgba(0, 0, 0, 0.12)',
                            color: 'white',
                            p: 1,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <service.icon />
                        </Box>
                        <Typography variant="h6" className="mont-semibold">
                          {service.name}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {service.description}
                      </Typography>

                      {service.restrictions && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Restrictions:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {service.restrictions.map((restriction, index) => (
                              <Chip
                                key={index}
                                label={restriction}
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(106, 27, 154, 0.1)',
                                  color: '#6A1B9A'
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={service.enabled}
                              onChange={(e) => handleToggleService(service.id, e.target.checked)}
                              color="primary"
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: '#6A1B9A'
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: '#6A1B9A'
                                }
                              }}
                            />
                          }
                          label={service.enabled ? 'Enabled' : 'Disabled'}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleShowHistory(service.id)}
                          sx={{ color: '#6A1B9A' }}
                        >
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ bgcolor: 'rgba(0, 0, 0, 0.03)', px: 2, py: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Last changed: {service.lastChanged}
                      </Typography>
                      {service.enabled && (
                        <Chip
                          size="small"
                          label="Active"
                          icon={<CheckIcon fontSize="small" />}
                          sx={{
                            ml: 'auto',
                            bgcolor: 'rgba(46, 125, 50, 0.1)',
                            color: '#2e7d32'
                          }}
                        />
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Messaging Services */}
          <Grid item xs={12} md={5} sx={{ ml: { md: 'auto' } }}>
            <Typography
              variant="h5"
              className="mont-semibold"
              sx={{
                color: '#6A1B9A',
                mb: 0,
                mt: 5,
                pb: 1,

                borderBottom: '1px solid rgba(106, 27, 154, 0.2)'
              }}
            >
              Messaging Services
            </Typography>

            <Grid container spacing={4}>
              {servicesByCategory['messaging'] && servicesByCategory['messaging'].map((service) => (
                <Grid item xs={12} key={service.id}>
                  <Card
                    elevation={2}
                    sx={{
                      height: { md: '100%' },
                      minHeight: { md: '263px' },
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 0.2,
                      border: '1px solid',
                      borderColor: service.enabled ? 'rgba(106, 27, 154, 0.3)' : 'rgba(0, 0, 0, 0.12)',
                      bgcolor: service.enabled ? 'rgba(106, 27, 154, 0.03)' : 'transparent'
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, py: { md: 4 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            mr: 9,
                            bgcolor: service.enabled ? '#6A1B9A' : 'rgba(0, 0, 0, 0.12)',
                            color: 'white',
                            p: 1,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <service.icon />
                        </Box>
                        <Typography variant="h6" className="mont-semibold">
                          {service.name}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {service.description}
                      </Typography>

                      {service.restrictions && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Restrictions:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {service.restrictions.map((restriction, index) => (
                              <Chip
                                key={index}
                                label={restriction}
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(106, 27, 154, 0.1)',
                                  color: '#6A1B9A'
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={service.enabled}
                              onChange={(e) => handleToggleService(service.id, e.target.checked)}
                              color="primary"
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: '#6A1B9A'
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: '#6A1B9A'
                                }
                              }}
                            />
                          }
                          label={service.enabled ? 'Enabled' : 'Disabled'}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleShowHistory(service.id)}
                          sx={{ color: '#6A1B9A' }}
                        >
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ bgcolor: 'rgba(0, 0, 0, 0.03)', px: 2, py: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Last changed: {service.lastChanged}
                      </Typography>
                      {service.enabled && (
                        <Chip
                          size="small"
                          label="Active"
                          icon={<CheckIcon fontSize="small" />}
                          sx={{
                            ml: 'auto',
                            bgcolor: 'rgba(46, 125, 50, 0.1)',
                            color: '#2e7d32'
                          }}
                        />
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Other Services in a Row */}
        <Grid container spacing={10} sx={{ mb: 4, mt: 12 }}>
          {Object.keys(servicesByCategory)
            .filter(category => category !== 'connectivity' && category !== 'messaging')
            .map((category) => (
              <Grid item xs={12} md={5} key={category} sx={{
                ...(category === 'data' ? { ml: 0 } : {}),
                ...(category === 'notifications' ? { ml: { md: 'auto' } } : {}),
                ...(category === 'security' ? { mx: { md: 'auto' } } : {})
              }}>
                <Typography
                  variant="h5"
                  className="mont-semibold"
                  sx={{
                    color: '#6A1B9A',
                    mb: 2,
                    pb: 1,
                    borderBottom: '1px solid rgba(106, 27, 154, 0.2)'
                  }}
                >
                  {formatCategoryName(category)} Services
                </Typography>

                <Grid container spacing={4}>
                  {servicesByCategory[category].map((service) => (
                    <Grid item xs={12} key={service.id}>
                      <Card
                        elevation={2}
                        sx={{
                          height: { md: '100%' },
                          minHeight: { md: '263px' },
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 0.2,
                          border: '1px solid',
                          borderColor: service.enabled ? 'rgba(106, 27, 154, 0.3)' : 'rgba(0, 0, 0, 0.12)',
                          bgcolor: service.enabled ? 'rgba(106, 27, 154, 0.03)' : 'transparent'
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box
                              sx={{
                                mr: 9,
                                bgcolor: service.enabled ? '#6A1B9A' : 'rgba(0, 0, 0, 0.12)',
                                color: 'white',
                                p: 1,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <service.icon />
                            </Box>
                            <Typography variant="h6" className="mont-semibold">
                              {service.name}
                            </Typography>
                          </Box>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {service.description}
                          </Typography>

                          {service.restrictions && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                Restrictions:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {service.restrictions.map((restriction, index) => (
                                  <Chip
                                    key={index}
                                    label={restriction}
                                    size="small"
                                    sx={{
                                      bgcolor: 'rgba(106, 27, 154, 0.1)',
                                      color: '#6A1B9A'
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={service.enabled}
                                  onChange={(e) => handleToggleService(service.id, e.target.checked)}
                                  color="primary"
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: '#6A1B9A'
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: '#6A1B9A'
                                    }
                                  }}
                                />
                              }
                              label={service.enabled ? 'Enabled' : 'Disabled'}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleShowHistory(service.id)}
                              sx={{ color: '#6A1B9A' }}
                            >
                              <HistoryIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </CardContent>

                        <CardActions sx={{ bgcolor: 'rgba(0, 0, 0, 0.03)', px: 2, py: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Last changed: {service.lastChanged}
                          </Typography>
                          {service.enabled && (
                            <Chip
                              size="small"
                              label="Active"
                              icon={<CheckIcon fontSize="small" />}
                              sx={{
                                ml: 'auto',
                                bgcolor: 'rgba(46, 125, 50, 0.1)',
                                color: '#2e7d32'
                              }}
                            />
                          )}
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
        </Grid>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog({ open: false, service: null, newState: false })}
        >
          <DialogTitle>Confirm Service Activation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon sx={{ color: 'warning.main', mr: 1 }} />
                {confirmDialog.service?.warningMessage}
              </Box>
              <Typography variant="body2">
                Are you sure you want to enable {confirmDialog.service?.name}?
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmDialog({ open: false, service: null, newState: false })}
              sx={{ color: '#6A1B9A' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => updateServiceState(confirmDialog.service?.id, confirmDialog.newState)}
              variant="contained"
              sx={{
                bgcolor: '#6A1B9A',
                '&:hover': { bgcolor: '#7B1FA2' },
                borderRadius: 0.2
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* History Dialog */}
        <Dialog
          open={historyDialog.open}
          onClose={() => setHistoryDialog({ open: false, serviceId: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Service History</DialogTitle>
          <DialogContent>
            <List>
              {serviceHistory
                .filter(history => history.serviceId === historyDialog.serviceId)
                .map(history => (
                  <ListItem key={history.id}>
                    <ListItemIcon>
                      {history.action === 'enabled' ? (
                        <CheckIcon sx={{ color: 'success.main' }} />
                      ) : (
                        <CloseIcon sx={{ color: 'error.main' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={`${history.action.charAt(0).toUpperCase() + history.action.slice(1)} on ${history.date}`}
                      secondary={`By: ${history.user}`}
                    />
                  </ListItem>
                ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setHistoryDialog({ open: false, serviceId: null })}
              sx={{ color: '#6A1B9A' }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 8,
          py: 6,
          bgcolor: 'primary.dark',
          color: 'white',
          borderRadius: 0,
          px: { xs: 2, sm: 3, md: 4 },
          mx: 0, // No margin for true edge-to-edge
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '1200px' }}>
          <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className="mont-bold" gutterBottom>
              ONE Albania Business
            </Typography>
            <Typography variant="body2" className="co-text" sx={{ mb: 2, opacity: 0.8 }}>
              Providing innovative telecom solutions for businesses of all sizes across Albania.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Instagram fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" className="mont-semibold" gutterBottom>
              Services
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Business Plans
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  International Roaming
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Internet Solutions
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Cloud Services
                </Button>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" className="mont-semibold" gutterBottom>
              Support
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Contact Us
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  FAQs
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Technical Support
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Network Status
                </Button>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" className="mont-semibold" gutterBottom>
              Company
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  About Us
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Careers
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  News
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Sustainability
                </Button>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" className="mont-semibold" gutterBottom>
              Legal
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Terms of Service
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Privacy Policy
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Cookie Policy
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Compliance
                </Button>
              </ListItem>
            </List>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" className="co-text" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} ONE Albania. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button color="inherit" size="small" sx={{ opacity: 0.7 }}>
              Sitemap
            </Button>
            <Button color="inherit" size="small" sx={{ opacity: 0.7 }}>
              Accessibility
            </Button>
            <Button color="inherit" size="small" sx={{ opacity: 0.7 }}>
              Cookie Settings
            </Button>
          </Box>
        </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ServiceManagement;
