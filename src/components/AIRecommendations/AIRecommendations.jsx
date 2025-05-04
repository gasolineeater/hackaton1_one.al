import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Chip,
  IconButton,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  InsertChart as InsertChartIcon,
  Timeline as TimelineIcon,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram
} from '@mui/icons-material';

import { aiRecommendations } from '../../data/mockData';

// Mock data for AI insights
const insightData = [
  { category: 'Data Usage', optimized: 65, potential: 35, color: '#6A1B9A' },
  { category: 'Voice Usage', optimized: 80, potential: 20, color: '#9575CD' },
  { category: 'Service Plans', optimized: 50, potential: 50, color: '#B39DDB' },
  { category: 'Roaming', optimized: 40, potential: 60, color: '#7E57C2' }
];

const AIRecommendations = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [recommendations, setRecommendations] = useState(aiRecommendations);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleImplementRecommendation = (id) => {
    setRecommendations(
      recommendations.map(rec =>
        rec.id === id ? { ...rec, implemented: true } : rec
      )
    );
  };

  const handleDismissRecommendation = (id) => {
    setRecommendations(
      recommendations.filter(rec => rec.id !== id)
    );
  };

  const totalPotentialSavings = recommendations
    .filter(rec => !rec.implemented)
    .reduce((sum, rec) => sum + rec.savingsAmount, 0);

  return (
    <Box>
      {/* Navigation Buttons */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        mt: 5,
        mb: 3,
        px: 2,
        flexWrap: 'wrap',
        maxWidth: '1200px',
        mx: 'auto'
      }}>
        <Button
          variant="outlined"
          onClick={() => {
            const element = document.getElementById('ai-insights');
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }}
          sx={{
            color: '#6A1B9A',
            borderColor: '#6A1B9A',
            '&:hover': {
              backgroundColor: 'rgba(106, 27, 154, 0.04)',
              transform: 'translateY(-2px)',
            },
            borderRadius: 0.4,
            minWidth: '160px',
            px: 2,
            py: 0.8,
            transition: 'all 0.3s ease',
          }}
        >
          AI Insights
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            const element = document.getElementById('personalized-recommendations');
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }}
          sx={{
            color: '#6A1B9A',
            borderColor: '#6A1B9A',
            '&:hover': {
              backgroundColor: 'rgba(106, 27, 154, 0.04)',
              transform: 'translateY(-2px)',
            },
            borderRadius: 0.4,
            minWidth: '160px',
            px: 2,
            py: 0.8,
            transition: 'all 0.3s ease',
          }}
        >
          Recommendations
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            const element = document.getElementById('ai-methodology');
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }}
          sx={{
            color: '#6A1B9A',
            borderColor: '#6A1B9A',
            '&:hover': {
              backgroundColor: 'rgba(106, 27, 154, 0.04)',
              transform: 'translateY(-2px)',
            },
            borderRadius: 0.4,
            minWidth: '160px',
            px: 2,
            py: 0.8,
            transition: 'all 0.3s ease',
          }}
        >
          AI Methodology
        </Button>
      </Box>

      <Box sx={{
        textAlign: 'center',
        mb: 5,
        mt: 4,
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        <Typography variant="h3" gutterBottom className="mont-bold" sx={{
          mb: 2,
          background: 'linear-gradient(45deg, #6A1B9A 30%, #9575CD 90%)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          AI Recommendations
        </Typography>

        <Typography variant="h6" color="text.secondary" className="co-text" sx={{
          mb: 3,
          maxWidth: '800px',
          mx: 'auto'
        }}>
          Smart suggestions to optimize your telecom services and reduce costs
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
        {/* AI Insights Section */}
        <Grid item xs={12} id="ai-insights">
          <Box sx={{
            width: '100%',
            bgcolor: 'white',
            mt: 2,
            py: 3,
            borderTop: '1px solid #E0E0E0'
          }}>
            <Box sx={{
              maxWidth: '1200px',
              mx: 'auto',
              bgcolor: '#6A1B9A',
              border: '1px solid #6A1B9A',
              py: 2,
              borderRadius: 0.5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Typography
                variant="h4"
                className="mont-bold"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                AI-Powered Telecom Optimization Insights
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Savings Summary Card */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 0.4,
              border: '2px solid #6A1B9A',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <LightbulbIcon sx={{ mr: 2, fontSize: 40, color: '#6A1B9A' }} />
              <Box>
                <Typography variant="h5" className="mont-semibold" gutterBottom>
                  Potential Monthly Savings
                </Typography>
                <Typography variant="h3" className="mont-bold" sx={{ color: '#6A1B9A' }}>
                  €{totalPotentialSavings}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Our AI has analyzed your usage patterns and identified several opportunities to optimize your services and reduce costs.
              Implementing all recommendations could lead to significant monthly savings.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip
                icon={<CheckCircleIcon />}
                label={`${recommendations.filter(r => r.implemented).length} Implemented`}
                color="success"
                sx={{ borderRadius: 0.2 }}
              />
              <Chip
                icon={<LightbulbIcon />}
                label={`${recommendations.filter(r => !r.implemented).length} Pending`}
                color="primary"
                sx={{ borderRadius: 0.2 }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* AI Analysis Card */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 0.4,
              border: '2px solid #6A1B9A',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              height: '100%'
            }}
          >
            <Typography variant="h5" className="mont-semibold" gutterBottom>
              AI Analysis Overview
            </Typography>

            {insightData.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" className="mont-semibold">
                    {item.category}
                  </Typography>
                  <Typography variant="body2">
                    {item.optimized}% Optimized
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', height: 8, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                  <Box
                    sx={{
                      width: `${item.optimized}%`,
                      height: '100%',
                      bgcolor: item.color,
                      borderRadius: 4
                    }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {item.potential}% potential for further optimization
                </Typography>
              </Box>
            ))}

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                bgcolor: '#6A1B9A',
                '&:hover': { bgcolor: '#5c1786' },
                borderRadius: 0.2
              }}
            >
              View Detailed Analysis
            </Button>
          </Paper>
        </Grid>

        {/* Personalized Recommendations Section */}
        <Grid item xs={12} id="personalized-recommendations">
          <Box sx={{
            width: '100%',
            bgcolor: 'white',
            mt: 4,
            py: 3,
            borderTop: '1px solid #E0E0E0'
          }}>
            <Box sx={{
              maxWidth: '1200px',
              mx: 'auto',
              bgcolor: '#6A1B9A',
              border: '1px solid #6A1B9A',
              py: 2,
              borderRadius: 0.5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Typography
                variant="h4"
                className="mont-bold"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                Personalized Recommendations
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Recommendation Tabs */}
        <Grid item xs={12}>
          <Box sx={{ width: '100%', mb: 3 }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  minHeight: 48,
                  borderBottom: '1px solid #E0E0E0',
                },
                '& .Mui-selected': {
                  color: '#6A1B9A',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#6A1B9A',
                  height: 3,
                }
              }}
            >
              <Tab label="All Recommendations" />
              <Tab label="High Priority" />
              <Tab label="Implemented" />
            </Tabs>
          </Box>
        </Grid>

        {/* Recommendations Cards */}
        {recommendations
          .filter(rec => {
            if (selectedTab === 0) return true;
            if (selectedTab === 1) return rec.priority === 'high' && !rec.implemented;
            if (selectedTab === 2) return rec.implemented;
            return true;
          })
          .map((recommendation) => (
            <Grid item xs={12} md={6} key={recommendation.id}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 0.4,
                  border: recommendation.implemented ? '2px solid #4CAF50' : '2px solid #6A1B9A',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'visible'
                }}
              >
                {recommendation.implemented && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      bgcolor: '#4CAF50',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 0.2,
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Implemented
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LightbulbIcon
                      sx={{
                        mr: 2,
                        color: recommendation.implemented ? '#4CAF50' :
                               recommendation.priority === 'high' ? '#f44336' : '#6A1B9A',
                        fontSize: 28
                      }}
                    />
                    <Typography variant="h6" className="mont-semibold">
                      {recommendation.title}
                    </Typography>
                  </Box>

                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {recommendation.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip
                      icon={<AttachMoneyIcon />}
                      label={`Save €${recommendation.savingsAmount}/month`}
                      color="success"
                      variant="outlined"
                      sx={{ borderRadius: 0.2 }}
                    />
                    {!recommendation.implemented && (
                      <Chip
                        label={recommendation.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                        color={recommendation.priority === 'high' ? 'error' : 'primary'}
                        size="small"
                        sx={{ borderRadius: 0.2 }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
                    <Button
                      variant="outlined"
                      sx={{
                        mr: 1,
                        borderRadius: 0.2,
                        borderColor: '#6A1B9A',
                        color: '#6A1B9A'
                      }}
                      onClick={() => {}}
                    >
                      Details
                    </Button>

                    {!recommendation.implemented ? (
                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: 0.2,
                          bgcolor: '#6A1B9A',
                          '&:hover': { bgcolor: '#5c1786' }
                        }}
                        onClick={() => handleImplementRecommendation(recommendation.id)}
                      >
                        Implement
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ borderRadius: 0.2 }}
                        onClick={() => handleDismissRecommendation(recommendation.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

        {/* AI Methodology Section */}
        <Grid item xs={12} id="ai-methodology">
          <Box sx={{
            width: '100%',
            bgcolor: 'white',
            mt: 4,
            py: 3,
            borderTop: '1px solid #E0E0E0'
          }}>
            <Box sx={{
              maxWidth: '1200px',
              mx: 'auto',
              bgcolor: '#6A1B9A',
              border: '1px solid #6A1B9A',
              py: 2,
              borderRadius: 0.5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Typography
                variant="h4"
                className="mont-bold"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                AI Methodology
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* How It Works */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={3}
            sx={{
              borderRadius: 0.4,
              border: '2px solid #6A1B9A',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" className="mont-semibold" gutterBottom>
                How Our AI Recommendations Work
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUpIcon sx={{ color: '#6A1B9A' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography className="mont-semibold">Usage Analysis</Typography>}
                    secondary="We analyze your historical usage patterns across all lines and services."
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemIcon>
                    <LightbulbIcon sx={{ color: '#6A1B9A' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography className="mont-semibold">Pattern Recognition</Typography>}
                    secondary="Our AI identifies trends, anomalies, and optimization opportunities."
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemIcon>
                    <AttachMoneyIcon sx={{ color: '#6A1B9A' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography className="mont-semibold">Cost Optimization</Typography>}
                    secondary="We compare your usage with available plans to find the most cost-effective options."
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#6A1B9A' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography className="mont-semibold">Personalized Suggestions</Typography>}
                    secondary="You receive tailored recommendations based on your specific business needs."
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Benefits */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={3}
            sx={{
              borderRadius: 0.4,
              border: '2px solid #6A1B9A',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" className="mont-semibold" gutterBottom>
                Benefits of AI-Powered Optimization
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3 }}>
                <Box
                  sx={{
                    bgcolor: '#6A1B9A',
                    color: 'white',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  1
                </Box>
                <Box>
                  <Typography variant="body1" className="mont-semibold">
                    Cost Reduction
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average savings of 15-30% on monthly telecom expenses
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: '#6A1B9A',
                    color: 'white',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  2
                </Box>
                <Box>
                  <Typography variant="body1" className="mont-semibold">
                    Efficiency Improvements
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Better allocation of resources based on actual usage patterns
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: '#6A1B9A',
                    color: 'white',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  3
                </Box>
                <Box>
                  <Typography variant="body1" className="mont-semibold">
                    Proactive Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Early detection of usage anomalies and potential overages
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    bgcolor: '#6A1B9A',
                    color: 'white',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}
                >
                  4
                </Box>
                <Box>
                  <Typography variant="body1" className="mont-semibold">
                    Continuous Improvement
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI learns from your decisions to provide increasingly relevant recommendations
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: { xs: 2, sm: 3, md: 4 },
          mt: 8,
          bgcolor: '#6A1B9A',
          color: 'white',
          width: '100%',
          borderTop: '1px solid #5c1786'
        }}
      >
        <Grid container spacing={3} sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" className="mont-bold" gutterBottom>
              ONE Albania SME
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Providing smart telecom solutions for your business needs
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'white' }}>
                <Facebook />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <Twitter />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <LinkedIn />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <Instagram />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" className="mont-bold" gutterBottom>
              Quick Links
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Service Overview
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Cost Control
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Service Management
            </Typography>
            <Typography variant="body2">
              Analytics
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" className="mont-bold" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: business@one.al
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Phone: +355 42 277 000
            </Typography>
            <Typography variant="body2">
              Address: Rruga Ibrahim Rugova, Tirana, Albania
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
            <Typography variant="body2" align="center">
              © {new Date().getFullYear()} ONE Albania. All rights reserved.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AIRecommendations;
