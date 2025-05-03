import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/service-overview" element={<ServiceOverview />} />
            <Route path="/cost-control" element={<CostControl />} />
            <Route path="/service-management" element={<ServiceManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai-recommendations" element={<AIRecommendations />} />
            <Route path="*" element={<DashboardHome />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
