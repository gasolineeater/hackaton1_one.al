import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Box,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
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
import { costControlService } from '../../services/api.service';

const CostBreakdown = ({ costBreakdowns, costTrends, onGenerateBreakdown, loading }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [breakdownType, setBreakdownType] = useState(0);
  const [lineBreakdown, setLineBreakdown] = useState([]);
  const [departmentBreakdown, setDepartmentBreakdown] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState(null);
  const [loadingBreakdown, setLoadingBreakdown] = useState(false);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Handle year change
  const handleYearChange = (event) => {
    setYear(parseInt(event.target.value));
  };

  // Handle month change
  const handleMonthChange = (event) => {
    setMonth(parseInt(event.target.value));
  };

  // Handle breakdown type change
  const handleBreakdownTypeChange = (event, newValue) => {
    setBreakdownType(newValue);
    loadBreakdownData(newValue);
  };

  // Load breakdown data when component mounts or when year/month changes
  useEffect(() => {
    loadBreakdownData(breakdownType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, breakdownType]);

  // Load breakdown data based on type
  const loadBreakdownData = async (type) => {
    setLoadingBreakdown(true);
    try {
      let response;

      switch (type) {
        case 0: // By Category
          response = await costControlService.getCostByCategory(year, month);
          setCategoryBreakdown(response.data.breakdown);
          break;
        case 1: // By Line
          response = await costControlService.getCostByLine(year, month);
          setLineBreakdown(response.data.breakdown || []);
          break;
        case 2: // By Department
          response = await costControlService.getCostByDepartment(year, month);
          setDepartmentBreakdown(response.data.breakdown || []);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error loading breakdown data:', error);
    } finally {
      setLoadingBreakdown(false);
    }
  };

  // Generate cost breakdown
  const handleGenerateBreakdown = () => {
    onGenerateBreakdown(year, month);
  };

  // Format currency
  const formatCurrency = (amount, currency = 'EUR') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Prepare data for category pie chart
  const prepareCategoryData = () => {
    if (!categoryBreakdown) return [];

    // Ensure all properties exist and are numbers
    const dataCost = typeof categoryBreakdown.data_cost === 'number' ? categoryBreakdown.data_cost : 0;
    const callsCost = typeof categoryBreakdown.calls_cost === 'number' ? categoryBreakdown.calls_cost : 0;
    const smsCost = typeof categoryBreakdown.sms_cost === 'number' ? categoryBreakdown.sms_cost : 0;
    const otherCost = typeof categoryBreakdown.other_cost === 'number' ? categoryBreakdown.other_cost : 0;

    return [
      { name: 'Data', value: dataCost },
      { name: 'Calls', value: callsCost },
      { name: 'SMS', value: smsCost },
      { name: 'Other', value: otherCost }
    ].filter(item => item.value > 0);
  };

  // Prepare data for cost trends chart
  const prepareTrendData = () => {
    if (!costTrends || !Array.isArray(costTrends)) return [];
    return costTrends.map(trend => ({
      name: `${trend.year}-${trend.month}`,
      data: trend.data_cost || 0,
      calls: trend.calls_cost || 0,
      sms: trend.sms_cost || 0,
      other: trend.other_cost || 0,
      total: trend.total_cost || 0
    }));
  };

  // Get month name
  const getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1];
  };

  return (
    <>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Cost Breakdown</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              select
              label="Year"
              value={year}
              onChange={handleYearChange}
              size="small"
              sx={{ width: 100 }}
            >
              {[...Array(5)].map((_, i) => {
                const yearValue = new Date().getFullYear() - 2 + i;
                return (
                  <MenuItem key={yearValue} value={yearValue}>
                    {yearValue}
                  </MenuItem>
                );
              })}
            </TextField>
            <TextField
              select
              label="Month"
              value={month}
              onChange={handleMonthChange}
              size="small"
              sx={{ width: 120 }}
            >
              {[...Array(12)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {getMonthName(i + 1)}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateBreakdown}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Generate Breakdown'}
            </Button>
          </Box>
        </Box>
      </Grid>

      {/* Cost Trends Chart */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Cost Trends (Last 12 Months)
          </Typography>
          <Box sx={{ height: 400 }}>
            {!costTrends || !Array.isArray(costTrends) || costTrends.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="body1" color="text.secondary">
                  No trend data available
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prepareTrendData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="data" stackId="a" fill="#0088FE" name="Data" />
                  <Bar dataKey="calls" stackId="a" fill="#00C49F" name="Calls" />
                  <Bar dataKey="sms" stackId="a" fill="#FFBB28" name="SMS" />
                  <Bar dataKey="other" stackId="a" fill="#FF8042" name="Other" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Paper>
      </Grid>

      {/* Breakdown Tabs */}
      <Grid item xs={12}>
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={breakdownType}
            onChange={handleBreakdownTypeChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="By Category" />
            <Tab label="By Line" />
            <Tab label="By Department" />
          </Tabs>
        </Paper>
      </Grid>

      {/* Breakdown Content */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          {loadingBreakdown ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* By Category */}
              {breakdownType === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Cost Breakdown by Category
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      {!categoryBreakdown ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                          <Typography variant="body1" color="text.secondary">
                            No category data available
                          </Typography>
                        </Box>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={prepareCategoryData()}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {prepareCategoryData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Category Details
                    </Typography>
                    {!categoryBreakdown ? (
                      <Typography variant="body1" color="text.secondary">
                        No category data available
                      </Typography>
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Category</TableCell>
                              <TableCell align="right">Amount</TableCell>
                              <TableCell align="right">Percentage</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Data</TableCell>
                              <TableCell align="right">{formatCurrency(categoryBreakdown.data_cost || 0)}</TableCell>
                              <TableCell align="right">
                                {categoryBreakdown.total_cost ?
                                  ((categoryBreakdown.data_cost / categoryBreakdown.total_cost) * 100).toFixed(1) : 0}%
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Calls</TableCell>
                              <TableCell align="right">{formatCurrency(categoryBreakdown.calls_cost || 0)}</TableCell>
                              <TableCell align="right">
                                {categoryBreakdown.total_cost ?
                                  ((categoryBreakdown.calls_cost / categoryBreakdown.total_cost) * 100).toFixed(1) : 0}%
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>SMS</TableCell>
                              <TableCell align="right">{formatCurrency(categoryBreakdown.sms_cost || 0)}</TableCell>
                              <TableCell align="right">
                                {categoryBreakdown.total_cost ?
                                  ((categoryBreakdown.sms_cost / categoryBreakdown.total_cost) * 100).toFixed(1) : 0}%
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Other</TableCell>
                              <TableCell align="right">{formatCurrency(categoryBreakdown.other_cost || 0)}</TableCell>
                              <TableCell align="right">
                                {categoryBreakdown.total_cost ?
                                  ((categoryBreakdown.other_cost / categoryBreakdown.total_cost) * 100).toFixed(1) : 0}%
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Total</strong></TableCell>
                              <TableCell align="right"><strong>{formatCurrency(categoryBreakdown.total_cost || 0)}</strong></TableCell>
                              <TableCell align="right"><strong>100%</strong></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Grid>
                </Grid>
              )}

              {/* By Line */}
              {breakdownType === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Cost Breakdown by Line
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Assigned To</TableCell>
                            <TableCell align="right">Data Cost</TableCell>
                            <TableCell align="right">Calls Cost</TableCell>
                            <TableCell align="right">SMS Cost</TableCell>
                            <TableCell align="right">Other Cost</TableCell>
                            <TableCell align="right">Total Cost</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {lineBreakdown.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} align="center">
                                No line breakdown data available
                              </TableCell>
                            </TableRow>
                          ) : (
                            lineBreakdown.map((line) => (
                              <TableRow key={line.line_id}>
                                <TableCell>{line.phone_number}</TableCell>
                                <TableCell>{line.assigned_to}</TableCell>
                                <TableCell align="right">{formatCurrency(line.data_cost || 0)}</TableCell>
                                <TableCell align="right">{formatCurrency(line.calls_cost || 0)}</TableCell>
                                <TableCell align="right">{formatCurrency(line.sms_cost || 0)}</TableCell>
                                <TableCell align="right">{formatCurrency(line.other_cost || 0)}</TableCell>
                                <TableCell align="right">{formatCurrency(line.total_cost || 0)}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              )}

              {/* By Department */}
              {breakdownType === 2 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Cost Breakdown by Department
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Department</TableCell>
                            <TableCell align="right">Line Count</TableCell>
                            <TableCell align="right">Data Cost</TableCell>
                            <TableCell align="right">Calls Cost</TableCell>
                            <TableCell align="right">SMS Cost</TableCell>
                            <TableCell align="right">Other Cost</TableCell>
                            <TableCell align="right">Total Cost</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {departmentBreakdown.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} align="center">
                                No department breakdown data available
                              </TableCell>
                            </TableRow>
                          ) : (
                            departmentBreakdown.map((dept, index) => (
                              <TableRow key={index}>
                                <TableCell>{dept.department}</TableCell>
                                <TableCell align="right">{dept.line_count}</TableCell>
                                <TableCell align="right">{formatCurrency(dept.data_cost || 0)}</TableCell>
                                <TableCell align="right">{formatCurrency(dept.calls_cost || 0)}</TableCell>
                                <TableCell align="right">{formatCurrency(dept.sms_cost || 0)}</TableCell>
                                <TableCell align="right">{formatCurrency(dept.other_cost || 0)}</TableCell>
                                <TableCell align="right">{formatCurrency(dept.total_cost || 0)}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              )}
            </>
          )}
        </Paper>
      </Grid>
    </>
  );
};

export default CostBreakdown;
