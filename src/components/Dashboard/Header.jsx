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
  Settings as ServiceManagementIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

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
        borderRadius: 0
      }}
    >
      <Toolbar>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <BusinessIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" className="mont-bold">
            ONE Albania
          </Typography>
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleMobileMenuToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {menuItems.map((item) => (
            <Button
              key={item.text}
              color="inherit"
              startIcon={item.icon}
              onClick={() => handleNavigation(item.path)}
              sx={{
                mx: 0.5,
                opacity: location.pathname === item.path ? 1 : 0.8,
                borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                borderRadius: 0,
                paddingBottom: '6px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  opacity: 1
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Notifications">
            <IconButton
              size="large"
              color="inherit"
              onClick={handleNotificationsMenuOpen}
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton
              size="large"
              color="inherit"
              onClick={() => navigate('/settings-page')}
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
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                <AccountCircle />
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
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <BusinessIcon sx={{ color: '#6A1B9A', mr: 1 }} />
          <Typography variant="h6" className="mont-bold" sx={{ color: '#6A1B9A' }}>
            ONE Albania
          </Typography>
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(106, 27, 154, 0.05)',
                    borderLeft: '3px solid #6A1B9A',
                  },
                  py: 1
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
        <MenuItem onClick={() => { handleMenuClose(); navigate('/my-account-page'); }}>Profile</MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate('/my-account-page'); }}>My account</MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate('/logout-page'); }}>Logout</MenuItem>
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
        <MenuItem onClick={() => { handleNotificationsMenuClose(); navigate('/notifications-page'); }}>
          <Box>
            <Typography variant="subtitle2" className="mont-medium">Data limit reached</Typography>
            <Typography variant="body2" color="text.secondary" className="co-text">Line +355 69 234 5678 has reached 90% of data limit</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => { handleNotificationsMenuClose(); navigate('/notifications-page'); }}>
          <Box>
            <Typography variant="subtitle2" className="mont-medium">Payment reminder</Typography>
            <Typography variant="body2" color="text.secondary" className="co-text">Your monthly invoice is due in 3 days</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => { handleNotificationsMenuClose(); navigate('/notifications-page'); }}>
          <Box>
            <Typography variant="subtitle2" className="mont-medium">New plan available</Typography>
            <Typography variant="body2" color="text.secondary" className="co-text">Check out our new Business Ultimate plan</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => { handleNotificationsMenuClose(); navigate('/notifications-page'); }}>
          <Box>
            <Typography variant="subtitle2" className="mont-medium">Service update</Typography>
            <Typography variant="body2" color="text.secondary" className="co-text">Roaming services have been activated</Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleNotificationsMenuClose(); navigate('/notifications-page'); }}>
          <Typography color="primary" className="mont-medium" sx={{ width: '100%', textAlign: 'center' }}>
            View all notifications
          </Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
