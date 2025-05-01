import React from 'react';
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
  Chip
} from '@mui/material';
import { 
  TrendingUp, 
  Warning, 
  CheckCircle,
  PhoneInTalk,
  DataUsage,
  Message,
  Lightbulb
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { 
  telecomLines, 
  usageHistory, 
  costBreakdown, 
  usageAlerts,
  aiRecommendations
} from '../../data/mockData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardHome = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Welcome to your ONE Albania SME Dashboard. Here's an overview of your telecom services.
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Active Lines
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
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
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Data Usage
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
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
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Monthly Cost
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
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
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Active Alerts
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
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
      <Grid container spacing={3}>
        {/* Usage Chart */}
        <Grid item xs={12} md={8}>
          <Card elevation={0}>
            <CardHeader title="Monthly Usage Trends" />
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
                  <Bar dataKey="data" name="Data (GB)" fill="#8884d8" />
                  <Bar dataKey="calls" name="Calls (hours)" fill="#82ca9d" />
                  <Bar dataKey="sms" name="SMS (hundreds)" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Cost Breakdown */}
        <Grid item xs={12} md={4}>
          <Card elevation={0}>
            <CardHeader title="Cost Breakdown" />
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
            <CardHeader title="Line Usage" />
            <CardContent>
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
                      <Box sx={{ width: '40%', mr: 1 }}>
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
                      <Typography variant="body2">
                        {line.currentUsage}/{line.monthlyLimit} GB
                      </Typography>
                    </ListItem>
                    {telecomLines.indexOf(line) < telecomLines.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button variant="outlined" size="small">View All Lines</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Recommendations */}
        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardHeader 
              title="AI Recommendations" 
              action={
                <Button 
                  startIcon={<Lightbulb />} 
                  color="primary"
                  size="small"
                >
                  View All
                </Button>
              }
            />
            <CardContent>
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
            <CardHeader title="Recent Alerts" />
            <CardContent>
              <Grid container spacing={2}>
                {usageAlerts.map((alert) => {
                  const line = telecomLines.find(l => l.id === alert.lineId);
                  return (
                    <Grid item xs={12} sm={6} md={3} key={alert.id}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
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
                        <Typography variant="body2" paragraph>
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
    </Box>
  );
};

export default DashboardHome;
