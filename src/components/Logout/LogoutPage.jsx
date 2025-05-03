import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const LogoutPage = () => {
  const { logout } = useAuth();

  useEffect(() => {
    // Perform logout
    logout();
  }, [logout]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        p: 3
      }}
    >
      <CircularProgress size={60} sx={{ mb: 3 }} />
      <Typography variant="h5" gutterBottom>
        Logging out...
      </Typography>
      <Typography variant="body1" color="text.secondary">
        You will be redirected to the login page.
      </Typography>
      
      {/* Redirect to login page after a short delay */}
      <Navigate to="/login" replace />
    </Box>
  );
};

export default LogoutPage;
