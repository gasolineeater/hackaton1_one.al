import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  IconButton,
  Slide,
  useTheme,
  useMediaQuery,
  Container,
  Skeleton,
  SwipeableDrawer,
  Tabs,
  Tab,
  Fade,
  Zoom,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  Warning,
  CheckCircle,
  PhoneInTalk,
  DataUsage,
  Message,
  Lightbulb,
  ArrowForward,
  ArrowBack,
  Info,
  Notifications,
  Help,
  MoreVert,
  KeyboardArrowRight,
  Speed,
  CloudDownload,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

import {
  telecomLines,
  usageHistory,
  costBreakdown,
  usageAlerts,
  aiRecommendations,
  servicePlans
} from '../../data/mockData';

const COLORS = ['#6A1B9A', '#9575CD', '#3F51B5', '#7E57C2', '#B39DDB'];

// Sample promotional banners
const promotionalBanners = [
  {
    id: 1,
    title: "Summer Business Offer",
    description: "Get 50% extra data on all business plans this summer!",
    imageUrl: "https://images.unsplash.com/photo-1596079890744-c1a0462d0975?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    buttonText: "Learn More",
    color: "#6A1B9A"
  },
  {
    id: 2,
    title: "New Business Ultimate Plan",
    description: "Unlimited data, calls, and premium support for your business",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    buttonText: "Explore Plan",
    color: "#3F51B5"
  },
  {
    id: 3,
    title: "International Roaming Package",
    description: "Stay connected with affordable roaming in over 100 countries",
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    buttonText: "View Details",
    color: "#9575CD"
  }
];

