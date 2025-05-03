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
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings as SettingsIcon
} from '@mui/icons-material';

const Header = ({ onDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState(null);

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

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#6A1B9A', // ONE Albania violet/purple
        color: 'white',
        boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

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
            <IconButton size="large" color="inherit">
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

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <a href="MyAccountPage"><MenuItem onClick={handleMenuClose}>Profile</MenuItem></a>
        <a href="MyAccountPage"><MenuItem onClick={handleMenuClose}>My account</MenuItem></a>
        <a href="MyAccountPage"><MenuItem onClick={handleMenuClose}>Logout</MenuItem></a>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 }
        }}
      >
        <MenuItem>
          <Box>
            <Typography variant="subtitle2">Data limit reached</Typography>
            <Typography variant="body2" color="text.secondary">Line +355 69 234 5678 has reached 90% of data limit</Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <Typography variant="subtitle2">Payment reminder</Typography>
            <Typography variant="body2" color="text.secondary">Your monthly invoice is due in 3 days</Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <Typography variant="subtitle2">New plan available</Typography>
            <Typography variant="body2" color="text.secondary">Check out our new Business Ultimate plan</Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <Typography variant="subtitle2">Service update</Typography>
            <Typography variant="body2" color="text.secondary">Roaming services have been activated</Typography>
          </Box>
        </MenuItem>
        <a href='NotificationsPage'><MenuItem>View all notifications</MenuItem></a>
      </Menu>
    </AppBar>
  );
};

export default Header;
