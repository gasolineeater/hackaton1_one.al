import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Container,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  Alert,
  Checkbox,
  FormControlLabel,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Facebook,
  Google,
  LinkedIn,
  ArrowForward,
  BusinessCenter,
  Speed,
  Security
} from '@mui/icons-material';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Show error message if login fails
  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    const success = await login(email, password, rememberMe);
    if (success) {
      navigate('/');
    }
  };

  const handleCloseError = () => {
    setShowError(false);
    clearError();
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
          src="/placeholder-logo.png" // Replace with actual ONE Albania logo
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
              <Typography variant="h4" component="h1" gutterBottom className="mont-bold" color="primary">
                Welcome Back
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" paragraph className="co-text">
                Log in to your ONE Albania SME Dashboard
              </Typography>

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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Remember me"
                  />
                  <Link href="#" variant="body2" color="primary" underline="hover">
                    Forgot password?
                  </Link>
                </Box>

                {error && (
                  <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={handleCloseError}
                  >
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 2, mb: 3, py: 1.5 }}
                  className="mont-semibold"
                  disabled={isLoading || !email || !password}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Log In'
                  )}
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                  <IconButton color="primary" sx={{ bgcolor: 'rgba(106, 27, 154, 0.08)' }}>
                    <Google />
                  </IconButton>
                  <IconButton color="primary" sx={{ bgcolor: 'rgba(106, 27, 154, 0.08)' }}>
                    <Facebook />
                  </IconButton>
                  <IconButton color="primary" sx={{ bgcolor: 'rgba(106, 27, 154, 0.08)' }}>
                    <LinkedIn />
                  </IconButton>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link href="#" color="primary" underline="hover" className="mont-semibold">
                      Contact Sales
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Side - Image and Features */}
          {!isMobile && (
            <Grid item xs={12} md={6}>
              {/* Space for animation/image */}
              <Box sx={{
                height: 300,
                bgcolor: 'rgba(106, 27, 154, 0.05)',
                borderRadius: 2,
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="h6" color="text.secondary">
                  {/* This would be replaced with an actual image or animation */}
                  Image or Animation Placeholder
                </Typography>
              </Box>

              {/* Features */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom className="mont-semibold" color="primary">
                    Why Choose ONE Albania Business?
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card elevation={0} sx={{ bgcolor: 'rgba(106, 27, 154, 0.03)', height: '100%' }}>
                    <CardContent>
                      <BusinessCenter color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6" component="div" className="mont-semibold">
                        Business Solutions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tailored telecom packages for businesses of all sizes
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card elevation={0} sx={{ bgcolor: 'rgba(106, 27, 154, 0.03)', height: '100%' }}>
                    <CardContent>
                      <Speed color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6" component="div" className="mont-semibold">
                        Fast Performance
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        High-speed connectivity and reliable network coverage
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card elevation={0} sx={{ bgcolor: 'rgba(106, 27, 154, 0.03)', height: '100%' }}>
                    <CardContent>
                      <Security color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6" component="div" className="mont-semibold">
                        Secure Platform
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Enterprise-grade security for your business communications
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          )}
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
          borderTop: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} ONE Albania. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Link href="#" color="inherit" sx={{ mx: 1 }}>
                Privacy Policy
              </Link>
              <Link href="#" color="inherit" sx={{ mx: 1 }}>
                Terms of Service
              </Link>
              <Link href="#" color="inherit" sx={{ mx: 1 }}>
                Contact Us
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage;
