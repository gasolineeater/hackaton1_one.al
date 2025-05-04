import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  Container
} from '@mui/material';
import {
  DataUsage as DataIcon,
  Phone as CallsIcon,
  Sms as SmsIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  Warning as WarningIcon,
  MoreVert as MoreVertIcon,
  FileDownload as DownloadIcon,
  DateRange as DateRangeIcon,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TableChart as TableChartIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as FileCopyIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as ExcelIcon,
  Code as JsonIcon,
  CompareArrows as CompareIcon,
  AttachMoney as MoneyIcon,
  Insights as InsightsIcon,
  SwapHoriz as SwapIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Equalizer as EqualizerIcon,
  Notifications as NotificationsIcon,
  Tab as TabIcon
} from '@mui/icons-material';

const Analytics = () => {
  // State for date range filter
  const [dateRange, setDateRange] = useState('30days');
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle menu open/close
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle date range change
  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Header Section */}
        <Box sx={{
          mb: 2,
          mt: 9.5,
          background: 'linear-gradient(45deg, #6A1B9A 30%, #9575CD 90%)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          <Typography variant="h3" gutterBottom className="mont-bold" sx={{ textAlign: 'center' }}>
            Analytics Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ textAlign: 'center', mt: 1 }}>
            Gain valuable insights from your telecom usage data
          </Typography>
        </Box>

        {/* Main Content Container */}
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Controls Section */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4
          }}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="date-range-label">Time Period</InputLabel>
              <Select
                labelId="date-range-label"
                id="date-range-select"
                value={dateRange}
                label="Time Period"
                onChange={handleDateRangeChange}
                startAdornment={<DateRangeIcon sx={{ mr: 1, color: '#6A1B9A' }} />}
              >
                <MenuItem value="7days">Last 7 Days</MenuItem>
                <MenuItem value="30days">Last 30 Days</MenuItem>
                <MenuItem value="90days">Last 90 Days</MenuItem>
                <MenuItem value="6months">Last 6 Months</MenuItem>
                <MenuItem value="1year">Last Year</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                sx={{
                  borderColor: '#6A1B9A',
                  color: '#6A1B9A',
                  mr: 1,
                  '&:hover': {
                    borderColor: '#4A148C',
                    bgcolor: 'rgba(106, 27, 154, 0.04)'
                  }
                }}
              >
                Export Data
              </Button>
              <IconButton
                aria-label="more options"
                onClick={handleMenuClick}
                sx={{ color: '#6A1B9A' }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>Refresh Data</MenuItem>
                <MenuItem onClick={handleMenuClose}>Customize Dashboard</MenuItem>
                <MenuItem onClick={handleMenuClose}>Schedule Reports</MenuItem>
              </Menu>
            </Box>
          </Box>

          {/* Usage Overview Section */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              className="mont-semibold"
              sx={{
                color: '#6A1B9A',
                mb: 3,
                pb: 1,
                borderBottom: '1px solid rgba(106, 27, 154, 0.2)'
              }}
            >
              Usage Overview
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Grid container spacing={3} sx={{ maxWidth: '1000px' }}>
                {/* Data Usage Card */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 0.2,
                      border: '1px solid rgba(106, 27, 154, 0.3)',
                      bgcolor: 'rgba(106, 27, 154, 0.03)',
                      height: '100%',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 12px rgba(106, 27, 154, 0.1)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            mr: 2,
                            bgcolor: '#6A1B9A',
                            color: 'white',
                            p: 1,
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 8px rgba(106, 27, 154, 0.2)'
                          }}
                        >
                          <DataIcon />
                        </Box>
                        <Typography variant="h6" className="mont-semibold">
                          Data Usage
                        </Typography>
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      <Box sx={{ mb: 1, textAlign: 'center' }}>
                        <Typography variant="h4" className="mont-bold" sx={{ color: '#6A1B9A' }}>
                          1,284 GB
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total usage this period
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                          <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                          +12.5% from previous
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Voice Usage Card */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 0.2,
                      border: '1px solid rgba(106, 27, 154, 0.3)',
                      bgcolor: 'rgba(106, 27, 154, 0.03)',
                      height: '100%',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 12px rgba(106, 27, 154, 0.1)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            mr: 2,
                            bgcolor: '#6A1B9A',
                            color: 'white',
                            p: 1,
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 8px rgba(106, 27, 154, 0.2)'
                          }}
                        >
                          <CallsIcon />
                        </Box>
                        <Typography variant="h6" className="mont-semibold">
                          Voice Usage
                        </Typography>
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      <Box sx={{ mb: 1, textAlign: 'center' }}>
                        <Typography variant="h4" className="mont-bold" sx={{ color: '#6A1B9A' }}>
                          8,742 min
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total minutes this period
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body2" color="error.main" sx={{ display: 'flex', alignItems: 'center' }}>
                          <TrendingUpIcon color="error" fontSize="small" sx={{ mr: 0.5, transform: 'rotate(180deg)' }} />
                          -3.2% from previous
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* SMS Usage Card */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 0.2,
                      border: '1px solid rgba(106, 27, 154, 0.3)',
                      bgcolor: 'rgba(106, 27, 154, 0.03)',
                      height: '100%',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 12px rgba(106, 27, 154, 0.1)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            mr: 2,
                            bgcolor: '#6A1B9A',
                            color: 'white',
                            p: 1,
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 8px rgba(106, 27, 154, 0.2)'
                          }}
                        >
                          <SmsIcon />
                        </Box>
                        <Typography variant="h6" className="mont-semibold">
                          SMS Usage
                        </Typography>
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      <Box sx={{ mb: 1, textAlign: 'center' }}>
                        <Typography variant="h4" className="mont-bold" sx={{ color: '#6A1B9A' }}>
                          3,156
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total messages this period
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                          <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                          +5.7% from previous
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Usage Trends Section */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              className="mont-semibold"
              sx={{
                color: '#6A1B9A',
                mb: 3,
                pb: 1,
                borderBottom: '1px solid rgba(106, 27, 154, 0.2)'
              }}
            >
              Usage Trends
            </Typography>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 0.2,
                border: '1px solid rgba(106, 27, 154, 0.3)',
                bgcolor: 'white',
                overflow: 'hidden'
              }}
            >
              {/* Header with tabs */}
              <Box sx={{
                bgcolor: 'rgba(106, 27, 154, 0.03)',
                borderBottom: '1px solid rgba(106, 27, 154, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
                py: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ color: '#6A1B9A', mr: 1.5 }} />
                  <Typography variant="h6" className="mont-semibold" sx={{ color: '#6A1B9A', fontSize: '1rem' }}>
                    Usage Patterns & Trends
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    disableElevation
                    sx={{
                      bgcolor: '#6A1B9A',
                      '&:hover': { bgcolor: '#5c1786' },
                      fontSize: '0.75rem',
                      borderRadius: 0.2
                    }}
                  >
                    Data
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      color: '#6A1B9A',
                      borderColor: 'rgba(106, 27, 154, 0.5)',
                      '&:hover': { borderColor: '#6A1B9A', bgcolor: 'rgba(106, 27, 154, 0.04)' },
                      fontSize: '0.75rem',
                      borderRadius: 0.2
                    }}
                  >
                    Voice
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      color: '#6A1B9A',
                      borderColor: 'rgba(106, 27, 154, 0.5)',
                      '&:hover': { borderColor: '#6A1B9A', bgcolor: 'rgba(106, 27, 154, 0.04)' },
                      fontSize: '0.75rem',
                      borderRadius: 0.2
                    }}
                  >
                    SMS
                  </Button>
                </Box>
              </Box>

              {/* Chart area */}
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Chart visualization */}
                  <Grid item xs={12} md={8}>
                    <Box sx={{
                      height: 280,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: '1px dashed rgba(106, 27, 154, 0.3)',
                      borderRadius: 0.2,
                      p: 3,
                      bgcolor: 'rgba(106, 27, 154, 0.01)'
                    }}>
                      <Box sx={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        {/* Placeholder chart with gradient */}
                        <Box sx={{
                          width: '100%',
                          height: '70%',
                          position: 'relative',
                          mt: 'auto'
                        }}>
                          {/* X-axis line */}
                          <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            bgcolor: 'rgba(0, 0, 0, 0.1)'
                          }} />

                          {/* Fake data points */}
                          <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '100%',
                            display: 'flex',
                            alignItems: 'flex-end'
                          }}>
                            {[35, 42, 58, 45, 67, 73, 62, 80, 95, 88, 76, 90].map((height, index) => (
                              <Box
                                key={index}
                                sx={{
                                  flex: 1,
                                  mx: 0.5,
                                  height: `${height}%`,
                                  bgcolor: '#6A1B9A',
                                  opacity: 0.7,
                                  borderTopLeftRadius: 2,
                                  borderTopRightRadius: 2,
                                  position: 'relative',
                                  '&:hover': {
                                    opacity: 1,
                                    bgcolor: '#5c1786'
                                  },
                                  transition: 'all 0.3s ease'
                                }}
                              />
                            ))}
                          </Box>
                        </Box>

                        {/* X-axis labels */}
                        <Box sx={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          px: 1,
                          mt: 1
                        }}>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                            <Typography
                              key={index}
                              variant="caption"
                              sx={{
                                fontSize: '0.65rem',
                                color: 'text.secondary',
                                flex: 1,
                                textAlign: 'center'
                              }}
                            >
                              {month}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Stats and insights */}
                  <Grid item xs={12} md={4}>
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Key stats */}
                      <Box sx={{
                        mb: 2,
                        p: 2,
                        border: '1px solid rgba(106, 27, 154, 0.2)',
                        borderRadius: 0.2,
                        bgcolor: 'rgba(106, 27, 154, 0.02)'
                      }}>
                        <Typography variant="subtitle2" className="mont-semibold" sx={{ mb: 1.5, color: '#6A1B9A' }}>
                          Key Insights
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            Average Usage:
                          </Typography>
                          <Typography variant="body2" className="mont-semibold" sx={{ fontSize: '0.75rem' }}>
                            107.2 GB/month
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            Peak Usage:
                          </Typography>
                          <Typography variant="body2" className="mont-semibold" sx={{ fontSize: '0.75rem' }}>
                            September (156 GB)
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            Growth Rate:
                          </Typography>
                          <Typography variant="body2" className="mont-semibold" sx={{ fontSize: '0.75rem', color: 'success.main' }}>
                            +18.3% YoY
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            Projected Usage:
                          </Typography>
                          <Typography variant="body2" className="mont-semibold" sx={{ fontSize: '0.75rem' }}>
                            1,430 GB (next quarter)
                          </Typography>
                        </Box>
                      </Box>

                      {/* Recommendations */}
                      <Box sx={{
                        p: 2,
                        border: '1px solid rgba(106, 27, 154, 0.2)',
                        borderRadius: 0.2,
                        bgcolor: 'rgba(106, 27, 154, 0.02)',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <Typography variant="subtitle2" className="mont-semibold" sx={{ mb: 1.5, color: '#6A1B9A' }}>
                          Recommendations
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                          <Box sx={{
                            minWidth: 24,
                            height: 24,
                            borderRadius: '50%',
                            bgcolor: 'rgba(106, 27, 154, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1.5,
                            mt: 0.2
                          }}>
                            <Typography variant="caption" sx={{ color: '#6A1B9A', fontWeight: 'bold' }}>1</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            Consider upgrading to the <b>Business Pro Plan</b> to accommodate growing data usage trends.
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Box sx={{
                            minWidth: 24,
                            height: 24,
                            borderRadius: '50%',
                            bgcolor: 'rgba(106, 27, 154, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1.5,
                            mt: 0.2
                          }}>
                            <Typography variant="caption" sx={{ color: '#6A1B9A', fontWeight: 'bold' }}>2</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            Implement <b>data optimization policies</b> during peak usage months (Aug-Oct) to prevent overages.
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            variant="text"
                            size="small"
                            sx={{
                              color: '#6A1B9A',
                              fontSize: '0.75rem',
                              p: 0,
                              '&:hover': {
                                bgcolor: 'transparent',
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            View All Recommendations
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>

          {/* Top Users Section */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              className="mont-semibold"
              sx={{
                color: '#6A1B9A',
                mb: 3,
                pb: 1,
                borderBottom: '1px solid rgba(106, 27, 154, 0.2)'
              }}
            >
              Top Users & Departments
            </Typography>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 0.2,
                border: '1px solid rgba(106, 27, 154, 0.3)',
                bgcolor: 'white',
                overflow: 'hidden'
              }}
            >
              {/* Header with tabs */}
              <Box sx={{
                bgcolor: 'rgba(106, 27, 154, 0.03)',
                borderBottom: '1px solid rgba(106, 27, 154, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
                py: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <GroupIcon sx={{ color: '#6A1B9A', mr: 1.5 }} />
                  <Typography variant="h6" className="mont-semibold" sx={{ color: '#6A1B9A', fontSize: '1rem' }}>
                    User & Department Analysis
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    disableElevation
                    sx={{
                      bgcolor: '#6A1B9A',
                      '&:hover': { bgcolor: '#5c1786' },
                      fontSize: '0.75rem',
                      borderRadius: 0.2
                    }}
                  >
                    Data
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      color: '#6A1B9A',
                      borderColor: 'rgba(106, 27, 154, 0.5)',
                      '&:hover': { borderColor: '#6A1B9A', bgcolor: 'rgba(106, 27, 154, 0.04)' },
                      fontSize: '0.75rem',
                      borderRadius: 0.2
                    }}
                  >
                    Voice
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      color: '#6A1B9A',
                      borderColor: 'rgba(106, 27, 154, 0.5)',
                      '&:hover': { borderColor: '#6A1B9A', bgcolor: 'rgba(106, 27, 154, 0.04)' },
                      fontSize: '0.75rem',
                      borderRadius: 0.2
                    }}
                  >
                    SMS
                  </Button>
                </Box>
              </Box>

              {/* Content */}
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Top Users Ranking */}
                  <Grid item xs={12} md={7}>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{
                          bgcolor: '#6A1B9A',
                          
                          width: 4,
                          height: 20,
                          mr: 1.5,
                          borderRadius: 1
                        }} />
                        <Typography variant="subtitle2" className="mont-semibold" sx={{ color: '#6A1B9A' }}>
                          Ranking of Users by Data, Voice, and SMS Usage
                        </Typography>
                      </Box>

                      {/* Tabs for different usage types */}
                      <Box sx={{
                        display: 'flex',
                        borderBottom: '1px solid rgba(106, 27, 154, 0.2)',
                        mb: 2,
                        
                      }}>
                        <Box sx={{
                          py: 1,
                          px: 2,
                          borderBottom: '2px solid #6A1B9A',
                          color: '#6A1B9A',
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center'
                          
                        }}>
                          <DataIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                          Data Usage
                        </Box>
                        <Box sx={{
                          py: 1,
                          px: 2,
                          color: 'text.secondary',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': { color: '#6A1B9A' }
                        }}>
                          <CallsIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                          Voice Usage
                        </Box>
                        <Box sx={{
                          py: 1,
                          px: 2,
                          color: 'text.secondary',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': { color: '#6A1B9A' }
                        }}>
                          <SmsIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                          SMS Usage
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{
                      border: '1px solid rgba(106, 27, 154, 0.2)',
                      borderRadius: 0.2,
                      overflow: 'hidden'
                    }}>
                      {/* Table Header */}
                      <Box sx={{
                        p: 1.5,
                        bgcolor: 'rgba(106, 27, 154, 0.05)',
                        borderBottom: '1px solid rgba(106, 27, 154, 0.1)',
                        display: 'grid',
                        gridTemplateColumns: '50px 1fr 120px 100px',
                        gap: 1
                      }}>
                        <Typography variant="caption" className="mont-semibold" sx={{ color: '#6A1B9A' }}>
                          Rank
                        </Typography>
                        <Typography variant="caption" className="mont-semibold" sx={{ color: '#6A1B9A' }}>
                          User
                        </Typography>
                        <Typography variant="caption" className="mont-semibold" sx={{ color: '#6A1B9A' }}>
                          Department
                        </Typography>
                        <Typography variant="caption" className="mont-semibold" sx={{ color: '#6A1B9A', textAlign: 'right' }}>
                          Usage
                        </Typography>
                      </Box>

                      {/* User 1 */}
                      <Box sx={{
                        p: 1.5,
                        borderBottom: '1px solid rgba(106, 27, 154, 0.1)',
                        display: 'grid',
                        gridTemplateColumns: '50px 1fr 120px 100px',
                        gap: 1,
                        '&:hover': { bgcolor: 'rgba(106, 27, 154, 0.01)' }
                      }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: '#6A1B9A',
                          color: 'white',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          1
                        </Box>
                        <Box>
                          <Typography variant="body2" className="mont-semibold">
                            John Smith
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            john.smith@company.com
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                          Marketing
                        </Typography>
                        <Box sx={{ alignSelf: 'center', textAlign: 'right' }}>
                          <Typography variant="body2" className="mont-semibold">
                            156.2 GB
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'success.main' }}>
                            +12% ↑
                          </Typography>
                        </Box>
                      </Box>

                      {/* User 2 */}
                      <Box sx={{
                        p: 1.5,
                        borderBottom: '1px solid rgba(106, 27, 154, 0.1)',
                        display: 'grid',
                        gridTemplateColumns: '50px 1fr 120px 100px',
                        gap: 1,
                        '&:hover': { bgcolor: 'rgba(106, 27, 154, 0.01)' }
                      }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: '#8E24AA',
                          color: 'white',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          2
                        </Box>
                        <Box>
                          <Typography variant="body2" className="mont-semibold">
                            Sarah Johnson
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            sarah.j@company.com
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                          Design
                        </Typography>
                        <Box sx={{ alignSelf: 'center', textAlign: 'right' }}>
                          <Typography variant="body2" className="mont-semibold">
                            142.8 GB
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'success.main' }}>
                            +8% ↑
                          </Typography>
                        </Box>
                      </Box>

                      {/* User 3 */}
                      <Box sx={{
                        p: 1.5,
                        borderBottom: '1px solid rgba(106, 27, 154, 0.1)',
                        display: 'grid',
                        gridTemplateColumns: '50px 1fr 120px 100px',
                        gap: 1,
                        '&:hover': { bgcolor: 'rgba(106, 27, 154, 0.01)' }
                      }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: '#AB47BC',
                          color: 'white',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          3
                        </Box>
                        <Box>
                          <Typography variant="body2" className="mont-semibold">
                            Michael Chen
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            m.chen@company.com
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                          Development
                        </Typography>
                        <Box sx={{ alignSelf: 'center', textAlign: 'right' }}>
                          <Typography variant="body2" className="mont-semibold">
                            128.5 GB
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'error.main' }}>
                            -3% ↓
                          </Typography>
                        </Box>
                      </Box>

                      {/* User 4 */}
                      <Box sx={{
                        p: 1.5,
                        borderBottom: '1px solid rgba(106, 27, 154, 0.1)',
                        display: 'grid',
                        gridTemplateColumns: '50px 1fr 120px 100px',
                        gap: 1,
                        '&:hover': { bgcolor: 'rgba(106, 27, 154, 0.01)' }
                      }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: '#BA68C8',
                          color: 'white',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          4
                        </Box>
                        <Box>
                          <Typography variant="body2" className="mont-semibold">
                            Emma Davis
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            e.davis@company.com
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                          Sales
                        </Typography>
                        <Box sx={{ alignSelf: 'center', textAlign: 'right' }}>
                          <Typography variant="body2" className="mont-semibold">
                            112.3 GB
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'success.main' }}>
                            +15% ↑
                          </Typography>
                        </Box>
                      </Box>

                      {/* User 5 */}
                      <Box sx={{
                        p: 1.5,
                        display: 'grid',
                        gridTemplateColumns: '50px 1fr 120px 100px',
                        gap: 1,
                        '&:hover': { bgcolor: 'rgba(106, 27, 154, 0.01)' }
                      }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: '#CE93D8',
                          color: 'white',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          5
                        </Box>
                        <Box>
                          <Typography variant="body2" className="mont-semibold">
                            Robert Wilson
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            r.wilson@company.com
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                          Finance
                        </Typography>
                        <Box sx={{ alignSelf: 'center', textAlign: 'right' }}>
                          <Typography variant="body2" className="mont-semibold">
                            98.7 GB
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'error.main' }}>
                            -5% ↓
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Showing top 5 users by data consumption
                      </Typography>
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          color: '#6A1B9A',
                          fontSize: '0.75rem',
                          '&:hover': {
                            bgcolor: 'transparent',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        View All Users
                      </Button>
                    </Box>
                  </Grid>

                  {/* Department Summary */}
                  <Grid item xs={12} md={5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{
                        bgcolor: '#6A1B9A',
                        width: 4,
                        height: 20,
                        mr: 1.5,
                        borderRadius: 1
                      }} />
                      <Typography variant="subtitle2" className="mont-semibold" sx={{ color: '#6A1B9A' }}>
                        Department-level Consumption Analysis
                      </Typography>
                    </Box>

                    {/* Department Usage Tabs */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{
                        display: 'flex',
                        borderBottom: '1px solid rgba(106, 27, 154, 0.2)'
                      }}>
                        <Box sx={{
                          py: 1,
                          px: 2,
                          borderBottom: '2px solid #6A1B9A',
                          color: '#6A1B9A',
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <BusinessIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                          By Department
                        </Box>
                        <Box sx={{
                          py: 1,
                          px: 2,
                          color: 'text.secondary',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': { color: '#6A1B9A' }
                        }}>
                          <EqualizerIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                          Trend Analysis
                        </Box>
                        <Box sx={{
                          py: 1,
                          px: 2,
                          color: 'text.secondary',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': { color: '#6A1B9A' }
                        }}>
                          <PersonIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                          Per User
                        </Box>
                      </Box>
                    </Box>

                    {/* Department Summary Table */}
                    <Box sx={{
                      border: '1px solid rgba(106, 27, 154, 0.2)',
                      borderRadius: 0.2,
                      overflow: 'hidden',
                      mb: 3
                    }}>
                      {/* Table Header */}
                      <Box sx={{
                        p: 1.5,
                        bgcolor: 'rgba(106, 27, 154, 0.05)',
                        borderBottom: '1px solid rgba(106, 27, 154, 0.1)',
                        display: 'grid',
                        gridTemplateColumns: '1fr 100px 100px 80px',
                        gap: 1
                      }}>
                        <Typography variant="caption" className="mont-semibold" sx={{ color: '#6A1B9A' }}>
                          Department
                        </Typography>
                        <Typography variant="caption" className="mont-semibold" sx={{ color: '#6A1B9A', textAlign: 'right' }}>
                          Total Usage
                        </Typography>
                        <Typography variant="caption" className="mont-semibold" sx={{ color: '#6A1B9A', textAlign: 'right' }}>
                          Avg. Per User
                        </Typography>
                        <Typography variant="caption" className="mont-semibold" sx={{ color: '#6A1B9A', textAlign: 'right' }}>
                          Trend
                        </Typography>
                      </Box>

                      {/* Department rows */}
                      {[
                        { name: 'Marketing', usage: '412.5 GB', avgPerUser: '41.3 GB', percent: 28, trend: '+12%', trendUp: true },
                        { name: 'Development', usage: '356.2 GB', avgPerUser: '29.7 GB', percent: 24, trend: '+5%', trendUp: true },
                        { name: 'Sales', usage: '289.7 GB', avgPerUser: '36.2 GB', percent: 20, trend: '+8%', trendUp: true },
                        { name: 'Design', usage: '245.3 GB', avgPerUser: '49.1 GB', percent: 17, trend: '-3%', trendUp: false },
                        { name: 'Finance', usage: '156.8 GB', avgPerUser: '19.6 GB', percent: 11, trend: '-7%', trendUp: false }
                      ].map((dept, index) => (
                        <Box key={index} sx={{
                          p: 1.5,
                          borderBottom: index < 4 ? '1px solid rgba(106, 27, 154, 0.1)' : 'none',
                          display: 'grid',
                          gridTemplateColumns: '1fr 100px 100px 80px',
                          gap: 1,
                          '&:hover': { bgcolor: 'rgba(106, 27, 154, 0.01)' },
                          cursor: 'pointer'
                        }}>
                          <Box>
                            <Typography variant="body2" className="mont-semibold">
                              {dept.name}
                            </Typography>
                            <Box sx={{
                              mt: 1,
                              width: '100%',
                              height: 6,
                              bgcolor: 'rgba(106, 27, 154, 0.1)',
                              borderRadius: 3,
                              overflow: 'hidden'
                            }}>
                              <Box sx={{
                                width: `${dept.percent}%`,
                                height: '100%',
                                bgcolor: '#6A1B9A',
                                borderRadius: 3
                              }} />
                            </Box>
                          </Box>
                          <Box sx={{ alignSelf: 'center', textAlign: 'right' }}>
                            <Typography variant="body2" className="mont-semibold">
                              {dept.usage}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {dept.percent}%
                            </Typography>
                          </Box>
                          <Box sx={{ alignSelf: 'center', textAlign: 'right' }}>
                            <Typography variant="body2" className="mont-semibold">
                              {dept.avgPerUser}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              per user
                            </Typography>
                          </Box>
                          <Box sx={{ alignSelf: 'center', textAlign: 'right' }}>
                            <Typography
                              variant="body2"
                              className="mont-semibold"
                              sx={{
                                color: dept.trendUp ? 'success.main' : 'error.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end'
                              }}
                            >
                              {dept.trend}
                              {dept.trendUp ?
                                <TrendingUpIcon sx={{ ml: 0.5, fontSize: '1rem' }} /> :
                                <TrendingUpIcon sx={{ ml: 0.5, fontSize: '1rem', transform: 'rotate(180deg)' }} />
                              }
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                    

                    

                    <Box sx={{
                      p: 2,
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      borderRadius: 0.2,
                      bgcolor: 'rgba(76, 175, 80, 0.05)'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <TrendingUpIcon sx={{ color: 'success.main', mr: 1, fontSize: '1.2rem' }} />
                        <Box>
                          <Typography variant="body2" className="mont-semibold">
                            Finance department optimized usage
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            15% decrease in data usage while maintaining productivity
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>

          {/* Anomaly Detection Section */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              className="mont-semibold"
              sx={{
                color: '#6A1B9A',
                mb: 3,
                pb: 1,
                borderBottom: '1px solid rgba(106, 27, 154, 0.2)'
              }}
            >
              Anomaly Detection
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 0.2,
                border: '1px solid rgba(106, 27, 154, 0.3)',
                bgcolor: 'white'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon sx={{ color: '#6A1B9A', mr: 1 }} />
                <Typography variant="h6" className="mont-semibold" sx={{ color: '#6A1B9A' }}>
                  Usage Anomalies & Alerts
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                Our AI-powered anomaly detection system will identify unusual usage patterns and potential issues before they become problems.
              </Typography>

              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                Features coming soon:
              </Typography>
              <ul>
                <li>Automatic detection of unusual usage spikes</li>
                <li>Identification of potential security concerns</li>
                <li>Customizable alert thresholds</li>
                <li>Historical anomaly tracking</li>
                <li>Predictive analytics for future usage</li>
              </ul>
            </Paper>
          </Box>

          {/* Customizable Reports and Dashboards Section */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              className="mont-semibold"
              sx={{
                color: '#6A1B9A',
                mb: 3,
                pb: 1,
                borderBottom: '1px solid rgba(106, 27, 154, 0.2)'
              }}
            >
              Customizable Reports & Dashboards
            </Typography>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 0.2,
                border: '1px solid rgba(106, 27, 154, 0.3)',
                bgcolor: 'white',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <Box sx={{
                bgcolor: 'rgba(106, 27, 154, 0.03)',
                borderBottom: '1px solid rgba(106, 27, 154, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
                py: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BarChartIcon sx={{ color: '#6A1B9A', mr: 1.5 }} />
                  <Typography variant="h6" className="mont-semibold" sx={{ color: '#6A1B9A', fontSize: '1rem' }}>
                    Create & Manage Reports
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  disableElevation
                  sx={{
                    bgcolor: '#6A1B9A',
                    '&:hover': { bgcolor: '#5c1786' },
                    fontSize: '0.75rem',
                    borderRadius: 0.2
                  }}
                >
                  New Report
                </Button>
              </Box>

              {/* Content */}
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Saved Reports */}
                  <Grid item xs={12} md={7}>
                    <Typography variant="subtitle2" className="mont-semibold" sx={{ mb: 2, color: '#6A1B9A' }}>
                      Saved Reports
                    </Typography>

                    <Box sx={{
                      border: '1px solid rgba(106, 27, 154, 0.2)',
                      borderRadius: 0.2,
                      overflow: 'hidden'
                    }}>
                      {/* Report Item 1 */}
                      <Box sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(106, 27, 154, 0.1)',
                        '&:hover': { bgcolor: 'rgba(106, 27, 154, 0.01)' }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DescriptionIcon sx={{ color: '#6A1B9A', mr: 1.5, fontSize: '1.2rem' }} />
                          <Box>
                            <Typography variant="body2" className="mont-semibold">
                              Monthly Usage Summary
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Last generated: 3 days ago
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" sx={{ color: '#6A1B9A' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" sx={{ color: '#6A1B9A' }}>
                            <FileCopyIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" sx={{ color: 'error.main' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Report Item 2 */}
                      <Box sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(106, 27, 154, 0.1)',
                        '&:hover': { bgcolor: 'rgba(106, 27, 154, 0.01)' }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DescriptionIcon sx={{ color: '#6A1B9A', mr: 1.5, fontSize: '1.2rem' }} />
                          <Box>
                            <Typography variant="body2" className="mont-semibold">
                              Quarterly Department Analysis
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Last generated: 2 weeks ago
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" sx={{ color: '#6A1B9A' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" sx={{ color: '#6A1B9A' }}>
                            <FileCopyIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" sx={{ color: 'error.main' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Report Item 3 */}
                      <Box sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        '&:hover': { bgcolor: 'rgba(106, 27, 154, 0.01)' }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DescriptionIcon sx={{ color: '#6A1B9A', mr: 1.5, fontSize: '1.2rem' }} />
                          <Box>
                            <Typography variant="body2" className="mont-semibold">
                              Annual Cost Optimization
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Last generated: 1 month ago
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" sx={{ color: '#6A1B9A' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" sx={{ color: '#6A1B9A' }}>
                            <FileCopyIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" sx={{ color: 'error.main' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Dashboard Templates */}
                  <Grid item xs={12} md={5}>
                    <Typography variant="subtitle2" className="mont-semibold" sx={{ mb: 2, color: '#6A1B9A' }}>
                      Dashboard Templates
                    </Typography>

                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2
                    }}>
                      {/* Template 1 */}
                      <Box sx={{
                        p: 2,
                        border: '1px solid rgba(106, 27, 154, 0.2)',
                        borderRadius: 0.2,
                        display: 'flex',
                        alignItems: 'center',
                        '&:hover': {
                          bgcolor: 'rgba(106, 27, 154, 0.01)',
                          borderColor: 'rgba(106, 27, 154, 0.4)'
                        },
                        cursor: 'pointer'
                      }}>
                        <DashboardIcon sx={{ color: '#6A1B9A', mr: 2, fontSize: '2rem' }} />
                        <Box>
                          <Typography variant="body1" className="mont-semibold">
                            Executive Summary
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            High-level overview with key metrics and trends
                          </Typography>
                        </Box>
                      </Box>

                      {/* Template 2 */}
                      <Box sx={{
                        p: 2,
                        border: '1px solid rgba(106, 27, 154, 0.2)',
                        borderRadius: 0.2,
                        display: 'flex',
                        alignItems: 'center',
                        '&:hover': {
                          bgcolor: 'rgba(106, 27, 154, 0.01)',
                          borderColor: 'rgba(106, 27, 154, 0.4)'
                        },
                        cursor: 'pointer'
                      }}>
                        <TableChartIcon sx={{ color: '#6A1B9A', mr: 2, fontSize: '2rem' }} />
                        <Box>
                          <Typography variant="body1" className="mont-semibold">
                            Detailed Analysis
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            In-depth data with filtering and sorting capabilities
                          </Typography>
                        </Box>
                      </Box>

                      {/* Template 3 */}
                      <Box sx={{
                        p: 2,
                        border: '1px solid rgba(106, 27, 154, 0.2)',
                        borderRadius: 0.2,
                        display: 'flex',
                        alignItems: 'center',
                        '&:hover': {
                          bgcolor: 'rgba(106, 27, 154, 0.01)',
                          borderColor: 'rgba(106, 27, 154, 0.4)'
                        },
                        cursor: 'pointer'
                      }}>
                        <PieChartIcon sx={{ color: '#6A1B9A', mr: 2, fontSize: '2rem' }} />
                        <Box>
                          <Typography variant="body1" className="mont-semibold">
                            Department Comparison
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Compare usage across different departments
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>

          {/* Data Export Capabilities Section */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              className="mont-semibold"
              sx={{
                color: '#6A1B9A',
                mb: 3,
                pb: 1,
                borderBottom: '1px solid rgba(106, 27, 154, 0.2)'
              }}
            >
              Data Export Capabilities
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 0.2,
                border: '1px solid rgba(106, 27, 154, 0.3)',
                bgcolor: 'white'
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" className="mont-semibold" sx={{ mb: 2, color: '#6A1B9A' }}>
                    Export Options
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 3 }}>
                    Export your telecom data in various formats for further analysis in your preferred tools.
                    All exports include comprehensive metadata and are compatible with common analysis software.
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<PdfIcon />}
                      sx={{
                        color: '#6A1B9A',
                        borderColor: 'rgba(106, 27, 154, 0.5)',
                        '&:hover': { borderColor: '#6A1B9A', bgcolor: 'rgba(106, 27, 154, 0.04)' },
                        borderRadius: 0.2
                      }}
                    >
                      PDF Report
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<ExcelIcon />}
                      sx={{
                        color: '#6A1B9A',
                        borderColor: 'rgba(106, 27, 154, 0.5)',
                        '&:hover': { borderColor: '#6A1B9A', bgcolor: 'rgba(106, 27, 154, 0.04)' },
                        borderRadius: 0.2
                      }}
                    >
                      Excel Spreadsheet
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<JsonIcon />}
                      sx={{
                        color: '#6A1B9A',
                        borderColor: 'rgba(106, 27, 154, 0.5)',
                        '&:hover': { borderColor: '#6A1B9A', bgcolor: 'rgba(106, 27, 154, 0.04)' },
                        borderRadius: 0.2
                      }}
                    >
                      JSON Data
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" className="mont-semibold" sx={{ mb: 2, color: '#6A1B9A' }}>
                    Scheduled Exports
                  </Typography>

                  <Box sx={{
                    border: '1px solid rgba(106, 27, 154, 0.2)',
                    borderRadius: 0.2,
                    overflow: 'hidden'
                  }}>
                    {/* Scheduled Export 1 */}
                    <Box sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(106, 27, 154, 0.1)',
                      '&:hover': { bgcolor: 'rgba(106, 27, 154, 0.01)' }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ExcelIcon sx={{ color: '#6A1B9A', mr: 1.5, fontSize: '1.2rem' }} />
                        <Box>
                          <Typography variant="body2" className="mont-semibold">
                            Monthly Usage Report
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Excel • First day of month • Email delivery
                          </Typography>
                        </Box>
                      </Box>

                      <Box>
                        <IconButton size="small" sx={{ color: '#6A1B9A' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Scheduled Export 2 */}
                    <Box sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      '&:hover': { bgcolor: 'rgba(106, 27, 154, 0.01)' }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PdfIcon sx={{ color: '#6A1B9A', mr: 1.5, fontSize: '1.2rem' }} />
                        <Box>
                          <Typography variant="body2" className="mont-semibold">
                            Weekly Executive Summary
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            PDF • Every Monday • Email delivery
                          </Typography>
                        </Box>
                      </Box>

                      <Box>
                        <IconButton size="small" sx={{ color: '#6A1B9A' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="text"
                      startIcon={<AddIcon />}
                      sx={{
                        color: '#6A1B9A',
                        '&:hover': { bgcolor: 'rgba(106, 27, 154, 0.04)' }
                      }}
                    >
                      Schedule New Export
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 8,
          py: 6,
          bgcolor: 'primary.dark',
          color: 'white',
          borderRadius: 0,
          width: '100%'
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
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
        </Container>
      </Box>
    </Box>
  );
};

export default Analytics;









//Ranking of users by data, voice, and SMS usage
// Department-level consumption analysis
// Comparative usage metrics
// Usage anomaly detection
// Cost allocation insights, this is the agenda for the Analytics.jsx page