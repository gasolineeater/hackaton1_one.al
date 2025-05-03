import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError(typeof error === 'string' ? error : 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default'
    }}>
      {/* Header - Logo Area */}
      <Box sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'center',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        bgcolor: 'white'
      }}>
        <Box
          component="img"
          src="/one-albania-logo.svg"
          alt="ONE Albania"
          sx={{ height: 40 }}
        />
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 2,
                maxWidth: 500,
                mx: 'auto'
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom color="primary">
                Welcome Back
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" paragraph>
                Log in to your ONE Albania SME Dashboard
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
                  disabled={isLoading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Link href="#" variant="body2" color="primary">
                    Forgot password?
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Side - Info */}
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom color="primary">
                ONE Albania SME Dashboard
              </Typography>
              <Typography variant="body1" paragraph>
                Manage your telecom services efficiently with our comprehensive dashboard.
              </Typography>
              <Typography variant="body1" paragraph>
                Monitor usage, optimize costs, and get AI-powered recommendations to improve your business communications.
              </Typography>
              <Box
                component="img"
                src="/dashboard-preview.png"
                alt="Dashboard Preview"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  borderRadius: 2,
                  boxShadow: 3,
                  mt: 2
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'white',
          borderTop: '1px solid rgba(0, 0, 0, 0.05)',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} ONE Albania. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
