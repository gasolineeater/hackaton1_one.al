import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Tooltip,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  PhoneInTalk as PhoneIcon,
  AttachMoney as MoneyIcon,
  BarChart as AnalyticsIcon,
  Lightbulb as AIIcon,
  Business as BusinessIcon,
  Settings as ServiceManagementIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

// Navigation menu items
const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Service Overview', icon: <PhoneIcon />, path: '/service-overview' },
  { text: 'Cost Control', icon: <MoneyIcon />, path: '/cost-control' },
  { text: 'Service Management', icon: <ServiceManagementIcon />, path: '/service-management' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'AI Recommendations', icon: <AIIcon />, path: '/ai-recommendations' },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Get user data from auth context
  const { user, logout } = useAuth();

  // Get notifications from notification context
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#6A1B9A', // ONE Albania violet/purple
        color: 'white',
        boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.1)',
        borderRadius: 0,
        padding: 0,
        minHeight: '80px'
      }}
    >
      <Toolbar sx={{
        p: 0,
        m: 0,
        minHeight: '80px', // Set a fixed height for the toolbar
        '&.MuiToolbar-root': { paddingLeft: 0 },
        display: 'flex',
        alignItems: 'center' // Center items vertically
      }}>
        {/* Logo */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mr: 2,
          p: 0,
          ml: 0,
          position: 'relative',
          left: 0
        }}>
          <img
            src="/onelogo1.svg"
            alt="ONE Albania Logo"
            style={{
              height: '75px',
              marginLeft: '-8px', // Negative margin to pull it to the edge
              marginTop: 0,
              display: 'block'
            }}
          />
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleMobileMenuToggle}
          sx={{
            mr: 2,
            display: { md: 'none' },
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px'
            }
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Desktop Navigation */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          height: '100%'
        }}>
          {menuItems.map((item) => (
            <Button
              key={item.text}
              color="inherit"
              startIcon={item.icon}
              onClick={() => handleNavigation(item.path)}
              sx={{
                mx: 0.5,
                opacity: location.pathname === item.path ? 1 : 0.8,
                borderBottom: location.pathname === item.path ? '2px solid white' : '2px solid transparent',
                borderRadius: 0,
                paddingBottom: '6px',
                position: 'relative',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: location.pathname === item.path ? 0 : '50%',
                  width: location.pathname === item.path ? '100%' : 0,
                  height: '2px',
                  backgroundColor: 'white',
                  transition: 'all 0.3s ease',
                  transform: 'translateX(0)',
                  opacity: location.pathname === item.path ? 1 : 0
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  opacity: 1,
                  transform: 'translateY(-3px)',
                  borderRadius: '8px',
                  '&::before': {
                    width: '100%',
                    left: 0,
                    opacity: 1
                  }
                }
              }}
              className="mont-medium"
            >
              {item.text}
            </Button>
          ))}
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* User Actions */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          <Tooltip title="Notifications">
            <IconButton
              size="large"
              color="inherit"
              onClick={handleNotificationsMenuOpen}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px'
                }
              }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton
              size="large"
              color="inherit"
              onClick={() => navigate('/settings')}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px'
                }
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Account">
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px'
                }
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {user ? user.firstName.charAt(0) + user.lastName.charAt(0) : <AccountCircle />}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            backgroundColor: '#f8f9fa',
          }
        }}
      >
        <Box
          sx={{
            p: 0,
            pt: 1,
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            pl: 0
          }}
        >
          <img
            src="/onelogo1.svg"
            alt="ONE Albania Logo"
            style={{
              height: '75px',
              marginLeft: '-8px', // Negative margin to pull it to the edge
              marginTop: 0,
              display: 'block'
            }}
          />
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  py: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(106, 27, 154, 0.05)',
                    borderLeft: '3px solid #6A1B9A',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(106, 27, 154, 0.03)',
                    transform: 'translateX(5px)',
                    '&::after': {
                      width: '3px',
                      opacity: 1
                    }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: location.pathname === item.path ? '3px' : 0,
                    height: '100%',
                    backgroundColor: '#6A1B9A',
                    transition: 'all 0.3s ease',
                    opacity: location.pathname === item.path ? 1 : 0
                  }
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? '#6A1B9A' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography className="mont-medium">
                      {item.text}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {user && (
          <Box sx={{ px: 2, py: 1, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 50,
                height: 50,
                bgcolor: 'primary.main',
                mx: 'auto',
                mb: 1
              }}
            >
              {user.firstName.charAt(0) + user.lastName.charAt(0)}
            </Avatar>
            <Typography variant="subtitle1" className="mont-semibold">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
          </Box>
        )}
        <Divider />
        <MenuItem onClick={() => { handleMenuClose(); navigate('/my-account'); }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          handleMenuClose();
          logout();
          navigate('/login');
        }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: { width: 320, maxHeight: 400 }
          }
        }}
      >
        {notifications.length === 0 ? (
          <MenuItem>
            <Box sx={{ py: 1 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                No notifications
              </Typography>
            </Box>
          </MenuItem>
        ) : (
          <>
            {notifications.slice(0, 4).map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => {
                  markAsRead(notification.id);
                  handleNotificationsMenuClose();
                  navigate('/notifications');
                }}
                sx={{
                  backgroundColor: notification.read ? 'transparent' : 'rgba(106, 27, 154, 0.04)',
                }}
              >
                <Box>
                  <Typography variant="subtitle2" className="mont-medium">
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="co-text">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={() => { handleNotificationsMenuClose(); navigate('/notifications'); }}>
              <Typography color="primary" className="mont-medium" sx={{ width: '100%', textAlign: 'center' }}>
                View all notifications
              </Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </AppBar>
  );
};

export default Header;
