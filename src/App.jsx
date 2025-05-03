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

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#e41e26', // ONE Albania red
      light: '#ff5f52',
      dark: '#a90000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1e88e5',
      light: '#6ab7ff',
      dark: '#005cb2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
    },
    error: {
      main: '#d32f2f',
      lighter: '#ffebee',
    },
    warning: {
      main: '#f57c00',
      lighter: '#fff3e0',
    },
    info: {
      main: '#0288d1',
      lighter: '#e1f5fe',
    },
    success: {
      main: '#388e3c',
      lighter: '#e8f5e9',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
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
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />

            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <DashboardHome />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/service-overview" element={
              <ProtectedRoute>
                <Layout>
                  <ServiceOverview />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/cost-control" element={
              <ProtectedRoute>
                <Layout>
                  <CostControl />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/service-management" element={
              <ProtectedRoute>
                <Layout>
                  <ServiceManagement />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/analytics" element={
              <ProtectedRoute>
                <Layout>
                  <Analytics />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/ai-recommendations" element={
              <ProtectedRoute>
                <Layout>
                  <AIRecommendations />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
