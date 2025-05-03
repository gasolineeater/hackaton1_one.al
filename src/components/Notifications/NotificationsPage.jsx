import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Button,
  Badge,
  Chip,
  Switch,
  FormControlLabel,
  FormGroup,
  Card,
  CardContent,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkEmailReadIcon,
  DataUsage as DataUsageIcon,
  CreditCard as CreditCardIcon,
  Campaign as CampaignIcon,
  Settings as SettingsIcon,
  PhoneAndroid as PhoneAndroidIcon
} from '@mui/icons-material';

// Sample notification data
const notifications = [
  {
    id: 1,
    type: 'alert',
    title: 'Data limit reached',
    message: 'Line +355 69 234 5678 has reached 90% of data limit',
    time: '2 hours ago',
    read: false,
    icon: <DataUsageIcon />,
    color: 'warning'
  },
  {
    id: 2,
    type: 'billing',
    title: 'Payment reminder',
    message: 'Your monthly invoice is due in 3 days',
    time: '1 day ago',
    read: false,
    icon: <CreditCardIcon />,
    color: 'info'
  },
  {
    id: 3,
    type: 'promo',
    title: 'New plan available',
    message: 'Check out our new Business Ultimate plan with unlimited data',
    time: '3 days ago',
    read: true,
    icon: <CampaignIcon />,
    color: 'primary'
  },
  {
    id: 4,
    type: 'alert',
    title: 'Service update',
    message: 'Roaming services have been activated for your business lines',
    time: '1 week ago',
    read: true,
    icon: <PhoneAndroidIcon />,
    color: 'success'
  },
  {
    id: 5,
    type: 'billing',
    title: 'Invoice available',
    message: 'Your invoice for May 2023 is now available for download',
    time: '2 weeks ago',
    read: true,
    icon: <CreditCardIcon />,
    color: 'info'
  }
];

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notifications-tabpanel-${index}`}
      aria-labelledby={`notifications-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const NotificationsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [notificationsList, setNotificationsList] = useState(notifications);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event, notification) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = () => {
    if (selectedNotification) {
      const updatedNotifications = notificationsList.map(notification =>
        notification.id === selectedNotification.id
          ? { ...notification, read: true }
          : notification
      );
      setNotificationsList(updatedNotifications);
      handleMenuClose();
    }
  };

  const handleDelete = () => {
    if (selectedNotification) {
      const updatedNotifications = notificationsList.filter(
        notification => notification.id !== selectedNotification.id
      );
      setNotificationsList(updatedNotifications);
      handleMenuClose();
    }
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notificationsList.map(notification => ({
      ...notification,
      read: true
    }));
    setNotificationsList(updatedNotifications);
  };

  const getFilteredNotifications = () => {
    if (tabValue === 0) return notificationsList;
    if (tabValue === 1) return notificationsList.filter(n => n.type === 'alert');
    if (tabValue === 2) return notificationsList.filter(n => n.type === 'billing');
    if (tabValue === 3) return notificationsList.filter(n => n.type === 'promo');
    return notificationsList;
  };

  const getIconByType = (notification) => {
    switch (notification.color) {
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'info':
        return <InfoIcon sx={{ color: 'info.main' }} />;
      case 'success':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'primary':
        return <NotificationsIcon sx={{ color: 'primary.main' }} />;
      default:
        return <NotificationsIcon sx={{ color: 'primary.main' }} />;
    }
  };

  const unreadCount = notificationsList.filter(n => !n.read).length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom className="mont-bold">
        Notifications
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }} className="co-text">
        Stay updated with alerts, billing information, and service updates
      </Typography>

      <Grid container spacing={4}>
        {/* Notifications List */}
        <Grid item xs={12} md={8}>
          <Paper elevation={1} sx={{ borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="notification tabs"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      All
                      {unreadCount > 0 && (
                        <Badge
                          badgeContent={unreadCount}
                          color="error"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  }
                  className="mont-medium"
                />
                <Tab label="Alerts" className="mont-medium" />
                <Tab label="Billing" className="mont-medium" />
                <Tab label="Promotions" className="mont-medium" />
              </Tabs>

              <Button
                variant="text"
                color="primary"
                onClick={handleMarkAllAsRead}
                startIcon={<MarkEmailReadIcon />}
                className="mont-medium"
                size="small"
                sx={{ mr: 1 }}
              >
                Mark All as Read
              </Button>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <NotificationsList
                notifications={getFilteredNotifications()}
                getIconByType={getIconByType}
                handleMenuOpen={handleMenuOpen}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <NotificationsList
                notifications={getFilteredNotifications()}
                getIconByType={getIconByType}
                handleMenuOpen={handleMenuOpen}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <NotificationsList
                notifications={getFilteredNotifications()}
                getIconByType={getIconByType}
                handleMenuOpen={handleMenuOpen}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <NotificationsList
                notifications={getFilteredNotifications()}
                getIconByType={getIconByType}
                handleMenuOpen={handleMenuOpen}
              />
            </TabPanel>
          </Paper>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SettingsIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" className="mont-semibold">
                Notification Settings
              </Typography>
            </Box>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom className="mont-semibold">
                  Delivery Methods
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={<Switch defaultChecked color="primary" />}
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked color="primary" />}
                    label="SMS Notifications"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked color="primary" />}
                    label="Push Notifications"
                  />
                </FormGroup>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom className="mont-semibold">
                  Notification Types
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={<Switch defaultChecked color="primary" />}
                    label="Usage Alerts"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked color="primary" />}
                    label="Billing Information"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked color="primary" />}
                    label="Service Updates"
                  />
                  <FormControlLabel
                    control={<Switch color="primary" />}
                    label="Promotional Offers"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked color="primary" />}
                    label="Security Alerts"
                  />
                </FormGroup>
              </CardContent>
            </Card>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                className="mont-medium"
              >
                Save Settings
              </Button>
            </Box>
          </Paper>

          {/* Space for future content like notification statistics */}
          <Box sx={{
            height: 200,
            bgcolor: 'rgba(106, 27, 154, 0.05)',
            borderRadius: 2,
            mt: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            p: 2
          }}>
            <Typography variant="subtitle1" color="primary" className="mont-semibold" gutterBottom>
              Notification Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              This space will show notification statistics and trends
              (Coming Soon)
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Notification Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMarkAsRead} disabled={selectedNotification?.read}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'primary.light', width: 24, height: 24 }}>
              <MarkEmailReadIcon fontSize="small" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Mark as read" />
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'error.light', width: 24, height: 24 }}>
              <DeleteIcon fontSize="small" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

// Notification List Component
const NotificationsList = ({ notifications, getIconByType, handleMenuOpen }) => {
  if (notifications.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No notifications to display
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {notifications.map((notification, index) => (
        <React.Fragment key={notification.id}>
          <ListItem
            alignItems="flex-start"
            secondaryAction={
              <IconButton edge="end" onClick={(e) => handleMenuOpen(e, notification)}>
                <MoreVertIcon />
              </IconButton>
            }
            sx={{
              bgcolor: notification.read ? 'transparent' : 'rgba(106, 27, 154, 0.04)',
              py: 2
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: `${notification.color}.light` }}>
                {getIconByType(notification)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" className="mont-semibold">
                    {notification.title}
                  </Typography>
                  {!notification.read && (
                    <Chip
                      label="New"
                      size="small"
                      color="primary"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                    sx={{ display: 'block', mb: 0.5 }}
                    className="co-text"
                  >
                    {notification.message}
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                  >
                    {notification.time}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default NotificationsPage;
