import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

// Components
import Layout from './components/Dashboard/Layout';
import DashboardHome from './components/Dashboard/DashboardHome';
import ServiceOverview from './components/ServiceOverview/ServiceOverview';
import CostControl from './components/CostControl/CostControl';
import ServiceManagement from './components/ServiceManagement/ServiceManagement';
import Analytics from './components/Analytics/Analytics';
import AIRecommendations from './components/AIRecommendations/AIRecommendations';
import LoginPage from './components/Login/LoginPage';
import LogoutPage from './components/Logout/LogoutPage';
import MyAccountPage from './components/MyAccount/MyAccountPage';
import NotificationsPage from './components/Notifications/NotificationsPage';
import SettingsPage from './components/Settings/SettingsPage';

// Context Providers
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ServiceProvider } from './contexts/ServiceContext';

// Create a custom theme
const theme = createTheme({
  palette: {
    mode: 'light',
    common: {
      black: '#000000',
      white: '#ffffff',
    },
    primary: {
      main: '#6A1B9A', // ONE Albania violet/purple
      light: '#9C4DCC',
      dark: '#38006b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9575CD', // ONE Albania lighter purple
      light: '#C7A4FF',
      dark: '#65499C',
      contrastText: '#ffffff',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#ffffff',
    },
    info: {
      main: '#7E57C2', // Purple-tinted info color
      light: '#B085F5',
      dark: '#4D2C91',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8F9FA', // ONE Albania light background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#999999',
    },
    grey: {
      50: '#F8F9FA',
      100: '#F1F3F5',
      200: '#E9ECEF',
      300: '#DEE2E6',
      400: '#CED4DA',
      500: '#ADB5BD',
      600: '#6C757D',
      700: '#495057',
      800: '#343A40',
      900: '#212529',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: '"Montserrat", "Inter", sans-serif',
    h1: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
    },
    h2: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: '"Inter", sans-serif',
    },
    subtitle2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 300,
    },
    button: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 300,
    },
    overline: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4, // ONE Albania uses slightly rounded buttons
          padding: '10px 24px',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          fontFamily: '"Montserrat", sans-serif',
          '&:hover': {
            boxShadow: 'none',
            opacity: 0.9,
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            backgroundColor: '#6A1B9A', // ONE Albania violet/purple
            color: '#FFFFFF',
          },
          '&.MuiButton-containedSecondary': {
            backgroundColor: '#9575CD', // ONE Albania lighter purple
            color: '#FFFFFF',
          },
          '&.MuiButton-containedWarning': {
            backgroundColor: '#FF9800',
            color: '#FFFFFF',
          },
          '&.MuiButton-containedSuccess': {
            backgroundColor: '#4CAF50',
            color: '#FFFFFF',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
          '&.MuiButton-outlinedPrimary': {
            borderColor: '#6A1B9A',
            color: '#6A1B9A',
            '&:hover': {
              backgroundColor: 'rgba(106, 27, 154, 0.08)',
            },
          },
          '&.MuiButton-outlinedSecondary': {
            borderColor: '#9575CD',
            color: '#9575CD',
            '&:hover': {
              backgroundColor: 'rgba(149, 117, 205, 0.08)',
            },
          },
        },
        text: {
          '&.MuiButton-textPrimary': {
            color: '#6A1B9A',
            '&:hover': {
              backgroundColor: 'rgba(106, 27, 154, 0.08)',
            },
          },
          '&.MuiButton-textSecondary': {
            color: '#9575CD',
            '&:hover': {
              backgroundColor: 'rgba(149, 117, 205, 0.08)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8, // ONE Albania uses slightly rounded corners
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          transition: 'box-shadow 0.2s ease',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8, // ONE Albania uses slightly rounded corners
          boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.05)',
        },
        elevation0: {
          boxShadow: 'none',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.1)',
        },
        colorPrimary: {
          backgroundColor: '#6A1B9A', // ONE Albania violet/purple
          color: 'white',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4, // ONE Albania uses slightly rounded corners
          fontWeight: 500,
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.75rem',
        },
        colorPrimary: {
          backgroundColor: '#6A1B9A', // ONE Albania violet/purple
        },
        colorSecondary: {
          backgroundColor: '#9575CD', // ONE Albania lighter purple
        },
        colorSuccess: {
          backgroundColor: '#4CAF50',
        },
        colorWarning: {
          backgroundColor: '#FF9800',
        },
        colorError: {
          backgroundColor: '#F44336',
        },
        outlinedPrimary: {
          borderColor: '#6A1B9A',
          color: '#6A1B9A',
        },
        outlinedSecondary: {
          borderColor: '#9575CD',
          color: '#9575CD',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          fontFamily: '"Montserrat", sans-serif',
          '&.Mui-selected': {
            color: '#6A1B9A', // ONE Albania violet/purple
          },
          '&:hover': {
            color: '#6A1B9A',
            opacity: 0.8,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#F2F2F2',
          fontFamily: '"Montserrat", sans-serif',
        },
        body: {
          fontFamily: '"Inter", sans-serif',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 2, // ONE Albania uses slightly rounded corners
          height: 4, // Thinner progress bars
        },
        colorPrimary: {
          backgroundColor: 'rgba(106, 27, 154, 0.15)',
        },
        barColorPrimary: {
          backgroundColor: '#6A1B9A', // ONE Albania violet/purple
        },
        colorSecondary: {
          backgroundColor: 'rgba(149, 117, 205, 0.15)',
        },
        barColorSecondary: {
          backgroundColor: '#9575CD', // ONE Albania lighter purple
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 4, // ONE Albania uses slightly rounded corners
          padding: '6px 16px',
        },
        standardSuccess: {
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          color: '#4CAF50',
        },
        standardWarning: {
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          color: '#FF9800',
        },
        standardError: {
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          color: '#F44336',
        },
        standardInfo: {
          backgroundColor: 'rgba(106, 27, 154, 0.1)',
          color: '#6A1B9A', // ONE Albania violet/purple
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <ServiceProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/*" element={<ProtectedRoutes />} />
              </Routes>
            </Router>
          </ServiceProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Protected routes component that checks authentication
function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/service-overview" element={<ServiceOverview />} />
        <Route path="/cost-control" element={<CostControl />} />
        <Route path="/service-management" element={<ServiceManagement />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/ai-recommendations" element={<AIRecommendations />} />
        <Route path="/my-account" element={<MyAccountPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
