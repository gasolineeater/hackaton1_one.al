import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  IconButton,
  List,
  ListItem
} from '@mui/material';
import {
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  CalendarToday as CalendarTodayIcon,
  Phone as PhoneIcon,
  Group as GroupIcon,
  Download as DownloadIcon,
  Lightbulb as LightbulbIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  ArrowForward as ArrowForwardIcon,
  Savings as SavingsIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as ExcelIcon,
  Print as PrintIcon,
  DateRange as DateRangeIcon,
  FilterList as FilterListIcon,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram
} from '@mui/icons-material';

// Mock data for charts and tables
const costBreakdownData = [
  { category: 'Data', value: 45, color: '#6A1B9A' },
  { category: 'Calls', value: 30, color: '#9575CD' },
  { category: 'SMS', value: 5, color: '#B39DDB' },
  { category: 'Roaming', value: 15, color: '#7E57C2' },
  { category: 'Services', value: 5, color: '#5E35B1' }
];

const monthlySpendingData = [
  { month: 'Jan', amount: 1250 },
  { month: 'Feb', amount: 1380 },
  { month: 'Mar', amount: 1420 },
  { month: 'Apr', amount: 1300 },
  { month: 'May', amount: 1500 },
  { month: 'Jun', amount: 1620 }
];

const departmentSpendingData = [
  { department: 'Sales', amount: 3200, percentage: 32 },
  { department: 'Marketing', amount: 2500, percentage: 25 },
  { department: 'IT', amount: 1800, percentage: 18 },
  { department: 'HR', amount: 1200, percentage: 12 },
  { department: 'Finance', amount: 800, percentage: 8 },
  { department: 'Operations', amount: 500, percentage: 5 }
];

const topSpendersData = [
  { phoneNumber: '+355 69 123 4567', assignedTo: 'John Smith', department: 'Sales', amount: 120 },
  { phoneNumber: '+355 69 234 5678', assignedTo: 'Maria Johnson', department: 'Marketing', amount: 95 },
  { phoneNumber: '+355 69 345 6789', assignedTo: 'Robert Brown', department: 'IT', amount: 85 },
  { phoneNumber: '+355 69 456 7890', assignedTo: 'Sarah Wilson', department: 'Sales', amount: 75 },
  { phoneNumber: '+355 69 567 8901', assignedTo: 'David Miller', department: 'Marketing', amount: 70 }
];

// Mock data for financial reports
const reportTypes = [
  { id: 'monthly', name: 'Monthly Expense Report', description: 'Detailed breakdown of all telecom expenses for a specific month' },
  { id: 'quarterly', name: 'Quarterly Summary', description: 'Summary of expenses aggregated by quarter for financial reporting' },
  { id: 'department', name: 'Department Allocation', description: 'Expenses broken down by department for internal cost allocation' },
  { id: 'tax', name: 'Tax Documentation', description: 'Detailed report with tax-relevant information for accounting purposes' },
  { id: 'custom', name: 'Custom Report', description: 'Create a custom report with specific parameters and filters' }
];

const reportFormats = [
  { id: 'pdf', name: 'PDF', icon: PdfIcon },
  { id: 'excel', name: 'Excel', icon: ExcelIcon },
  { id: 'csv', name: 'CSV', icon: DescriptionIcon },
  { id: 'print', name: 'Print', icon: PrintIcon }
];

// Mock data for recommendations
const recommendationsData = [
  {
    id: 1,
    title: 'Optimize data plans for Sales department',
    description: 'Several lines in the Sales department are consistently using less than 50% of their allocated data. Consider downgrading these plans to save costs.',
    potentialSavings: 250,
    impact: 'high',
    effort: 'low',
    lines: ['+355 69 123 4567', '+355 69 456 7890', '+355 69 789 0123'],
    implemented: false
  },
  {
    id: 2,
    title: 'Consolidate international roaming packages',
    description: 'Multiple departments are purchasing separate international roaming packages. Consolidating these into a company-wide package would reduce overall costs.',
    potentialSavings: 320,
    impact: 'high',
    effort: 'medium',
    departments: ['Sales', 'Marketing', 'Executive'],
    implemented: false
  },
  {
    id: 3,
    title: 'Eliminate unused lines',
    description: 'We identified 3 lines with minimal usage over the past 3 months. Consider suspending or canceling these lines.',
    potentialSavings: 180,
    impact: 'medium',
    effort: 'low',
    lines: ['+355 69 222 3333', '+355 69 444 5555', '+355 69 666 7777'],
    implemented: true
  },
  {
    id: 4,
    title: 'Switch to shared data pool for Marketing team',
    description: 'The Marketing team has variable data usage patterns. A shared data pool would optimize costs by allowing flexible allocation based on actual needs.',
    potentialSavings: 210,
    impact: 'medium',
    effort: 'medium',
    departments: ['Marketing'],
    implemented: false
  },
  {
    id: 5,
    title: 'Optimize international calling plans',
    description: 'Several lines are making international calls but do not have the optimal international calling plan. Adding these plans would reduce per-minute charges.',
    potentialSavings: 150,
    impact: 'low',
    effort: 'low',
    lines: ['+355 69 234 5678', '+355 69 345 6789'],
    implemented: false
  }
];

