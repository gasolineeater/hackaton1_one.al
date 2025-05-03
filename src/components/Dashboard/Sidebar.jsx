import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PhoneInTalk as PhoneIcon,
  AttachMoney as MoneyIcon,
  Settings as SettingsIcon,
  BarChart as AnalyticsIcon,
  Lightbulb as AIIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Service Overview', icon: <PhoneIcon />, path: '/service-overview' },
  { text: 'Cost Control', icon: <MoneyIcon />, path: '/cost-control' },
  { text: 'Service Management', icon: <SettingsIcon />, path: '/service-management' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'AI Recommendations', icon: <AIIcon />, path: '/ai-recommendations' },
];

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const drawer = (
    <>
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        backgroundColor: 'white'
      }}>
        <BusinessIcon sx={{ color: '#6A1B9A' }} />
        <Typography variant="h6" component="div" sx={{
          flexGrow: 1,
          fontWeight: 'bold',
          color: '#6A1B9A' // ONE Albania violet/purple
        }} className="mont-bold">
          ONE Albania
        </Typography>
      </Box>
      <Typography variant="subtitle2" sx={{
        px: 2,
        py: 1,
        color: 'text.secondary',
        backgroundColor: '#f8f9fa'
      }} className="co-medium">
        SME Dashboard
      </Typography>
      <Divider />
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
                  '&:hover': {
                    backgroundColor: 'rgba(106, 27, 154, 0.08)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                borderRadius: '0',
                mx: 0,
                my: 0.5,
                paddingLeft: '16px',
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ className: "mont-medium" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            backgroundColor: '#f8f9fa',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            backgroundColor: '#f8f9fa',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
