import React, { useEffect } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ExitToApp as LogoutIcon } from '@mui/icons-material';

const LogoutPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Automatically log out and redirect to login page after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      logout();
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh'
    }}>
      <Paper
        elevation={3}
        sx={{
          p: 5,
          borderRadius: 2,
          textAlign: 'center',
          maxWidth: 500,
          mx: 'auto'
        }}
      >
        <LogoutIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />

        <Typography variant="h4" gutterBottom className="mont-bold" color="primary">
          Logging Out
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph className="co-text" sx={{ mb: 4 }}>
          Thank you for using ONE Albania SME Dashboard. You are being logged out...
        </Typography>

        <CircularProgress size={40} sx={{ mb: 3 }} />

        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            Return to Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LogoutPage;