const CostControl = () => {
  const [alertSettings, setAlertSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    thresholds: [
      { id: 1, type: 'percentage', value: 80, notificationType: 'warning' },
      { id: 2, type: 'percentage', value: 100, notificationType: 'critical' },
      { id: 3, type: 'amount', value: 1000, notificationType: 'warning' }
    ]
  });

  const [newThreshold, setNewThreshold] = useState({
    type: 'percentage',
    value: 75,
    notificationType: 'warning'
  });

  const [analyticsTab, setAnalyticsTab] = useState(0);
  const [recommendations, setRecommendations] = useState(recommendationsData);
  const [reportSettings, setReportSettings] = useState({
    type: 'monthly',
    format: 'pdf',
    startDate: '2023-06-01',
    endDate: '2023-06-30',
    departments: [],
    includeDetails: true
  });

  const handleAnalyticsTabChange = (event, newValue) => {
    setAnalyticsTab(newValue);
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
    .reduce((sum, rec) => sum + rec.potentialSavings, 0);

  const handleReportSettingChange = (setting, value) => {
    setReportSettings({
      ...reportSettings,
      [setting]: value
    });
  };

  const handleGenerateReport = () => {
    // In a real application, this would trigger an API call to generate the report
    console.log('Generating report with settings:', reportSettings);
    // For demo purposes, we'll just show an alert
    alert(`Report generated successfully! A ${reportSettings.format.toUpperCase()} file has been created.`);
  };

  const handleAlertToggle = (setting) => {
    setAlertSettings({
      ...alertSettings,
      [setting]: !alertSettings[setting]
    });
  };

  const handleAddThreshold = () => {
    const newId = Math.max(0, ...alertSettings.thresholds.map(t => t.id)) + 1;
    setAlertSettings({
      ...alertSettings,
      thresholds: [...alertSettings.thresholds, { ...newThreshold, id: newId }]
    });
    // Reset form
    setNewThreshold({
      type: 'percentage',
      value: 75,
      notificationType: 'warning'
    });
  };

  const handleRemoveThreshold = (id) => {
    setAlertSettings({
      ...alertSettings,
      thresholds: alertSettings.thresholds.filter(threshold => threshold.id !== id)
    });
  };

  const handleThresholdChange = (prop) => (event) => {
    setNewThreshold({
      ...newThreshold,
      [prop]: event.target.value
    });
  };

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
            const element = document.getElementById('budget-limits');
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
          Budget Limits
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            const element = document.getElementById('spending-alerts');
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
          Spending Alerts
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            const element = document.getElementById('cost-analytics');
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
          Cost Analytics
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            const element = document.getElementById('optimization-recommendations');
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
          Optimization Tips
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            const element = document.getElementById('financial-reports');
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
          Financial Reports
        </Button>
      </Box>

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
          px: 3,
          bgcolor: '#6A1B9A',
          border: '1px solid #6A1B9A',
          py: 2,
          borderRadius: 0.5
        }}>
          <Typography
            variant="h4"
            className="mont-bold"
            sx={{
              color: 'white',
              textAlign: 'center'
            }}
          >
            Set budget limits for individual lines and departments
          </Typography>
        </Box>
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
          Cost Control
        </Typography>

        <Typography variant="h6" color="text.secondary" className="co-text" sx={{
          mb: 3,
          maxWidth: '800px',
          mx: 'auto'
        }}>
          Manage and optimize your telecom spending
        </Typography>
      </Box>


      <Box
        id="budget-limits"
        sx={{
          mb: 6,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          maxWidth: '1200px'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: 0.4,
            overflow: 'hidden',
            border: '2px solid #6A1B9A',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{
            p: 3,
            borderBottom: '1px solid rgba(106, 27, 154, 0.08)',
            background: 'linear-gradient(to right, rgba(106, 27, 154, 0.07), rgba(149, 117, 205, 0.07))'
          }}>
            <Typography variant="h5" className="mont-semibold" sx={{ color: '#6A1B9A', mb: 1, fontWeight: 'bold' }}>
              Budget Limits
            </Typography>
            <Typography variant="body1" color="text.secondary" className="co-text">
              Set budget limits for individual lines and departments
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" className="mont-semibold" sx={{ mb: 2, color: '#6A1B9A' }}>
                    Department Limits
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, borderColor: 'rgba(106, 27, 154, 0.1)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" className="mont-medium">Sales Department</Typography>
                      <Typography variant="body2">€500 / month</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" className="mont-medium">Marketing Department</Typography>
                      <Typography variant="body2">€350 / month</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" className="mont-medium">IT Department</Typography>
                      <Typography variant="body2">€800 / month</Typography>
                    </Box>
                    <Button
                      size="small"
                      sx={{ mt: 2, color: '#6A1B9A', '&:hover': { backgroundColor: 'rgba(106, 27, 154, 0.08)' } }}
                      startIcon={<AddIcon />}
                    >
                      Add Department
                    </Button>
                  </Paper>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle1" className="mont-semibold" sx={{ mb: 2, color: '#6A1B9A' }}>
                    Individual Line Limits
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, borderColor: 'rgba(106, 27, 154, 0.1)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" className="mont-medium">+355 69 123 4567</Typography>
                      <Typography variant="body2">€80 / month</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" className="mont-medium">+355 69 234 5678</Typography>
                      <Typography variant="body2">€60 / month</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" className="mont-medium">+355 69 345 6789</Typography>
                      <Typography variant="body2">€40 / month</Typography>
                    </Box>
                    <Button
                      size="small"
                      sx={{ mt: 2, color: '#6A1B9A', '&:hover': { backgroundColor: 'rgba(106, 27, 154, 0.08)' } }}
                      startIcon={<AddIcon />}
                    >
                      Add Line Limit
                    </Button>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      {/* Spending Alerts Section */}
      <Box
        id="spending-alerts"
        sx={{
          mb: 6,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          maxWidth: '1200px',
          mt: 6
        }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 0.4,
            overflow: 'hidden',
            border: '2px solid #6A1B9A',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{
            p: 3,
            borderBottom: '1px solid rgba(106, 27, 154, 0.08)',
            background: 'linear-gradient(to right, rgba(106, 27, 154, 0.07), rgba(149, 117, 205, 0.07))'
          }}>
            <Typography variant="h5" className="mont-semibold" sx={{ color: '#6A1B9A', mb: 1, fontWeight: 'bold' }}>
              <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Spending Alerts
            </Typography>
            <Typography variant="body1" color="text.secondary" className="co-text">
              Receive alerts when spending thresholds are reached
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" className="mont-semibold" sx={{ mb: 2, color: '#6A1B9A' }}>
                    Notification Preferences
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, borderColor: 'rgba(106, 27, 154, 0.1)' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={alertSettings.emailAlerts}
                          onChange={() => handleAlertToggle('emailAlerts')}
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EmailIcon sx={{ mr: 1, color: '#6A1B9A' }} />
                          <Typography>Email Alerts</Typography>
                        </Box>
                      }
                      sx={{ mb: 1, width: '100%' }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={alertSettings.smsAlerts}
                          onChange={() => handleAlertToggle('smsAlerts')}
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SmsIcon sx={{ mr: 1, color: '#6A1B9A' }} />
                          <Typography>SMS Alerts</Typography>
                        </Box>
                      }
                      sx={{ mb: 1, width: '100%' }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={alertSettings.pushNotifications}
                          onChange={() => handleAlertToggle('pushNotifications')}
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <NotificationsIcon sx={{ mr: 1, color: '#6A1B9A' }} />
                          <Typography>Push Notifications</Typography>
                        </Box>
                      }
                      sx={{ width: '100%' }}
                    />
                  </Paper>
                </Box>

                <Box>
                  <Typography variant="subtitle1" className="mont-semibold" sx={{ mb: 2, color: '#6A1B9A' }}>
                    Add New Threshold
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, borderColor: 'rgba(106, 27, 154, 0.1)' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Type</InputLabel>
                          <Select
                            value={newThreshold.type}
                            label="Type"
                            onChange={handleThresholdChange('type')}
                          >
                            <MenuItem value="percentage">Percentage</MenuItem>
                            <MenuItem value="amount">Amount (€)</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Value"
                          type="number"
                          size="small"
                          fullWidth
                          value={newThreshold.value}
                          onChange={handleThresholdChange('value')}
                          InputProps={{
                            endAdornment: newThreshold.type === 'percentage' ? '%' : '€'
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Alert Type</InputLabel>
                          <Select
                            value={newThreshold.notificationType}
                            label="Alert Type"
                            onChange={handleThresholdChange('notificationType')}
                          >
                            <MenuItem value="info">Info</MenuItem>
                            <MenuItem value="warning">Warning</MenuItem>
                            <MenuItem value="critical">Critical</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                        backgroundColor: '#6A1B9A',
                        '&:hover': { backgroundColor: '#7B1FA2' },
                        borderRadius: 0
                      }}
                      startIcon={<AddIcon />}
                      onClick={handleAddThreshold}
                    >
                      Add Threshold
                    </Button>
                  </Paper>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle1" className="mont-semibold" sx={{ mb: 2, color: '#6A1B9A' }}>
                    Current Thresholds
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, borderColor: 'rgba(106, 27, 154, 0.1)' }}>
                    {alertSettings.thresholds.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                        No thresholds set. Add a threshold to receive alerts.
                      </Typography>
                    ) : (
                      alertSettings.thresholds.map((threshold) => (
                        <Box
                          key={threshold.id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                            p: 1.5,
                            borderRadius: 1,
                            bgcolor: 'rgba(106, 27, 154, 0.03)',
                            border: '1px solid rgba(106, 27, 154, 0.05)'
                          }}
                        >
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Typography variant="body1" className="mont-medium">
                                {threshold.type === 'percentage' ? `${threshold.value}%` : `€${threshold.value}`}
                              </Typography>
                              <Chip
                                label={threshold.notificationType}
                                size="small"
                                color={
                                  threshold.notificationType === 'critical' ? 'error' :
                                  threshold.notificationType === 'warning' ? 'warning' : 'info'
                                }
                                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {threshold.type === 'percentage'
                                ? `Alert when ${threshold.value}% of budget is used`
                                : `Alert when €${threshold.value} is spent`}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRemoveThreshold(threshold.id)}
                            sx={{ minWidth: 'auto', p: 0.5 }}
                          >
                            Remove
                          </Button>
                        </Box>
                      ))
                    )}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      <WarningIcon sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 0.5, color: '#f57c00' }} />
                      Alerts will be sent to all enabled notification channels.
                    </Typography>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      {/* Cost Breakdown and Analytics Section */}
      <Box
        id="cost-analytics"
        sx={{
          mb: 6,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          maxWidth: '1200px',
          mt: 6
        }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 0.4,
            overflow: 'hidden',
            border: '2px solid #6A1B9A',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{
            p: 3,
            borderBottom: '1px solid rgba(106, 27, 154, 0.08)',
            background: 'linear-gradient(to right, rgba(106, 27, 154, 0.07), rgba(149, 117, 205, 0.07))'
          }}>
            <Typography variant="h5" className="mont-semibold" sx={{ color: '#6A1B9A', mb: 1, fontWeight: 'bold' }}>
              <BarChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Cost Breakdown & Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary" className="co-text">
              View detailed cost breakdowns and analytics for your telecom spending
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            {/* Analytics Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={analyticsTab}
                onChange={handleAnalyticsTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    color: 'rgba(106, 27, 154, 0.7)',
                    '&.Mui-selected': {
                      color: '#6A1B9A',
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#6A1B9A',
                  }
                }}
              >
                <Tab label="Overview" icon={<PieChartIcon />} iconPosition="start" />
                <Tab label="Monthly Trends" icon={<TrendingUpIcon />} iconPosition="start" />
                <Tab label="Department Analysis" icon={<GroupIcon />} iconPosition="start" />
                <Tab label="Top Spenders" icon={<PhoneIcon />} iconPosition="start" />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box role="tabpanel" hidden={analyticsTab !== 0} sx={{ mb: 3 }}>
              {analyticsTab === 0 && (
                <Grid container spacing={3}>
                  {/* Cost Breakdown Chart */}
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2, height: '100%', borderColor: 'rgba(106, 27, 154, 0.1)' }}>
                      <Typography variant="subtitle1" className="mont-semibold" sx={{ mb: 2, color: '#6A1B9A' }}>
                        Cost Breakdown by Category
                      </Typography>

                      {/* Placeholder for Pie Chart */}
                      <Box sx={{
                        height: 250,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'rgba(106, 27, 154, 0.03)',
                        borderRadius: 1,
                        p: 2
                      }}>
                        <PieChartIcon sx={{ fontSize: 80, color: 'rgba(106, 27, 154, 0.2)', mb: 2 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                          Pie chart visualization showing cost breakdown by category
                        </Typography>
                      </Box>

                      {/* Legend */}
                      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {costBreakdownData.map((item) => (
                          <Box key={item.category} sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: 1 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color, mr: 1 }} />
                            <Typography variant="body2">{item.category}: {item.value}%</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Monthly Spending */}
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2, height: '100%', borderColor: 'rgba(106, 27, 154, 0.1)' }}>
                      <Typography variant="subtitle1" className="mont-semibold" sx={{ mb: 2, color: '#6A1B9A' }}>
                        Monthly Spending Trend
                      </Typography>

                      {/* Placeholder for Bar Chart */}
                      <Box sx={{
                        height: 250,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'rgba(106, 27, 154, 0.03)',
                        borderRadius: 1,
                        p: 2
                      }}>
                        <BarChartIcon sx={{ fontSize: 80, color: 'rgba(106, 27, 154, 0.2)', mb: 2 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                          Bar chart visualization showing monthly spending trends
                        </Typography>
                      </Box>

                      {/* Data */}
                      <Box sx={{ mt: 2 }}>
                        <Grid container spacing={1}>
                          {monthlySpendingData.map((item) => (
                            <Grid item xs={4} sm={2} key={item.month}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">{item.month}</Typography>
                                <Typography variant="body1" className="mont-semibold">€{item.amount}</Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </Box>

            <Box role="tabpanel" hidden={analyticsTab !== 1} sx={{ mb: 3 }}>
              {analyticsTab === 1 && (
                <Paper variant="outlined" sx={{ p: 2, borderColor: 'rgba(106, 27, 154, 0.1)' }}>
                  <Typography variant="subtitle1" className="mont-semibold" sx={{ mb: 2, color: '#6A1B9A' }}>
                    Monthly Spending Trends (Last 6 Months)
                  </Typography>

                  {/* Placeholder for Line Chart */}
                  <Box sx={{
                    height: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'rgba(106, 27, 154, 0.03)',
                    borderRadius: 1,
                    p: 2,
                    mb: 3
                  }}>
                    <TrendingUpIcon sx={{ fontSize: 80, color: 'rgba(106, 27, 154, 0.2)', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      Line chart visualization showing detailed monthly spending trends
                    </Typography>
                  </Box>

                  {/* Monthly Data Table */}
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Month</TableCell>
                          <TableCell align="right">Data (€)</TableCell>
                          <TableCell align="right">Calls (€)</TableCell>
                          <TableCell align="right">SMS (€)</TableCell>
                          <TableCell align="right">Roaming (€)</TableCell>
                          <TableCell align="right">Services (€)</TableCell>
                          <TableCell align="right">Total (€)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {monthlySpendingData.map((item) => (
                          <TableRow key={item.month}>
                            <TableCell component="th" scope="row">{item.month}</TableCell>
                            <TableCell align="right">{Math.round(item.amount * 0.45)}</TableCell>
                            <TableCell align="right">{Math.round(item.amount * 0.3)}</TableCell>
                            <TableCell align="right">{Math.round(item.amount * 0.05)}</TableCell>
                            <TableCell align="right">{Math.round(item.amount * 0.15)}</TableCell>
                            <TableCell align="right">{Math.round(item.amount * 0.05)}</TableCell>
                            <TableCell align="right" className="mont-semibold">€{item.amount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              )}
            </Box>

            <Box role="tabpanel" hidden={analyticsTab !== 2} sx={{ mb: 3 }}>
              {analyticsTab === 2 && (
                <Paper variant="outlined" sx={{ p: 2, borderColor: 'rgba(106, 27, 154, 0.1)' }}>
                  <Typography variant="subtitle1" className="mont-semibold" sx={{ mb: 2, color: '#6A1B9A' }}>
                    Department Spending Analysis
                  </Typography>

                  {/* Placeholder for Department Chart */}
                  <Box sx={{
                    height: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'rgba(106, 27, 154, 0.03)',
                    borderRadius: 1,
                    p: 2,
                    mb: 3
                  }}>
                    <GroupIcon sx={{ fontSize: 80, color: 'rgba(106, 27, 154, 0.2)', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      Bar chart visualization showing spending by department
                    </Typography>
                  </Box>

                  {/* Department Data Table */}
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Department</TableCell>
                          <TableCell align="right">Amount (€)</TableCell>
                          <TableCell align="right">Percentage</TableCell>
                          <TableCell align="right">Lines</TableCell>
                          <TableCell align="right">Avg. per Line (€)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {departmentSpendingData.map((item) => (
                          <TableRow key={item.department}>
                            <TableCell component="th" scope="row">{item.department}</TableCell>
                            <TableCell align="right">€{item.amount}</TableCell>
                            <TableCell align="right">{item.percentage}%</TableCell>
                            <TableCell align="right">{Math.floor(item.amount / 100)}</TableCell>
                            <TableCell align="right">€{Math.round(item.amount / Math.floor(item.amount / 100))}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              )}
            </Box>

            <Box role="tabpanel" hidden={analyticsTab !== 3} sx={{ mb: 3 }}>
              {analyticsTab === 3 && (
                <Paper variant="outlined" sx={{ p: 2, borderColor: 'rgba(106, 27, 154, 0.1)' }}>
                  <Typography variant="subtitle1" className="mont-semibold" sx={{ mb: 2, color: '#6A1B9A' }}>
                    Top Spenders
                  </Typography>

                  {/* Top Spenders Table */}
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Phone Number</TableCell>
                          <TableCell>Assigned To</TableCell>
                          <TableCell>Department</TableCell>
                          <TableCell align="right">Current Month (€)</TableCell>
                          <TableCell align="right">Previous Month (€)</TableCell>
                          <TableCell align="right">Change</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topSpendersData.map((item) => {
                          const prevAmount = Math.round(item.amount * (0.8 + Math.random() * 0.4));
                          const change = Math.round((item.amount - prevAmount) / prevAmount * 100);

                          return (
                            <TableRow key={item.phoneNumber}>
                              <TableCell component="th" scope="row">{item.phoneNumber}</TableCell>
                              <TableCell>{item.assignedTo}</TableCell>
                              <TableCell>{item.department}</TableCell>
                              <TableCell align="right">€{item.amount}</TableCell>
                              <TableCell align="right">€{prevAmount}</TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  color: change > 0 ? '#d32f2f' : change < 0 ? '#2e7d32' : 'inherit',
                                  fontWeight: 'bold'
                                }}
                              >
                                {change > 0 ? '+' : ''}{change}%
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      sx={{
                        color: '#6A1B9A',
                        borderColor: '#6A1B9A',
                        '&:hover': {
                          borderColor: '#7B1FA2',
                          backgroundColor: 'rgba(106, 27, 154, 0.04)'
                        },
                        borderRadius: 0
                      }}
                    >
                      Export Report
                    </Button>
                  </Box>
                </Paper>
              )}
            </Box>

            {/* Export Options */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                sx={{
                  color: '#6A1B9A',
                  borderColor: '#6A1B9A',
                  '&:hover': {
                    borderColor: '#7B1FA2',
                    backgroundColor: 'rgba(106, 27, 154, 0.04)'
                  },
                  borderRadius: 0,
                  mr: 2
                }}
              >
                Export as PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                sx={{
                  color: '#6A1B9A',
                  borderColor: '#6A1B9A',
                  '&:hover': {
                    borderColor: '#7B1FA2',
                    backgroundColor: 'rgba(106, 27, 154, 0.04)'
                  },
                  borderRadius: 0
                }}
              >
                Export as Excel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Cost Optimization Recommendations Section */}
      <Box
        id="optimization-recommendations"
        sx={{
          mb: 6,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          maxWidth: '1200px',
          mt: 6
        }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 0.4,
            overflow: 'hidden',
            border: '2px solid #6A1B9A',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{
            p: 3,
            borderBottom: '1px solid rgba(106, 27, 154, 0.08)',
            background: 'linear-gradient(to right, rgba(106, 27, 154, 0.07), rgba(149, 117, 205, 0.07))'
          }}>
            <Typography variant="h5" className="mont-semibold" sx={{ color: '#6A1B9A', mb: 1, fontWeight: 'bold' }}>
              <LightbulbIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Cost Optimization Recommendations
            </Typography>
            <Typography variant="body1" color="text.secondary" className="co-text">
              Smart recommendations to optimize your telecom spending
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            {/* Potential Savings Summary */}
            <Box sx={{
              mb: 4,
              p: 2,
              borderRadius: 1,
              background: 'linear-gradient(45deg, rgba(106, 27, 154, 0.08), rgba(149, 117, 205, 0.08))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SavingsIcon sx={{ fontSize: 40, color: '#6A1B9A', mr: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Potential Monthly Savings
                  </Typography>
                  <Typography variant="h4" className="mont-bold" sx={{ color: '#6A1B9A' }}>
                    €{totalPotentialSavings}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: { xs: 2, sm: 0 } }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {recommendations.filter(rec => !rec.implemented).length} recommendations available
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: '#6A1B9A',
                    '&:hover': { backgroundColor: '#7B1FA2' },
                    borderRadius: 0
                  }}
                >
                  Implement All
                </Button>
              </Box>
            </Box>

            {/* Recommendations List */}
            <Box>
              {recommendations.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderColor: 'rgba(106, 27, 154, 0.1)' }}>
                  <CheckCircleIcon sx={{ fontSize: 60, color: '#6A1B9A', opacity: 0.5, mb: 2 }} />
                  <Typography variant="h6" className="mont-semibold" sx={{ mb: 1 }}>
                    All Caught Up!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    You've implemented all our recommendations. We'll notify you when new opportunities are identified.
                  </Typography>
                </Paper>
              ) : (
                recommendations.map((recommendation) => (
                  <Paper
                    key={recommendation.id}
                    variant="outlined"
                    sx={{
                      p: 3,
                      mb: 3,
                      borderColor: recommendation.implemented ? 'rgba(46, 125, 50, 0.3)' : 'rgba(106, 27, 154, 0.1)',
                      backgroundColor: recommendation.implemented ? 'rgba(46, 125, 50, 0.05)' : 'transparent',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {recommendation.implemented && (
                      <Box sx={{
                        position: 'absolute',
                        top: 16,
                        right: -30,
                        transform: 'rotate(45deg)',
                        bgcolor: '#2e7d32',
                        color: 'white',
                        py: 0.5,
                        width: 150,
                        textAlign: 'center'
                      }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                          Implemented
                        </Typography>
                      </Box>
                    )}

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Typography variant="h6" className="mont-semibold" sx={{ mb: 1, color: recommendation.implemented ? '#2e7d32' : '#6A1B9A' }}>
                          {recommendation.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {recommendation.description}
                        </Typography>

                        {/* Affected Lines/Departments */}
                        {recommendation.lines && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" className="mont-medium" sx={{ mb: 0.5 }}>
                              Affected Lines:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {recommendation.lines.map((line) => (
                                <Chip
                                  key={line}
                                  label={line}
                                  size="small"
                                  icon={<PhoneIcon />}
                                  sx={{
                                    bgcolor: 'rgba(106, 27, 154, 0.08)',
                                    color: '#6A1B9A',
                                    '& .MuiChip-icon': { color: '#6A1B9A' }
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}

                        {recommendation.departments && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" className="mont-medium" sx={{ mb: 0.5 }}>
                              Affected Departments:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {recommendation.departments.map((dept) => (
                                <Chip
                                  key={dept}
                                  label={dept}
                                  size="small"
                                  icon={<GroupIcon />}
                                  sx={{
                                    bgcolor: 'rgba(106, 27, 154, 0.08)',
                                    color: '#6A1B9A',
                                    '& .MuiChip-icon': { color: '#6A1B9A' }
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Box sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          alignItems: { xs: 'flex-start', md: 'flex-end' }
                        }}>
                          <Box sx={{ mb: 2, textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography variant="body2" color="text.secondary">
                              Potential Savings
                            </Typography>
                            <Typography variant="h5" className="mont-bold" sx={{ color: recommendation.implemented ? '#2e7d32' : '#6A1B9A' }}>
                              €{recommendation.potentialSavings}/mo
                            </Typography>

                            <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                              <Chip
                                label={`Impact: ${recommendation.impact}`}
                                size="small"
                                sx={{
                                  bgcolor: recommendation.impact === 'high' ? 'rgba(211, 47, 47, 0.1)' :
                                    recommendation.impact === 'medium' ? 'rgba(245, 124, 0, 0.1)' : 'rgba(46, 125, 50, 0.1)',
                                  color: recommendation.impact === 'high' ? '#d32f2f' :
                                    recommendation.impact === 'medium' ? '#f57c00' : '#2e7d32',
                                }}
                              />
                              <Chip
                                label={`Effort: ${recommendation.effort}`}
                                size="small"
                                sx={{
                                  bgcolor: recommendation.effort === 'high' ? 'rgba(211, 47, 47, 0.1)' :
                                    recommendation.effort === 'medium' ? 'rgba(245, 124, 0, 0.1)' : 'rgba(46, 125, 50, 0.1)',
                                  color: recommendation.effort === 'high' ? '#d32f2f' :
                                    recommendation.effort === 'medium' ? '#f57c00' : '#2e7d32',
                                }}
                              />
                            </Box>
                          </Box>

                          {!recommendation.implemented && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleImplementRecommendation(recommendation.id)}
                                sx={{
                                  backgroundColor: '#6A1B9A',
                                  '&:hover': { backgroundColor: '#7B1FA2' },
                                  borderRadius: 0
                                }}
                              >
                                Implement
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleDismissRecommendation(recommendation.id)}
                                sx={{
                                  color: '#6A1B9A',
                                  borderColor: '#6A1B9A',
                                  '&:hover': {
                                    borderColor: '#7B1FA2',
                                    backgroundColor: 'rgba(106, 27, 154, 0.04)'
                                  },
                                  borderRadius: 0
                                }}
                              >
                                Dismiss
                              </Button>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                ))
              )}
            </Box>

            {/* Generate New Recommendations */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<LightbulbIcon />}
                sx={{
                  color: '#6A1B9A',
                  borderColor: '#6A1B9A',
                  '&:hover': {
                    borderColor: '#7B1FA2',
                    backgroundColor: 'rgba(106, 27, 154, 0.04)'
                  },
                  borderRadius: 0,
                  px: 4,
                  py: 1
                }}
              >
                Generate New Recommendations
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Our AI analyzes your usage patterns to find new optimization opportunities
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Financial Reports Section */}
      <Box
        id="financial-reports"
        sx={{
          mb: 6,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          maxWidth: '1200px',
          mt: 6
        }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 0.4,
            overflow: 'hidden',
            border: '2px solid #6A1B9A',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{
            p: 3,
            borderBottom: '1px solid rgba(106, 27, 154, 0.08)',
            background: 'linear-gradient(to right, rgba(106, 27, 154, 0.07), rgba(149, 117, 205, 0.07))'
          }}>
            <Typography variant="h5" className="mont-semibold" sx={{ color: '#6A1B9A', mb: 1, fontWeight: 'bold' }}>
              <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Financial Reports for Accounting
            </Typography>
            <Typography variant="body1" color="text.secondary" className="co-text">
              Generate and export detailed financial reports for accounting purposes
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Report Types */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" className="mont-semibold" sx={{ mb: 2, color: '#6A1B9A' }}>
                  Report Type
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderColor: 'rgba(106, 27, 154, 0.1)' }}>
                  <Grid container spacing={2}>
                    {reportTypes.map((type) => (
                      <Grid item xs={12} key={type.id}>
                        <Box
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: reportSettings.type === type.id ? '#6A1B9A' : 'rgba(0, 0, 0, 0.12)',
                            borderRadius: 0,
                            cursor: 'pointer',
                            bgcolor: reportSettings.type === type.id ? 'rgba(106, 27, 154, 0.05)' : 'transparent',
                            '&:hover': {
                              borderColor: '#6A1B9A',
                              bgcolor: 'rgba(106, 27, 154, 0.03)'
                            }
                          }}
                          onClick={() => handleReportSettingChange('type', type.id)}
                        >
                          <Typography variant="body1" className="mont-semibold">
                            {type.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {type.description}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>

              {/* Report Settings */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" className="mont-semibold" sx={{ mb: 2, color: '#6A1B9A' }}>
                  Report Settings
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderColor: 'rgba(106, 27, 154, 0.1)' }}>
                  {/* Date Range */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" className="mont-medium" sx={{ mb: 1 }}>
                      <DateRangeIcon sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
                      Date Range
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="Start Date"
                          type="date"
                          size="small"
                          fullWidth
                          value={reportSettings.startDate}
                          onChange={(e) => handleReportSettingChange('startDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="End Date"
                          type="date"
                          size="small"
                          fullWidth
                          value={reportSettings.endDate}
                          onChange={(e) => handleReportSettingChange('endDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Department Filter */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" className="mont-medium" sx={{ mb: 1 }}>
                      <FilterListIcon sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
                      Filters
                    </Typography>
                    <FormControl fullWidth size="small">
                      <InputLabel>Departments</InputLabel>
                      <Select
                        multiple
                        value={reportSettings.departments}
                        onChange={(e) => handleReportSettingChange('departments', e.target.value)}
                        label="Departments"
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        <MenuItem value="Sales">Sales</MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                        <MenuItem value="IT">IT</MenuItem>
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="Finance">Finance</MenuItem>
                        <MenuItem value="Operations">Operations</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Include Details */}
                  <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={reportSettings.includeDetails}
                          onChange={(e) => handleReportSettingChange('includeDetails', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Include line-by-line details"
                    />
                  </Box>

                  {/* Export Format */}
                  <Box>
                    <Typography variant="body2" className="mont-medium" sx={{ mb: 1 }}>
                      Export Format
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {reportFormats.map((format) => {
                        const FormatIcon = format.icon;
                        return (
                          <Button
                            key={format.id}
                            variant={reportSettings.format === format.id ? "contained" : "outlined"}
                            startIcon={<FormatIcon />}
                            onClick={() => handleReportSettingChange('format', format.id)}
                            sx={{
                              borderRadius: 0,
                              ...(reportSettings.format === format.id
                                ? {
                                    backgroundColor: '#6A1B9A',
                                    '&:hover': { backgroundColor: '#7B1FA2' }
                                  }
                                : {
                                    color: '#6A1B9A',
                                    borderColor: '#6A1B9A',
                                    '&:hover': {
                                      borderColor: '#7B1FA2',
                                      backgroundColor: 'rgba(106, 27, 154, 0.04)'
                                    }
                                  }
                              )
                            }}
                          >
                            {format.name}
                          </Button>
                        );
                      })}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Generate Report Button */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<DownloadIcon />}
                onClick={handleGenerateReport}
                sx={{
                  backgroundColor: '#6A1B9A',
                  '&:hover': { backgroundColor: '#7B1FA2' },
                  borderRadius: 0,
                  px: 4,
                  py: 1.5
                }}
              >
                Generate Report
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Reports are generated in real-time and can be downloaded immediately
              </Typography>
            </Box>

            {/* Recently Generated Reports */}
            <Box sx={{ mt: 5 }}>
              <Typography variant="subtitle1" className="mont-semibold" sx={{ mb: 2, color: '#6A1B9A' }}>
                Recently Generated Reports
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ borderColor: 'rgba(106, 27, 154, 0.1)' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Report Name</TableCell>
                      <TableCell>Date Range</TableCell>
                      <TableCell>Generated On</TableCell>
                      <TableCell>Format</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Monthly Expense Report</TableCell>
                      <TableCell>May 1 - May 31, 2023</TableCell>
                      <TableCell>Jun 2, 2023</TableCell>
                      <TableCell>PDF</TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          startIcon={<DownloadIcon />}
                          sx={{ color: '#6A1B9A' }}
                        >
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Quarterly Summary</TableCell>
                      <TableCell>Jan 1 - Mar 31, 2023</TableCell>
                      <TableCell>Apr 5, 2023</TableCell>
                      <TableCell>Excel</TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          startIcon={<DownloadIcon />}
                          sx={{ color: '#6A1B9A' }}
                        >
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Department Allocation</TableCell>
                      <TableCell>Apr 1 - Apr 30, 2023</TableCell>
                      <TableCell>May 3, 2023</TableCell>
                      <TableCell>Excel</TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          startIcon={<DownloadIcon />}
                          sx={{ color: '#6A1B9A' }}
                        >
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

          </Box>

        </Paper>
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
          px: { xs: 2, sm: 3, md: 4 },
          mx: 0, // No margin for true edge-to-edge
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '1200px' }}>
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

    </Box>

  );
};

export default CostControl;