// Sample news and updates
const newsUpdates = [
  {
    id: 1,
    title: "Network Upgrade Complete",
    description: "We've upgraded our network infrastructure for faster speeds and better coverage.",
    date: "June 15, 2023",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "New Business App Features",
    description: "Our mobile app now includes real-time usage analytics and instant support.",
    date: "June 10, 2023",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Customer Support Hours Extended",
    description: "Business support is now available 24/7 for all premium customers.",
    date: "June 5, 2023",
    imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

const DashboardHome = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prevActiveStep) =>
        prevActiveStep === promotionalBanners.length - 1 ? 0 : prevActiveStep + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep === promotionalBanners.length - 1 ? 0 : prevActiveStep + 1
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep === 0 ? promotionalBanners.length - 1 : prevActiveStep - 1
    );
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box>
      {/* Welcome Banner with Carousel */}
      <Box
        sx={{
          mb: 4,
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          mx: { xs: -1, sm: -2, md: -3 },
          mt: { xs: -3, sm: -3, md: -3 }
        }}
      >
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={450} animation="wave" />
        ) : (
          <>
            {promotionalBanners.map((banner, index) => (
              <Fade in={activeStep === index} key={banner.id} timeout={500}>
                <Box
                  sx={{
                    display: activeStep === index ? 'block' : 'none',
                    position: 'relative'
                  }}
                >
                  <Box
                    sx={{
                      height: { xs: 350, sm: 400, md: 450 },
                      backgroundImage: `linear-gradient(to right, ${banner.color}CC, ${banner.color}33), url(${banner.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      px: { xs: 2, sm: 4, md: 6 }
                    }}
                  >
                    <Box sx={{
                      maxWidth: { xs: '100%', md: 600 },
                      color: 'white',
                      zIndex: 1,
                      width: '100%'
                    }}>
                      <Typography
                        variant="h2"
                        className="mont-bold"
                        gutterBottom
                        sx={{
                          fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                        }}
                      >
                        {banner.title}
                      </Typography>
                      <Typography
                        variant="h5"
                        className="co-text"
                        sx={{
                          mb: 4,
                          maxWidth: { xs: '100%', md: '80%' },
                          textShadow: '0 1px 5px rgba(0,0,0,0.2)',
                          fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }
                        }}
                      >
                        {banner.description}
                      </Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        className="mont-semibold"
                        sx={{
                          px: { xs: 3, sm: 4, md: 5 },
                          py: { xs: 1, sm: 1.5, md: 2 },
                          borderRadius: 2,
                          backgroundColor: 'white',
                          color: banner.color,
                          fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            transform: 'translateY(-3px)',
                            boxShadow: '0 8px 15px rgba(0,0,0,0.1)'
                          },
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}
                      >
                        {banner.buttonText}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Fade>
            ))}
            <Box
              sx={{
                position: 'absolute',
                bottom: { xs: 20, sm: 24, md: 30 },
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                zIndex: 2
              }}
            >
              {promotionalBanners.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: { xs: 12, sm: 14, md: 16 },
                    height: { xs: 12, sm: 14, md: 16 },
                    borderRadius: '50%',
                    mx: 1,
                    bgcolor: index === activeStep ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.2)',
                      bgcolor: index === activeStep ? 'white' : 'rgba(255, 255, 255, 0.7)'
                    },
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}
                  onClick={() => setActiveStep(index)}
                />
              ))}
            </Box>
            <IconButton
              sx={{
                position: 'absolute',
                left: { xs: 8, sm: 16, md: 24 },
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.5)',
                },
                zIndex: 2,
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 }
              }}
              onClick={handleBack}
            >
              <ArrowBack />
            </IconButton>
            <IconButton
              sx={{
                position: 'absolute',
                right: { xs: 8, sm: 16, md: 24 },
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.5)',
                },
                zIndex: 2,
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 }
              }}
              onClick={handleNext}
            >
              <ArrowForward />
            </IconButton>
          </>
        )}
      </Box>

      {/* Dashboard Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom className="mont-bold">
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" className="co-text" sx={{ mb: 2 }}>
          Welcome to your ONE Albania SME Dashboard. Here's an overview of your telecom services.
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" className="co-medium">
              Active Lines
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, mb: 1 }} className="mont-bold">
              {telecomLines.filter(line => line.status === 'active').length}
            </Typography>
            <Chip
              label="All operational"
              size="small"
              icon={<CheckCircle fontSize="small" />}
              color="success"
              variant="outlined"
            />
          </Paper>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" className="co-medium">
              Data Usage
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, mb: 1 }} className="mont-bold">
              42.5 GB
            </Typography>
            <Chip
              label="15% increase"
              size="small"
              icon={<TrendingUp fontSize="small" />}
              color="primary"
              variant="outlined"
            />
          </Paper>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" className="co-medium">
              Monthly Cost
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, mb: 1 }} className="mont-bold">
              €175
            </Typography>
            <Chip
              label="Under budget"
              size="small"
              icon={<CheckCircle fontSize="small" />}
              color="success"
              variant="outlined"
            />
          </Paper>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" className="co-medium">
              Active Alerts
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, mb: 1 }} className="mont-bold">
              {usageAlerts.length}
            </Typography>
            <Chip
              label="Needs attention"
              size="small"
              icon={<Warning fontSize="small" />}
              color="warning"
              variant="outlined"
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Usage Chart */}
        <Grid item xs={12} md={8}>
          <Card elevation={0}>
            <CardHeader
              title="Monthly Usage Trends"
              titleTypographyProps={{ className: "mont-semibold" }}
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={usageHistory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="data" name="Data (GB)" fill="#6A1B9A" />
                  <Bar dataKey="calls" name="Calls (hours)" fill="#9575CD" />
                  <Bar dataKey="sms" name="SMS (hundreds)" fill="#3F51B5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Cost Breakdown */}
        <Grid item xs={12} md={4}>
          <Card elevation={0}>
            <CardHeader
              title="Cost Breakdown"
              titleTypographyProps={{ className: "mont-semibold" }}
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Line Usage */}
        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardHeader
              title="Line Usage"
              titleTypographyProps={{ className: "mont-semibold" }}
            />
            <CardContent sx={{ px: { xs: 1, sm: 2 } }}>
              <List>
                {telecomLines.slice(0, 4).map((line) => (
                  <React.Fragment key={line.id}>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneInTalk color={line.status === 'active' ? 'primary' : 'disabled'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={line.phoneNumber}
                        secondary={`${line.assignedTo} - ${line.plan}`}
                      />
                      <Box sx={{ width: { xs: '30%', sm: '40%' } }}>
                        <LinearProgress
                          variant="determinate"
                          value={(line.currentUsage / line.monthlyLimit) * 100}
                          color={
                            (line.currentUsage / line.monthlyLimit) > 0.9
                              ? 'error'
                              : (line.currentUsage / line.monthlyLimit) > 0.7
                                ? 'warning'
                                : 'primary'
                          }
                          sx={{ borderRadius: 5, height: 8 }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ ml: 1, minWidth: { xs: 50, sm: 70 }, textAlign: 'right' }}>
                        {line.currentUsage}/{line.monthlyLimit} GB
                      </Typography>
                    </ListItem>
                    {telecomLines.indexOf(line) < telecomLines.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button variant="outlined" size="small" className="mont-medium">View All Lines</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Recommendations */}
        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardHeader
              title="AI Recommendations"
              titleTypographyProps={{ className: "mont-semibold" }}
              action={
                <Button
                  startIcon={<Lightbulb />}
                  color="primary"
                  size="small"
                  className="mont-medium"
                >
                  View All
                </Button>
              }
            />
            <CardContent sx={{ px: { xs: 1, sm: 2 } }}>
              <List>
                {aiRecommendations.slice(0, 3).map((rec) => (
                  <React.Fragment key={rec.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        <Lightbulb color={rec.priority === 'high' ? 'error' : 'primary'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={rec.title}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              Potential savings: €{rec.savingsAmount}/month
                            </Typography>
                            {` — ${rec.description}`}
                          </>
                        }
                      />
                    </ListItem>
                    {aiRecommendations.indexOf(rec) < aiRecommendations.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts */}
        <Grid item xs={12}>
          <Card elevation={0}>
            <CardHeader
              title="Recent Alerts"
              titleTypographyProps={{ className: "mont-semibold" }}
            />
            <CardContent>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {usageAlerts.map((alert) => {
                  const line = telecomLines.find(l => l.id === alert.lineId);
                  return (
                    <Grid item xs={12} sm={6} md={3} key={alert.id}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: { xs: 1.5, sm: 2 },
                          borderRadius: 2,
                          border: 1,
                          borderColor:
                            alert.severity === 'critical'
                              ? 'error.main'
                              : alert.severity === 'warning'
                                ? 'warning.main'
                                : 'info.main',
                          bgcolor:
                            alert.severity === 'critical'
                              ? 'error.lighter'
                              : alert.severity === 'warning'
                                ? 'warning.lighter'
                                : 'info.lighter',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {alert.type === 'data' && <DataUsage color="primary" sx={{ mr: 1 }} />}
                          {alert.type === 'billing' && <Warning color="error" sx={{ mr: 1 }} />}
                          {alert.type === 'roaming' && <PhoneInTalk color="info" sx={{ mr: 1 }} />}
                          <Typography variant="subtitle2">
                            {line?.phoneNumber}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                          {alert.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(alert.timestamp).toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* News & Updates Section */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h5" gutterBottom className="mont-bold">
          News & Updates
        </Typography>
        <Typography variant="body1" color="text.secondary" className="co-text" sx={{ mb: 3 }}>
          Stay informed about the latest ONE Albania services and announcements
        </Typography>

        <Grid container spacing={3}>
          {newsUpdates.map((news) => (
            <Grid item xs={12} sm={6} md={4} key={news.id}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${news.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <CardContent>
                  <Typography variant="caption" color="text.secondary" className="co-medium">
                    {news.date}
                  </Typography>
                  <Typography variant="h6" className="mont-semibold" gutterBottom>
                    {news.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="co-text">
                    {news.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    endIcon={<KeyboardArrowRight />}
                    color="primary"
                    className="mont-medium"
                  >
                    Read More
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Quick Access Tabs */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Card elevation={0}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Popular Services" className="mont-medium" />
              <Tab label="Support Resources" className="mont-medium" />
              <Tab label="Business Tools" className="mont-medium" />
              <Tab label="Promotions" className="mont-medium" />
            </Tabs>
          </Box>
          <Box sx={{ p: 3 }}>
            {selectedTab === 0 && (
              <Grid container spacing={2}>
                {servicePlans.map((plan) => (
                  <Grid item xs={12} sm={6} md={3} key={plan.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box>
                        <Typography variant="h6" className="mont-semibold" gutterBottom>
                          {plan.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="co-text">
                          {typeof plan.data === 'number' ? `${plan.data} GB` : plan.data} data, {plan.calls} calls
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="h6" color="primary" className="mont-bold">
                          €{plan.price}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          className="mont-medium"
                        >
                          Details
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            {selectedTab === 1 && (
              <Typography>Support resources content</Typography>
            )}
            {selectedTab === 2 && (
              <Typography>Business tools content</Typography>
            )}
            {selectedTab === 3 && (
              <Typography>Promotions content</Typography>
            )}
          </Box>
        </Card>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 8,
          py: 6,
          bgcolor: 'primary.dark',
          color: 'white',
          borderRadius: 2,
          px: 4
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className="mont-bold" gutterBottom>
              ONE Albania Business
            </Typography>
            <Typography variant="body2" className="co-text" sx={{ mb: 2, opacity: 0.8 }}>
              Providing innovative telecom solutions for businesses of all sizes across Albania.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Instagram fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" className="mont-semibold" gutterBottom>
              Services
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Business Plans
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  International Roaming
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Internet Solutions
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Cloud Services
                </Button>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" className="mont-semibold" gutterBottom>
              Support
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Contact Us
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  FAQs
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Technical Support
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Network Status
                </Button>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" className="mont-semibold" gutterBottom>
              Company
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  About Us
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Careers
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  News
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Sustainability
                </Button>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" className="mont-semibold" gutterBottom>
              Legal
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Terms of Service
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Privacy Policy
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Cookie Policy
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Compliance
                </Button>
              </ListItem>
            </List>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" className="co-text" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} ONE Albania. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button color="inherit" size="small" sx={{ opacity: 0.7 }}>
              Sitemap
            </Button>
            <Button color="inherit" size="small" sx={{ opacity: 0.7 }}>
              Accessibility
            </Button>
            <Button color="inherit" size="small" sx={{ opacity: 0.7 }}>
              Cookie Settings
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardHome;
