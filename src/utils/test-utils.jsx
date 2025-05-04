import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { ServiceProvider } from '../contexts/ServiceContext';

// Create a custom theme for testing
const theme = createTheme({
  palette: {
    primary: {
      main: '#6A1B9A',
    },
  },
});

// Custom render function that includes providers
const customRender = (ui, options) => {
  const AllProviders = ({ children }) => {
    return (
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <NotificationProvider>
            <ServiceProvider>
              <BrowserRouter>
                {children}
              </BrowserRouter>
            </ServiceProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    );
  };

  return render(ui, { wrapper: AllProviders, ...options });
};

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };
