import React, { useState } from 'react';
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
  CardActions,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Description as DescriptionIcon,
  TableChart as TableChartIcon,
  Business as BusinessIcon,
  Smartphone as SmartphoneIcon,
  CalendarToday as CalendarTodayIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';

const FinancialReports = ({ onExport, loading }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [reportType, setReportType] = useState('monthly');
  const [fileFormat, setFileFormat] = useState('csv');

  // Handle year change
  const handleYearChange = (event) => {
    setYear(parseInt(event.target.value));
  };

  // Handle month change
  const handleMonthChange = (event) => {
    setMonth(parseInt(event.target.value));
  };

  // Handle report type change
  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  // Handle file format change
  const handleFileFormatChange = (event) => {
    setFileFormat(event.target.value);
  };

  // Export report
  const handleExport = () => {
    onExport(fileFormat, reportType, year, reportType !== 'monthly' ? month : null);
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
          <Typography variant="h6">Financial Reports</Typography>
        </Box>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Export Options
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">Report Type</FormLabel>
            <RadioGroup
              value={reportType}
              onChange={handleReportTypeChange}
            >
              <FormControlLabel 
                value="monthly" 
                control={<Radio />} 
                label="Monthly Summary" 
              />
              <FormControlLabel 
                value="line" 
                control={<Radio />} 
                label="Line Breakdown" 
              />
              <FormControlLabel 
                value="department" 
                control={<Radio />} 
                label="Department Breakdown" 
              />
            </RadioGroup>
          </FormControl>
          
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">File Format</FormLabel>
            <RadioGroup
              value={fileFormat}
              onChange={handleFileFormatChange}
            >
              <FormControlLabel 
                value="csv" 
                control={<Radio />} 
                label="CSV (Excel compatible)" 
              />
              <FormControlLabel 
                value="json" 
                control={<Radio />} 
                label="JSON" 
              />
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              select
              label="Year"
              value={year}
              onChange={handleYearChange}
              fullWidth
              sx={{ mb: 2 }}
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
            
            {reportType !== 'monthly' && (
              <TextField
                select
                label="Month"
                value={month}
                onChange={handleMonthChange}
                fullWidth
              >
                {[...Array(12)].map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {getMonthName(i + 1)}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={loading ? <CircularProgress size={20} /> : <FileDownloadIcon />}
            onClick={handleExport}
            disabled={loading}
          >
            Export Report
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Available Reports
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <List>
            <ListItem button>
              <ListItemIcon>
                <CalendarTodayIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Monthly Summary Report" 
                secondary="Provides a monthly breakdown of all costs by category (data, calls, SMS, other)." 
              />
            </ListItem>
            
            <ListItem button>
              <ListItemIcon>
                <SmartphoneIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Line Breakdown Report" 
                secondary="Detailed cost breakdown for each telecom line, including data, calls, SMS, and other costs." 
              />
            </ListItem>
            
            <ListItem button>
              <ListItemIcon>
                <BusinessIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Department Breakdown Report" 
                secondary="Cost breakdown by department, showing total costs and per-line averages." 
              />
            </ListItem>
            
            <ListItem button>
              <ListItemIcon>
                <TableChartIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Budget vs. Actual Report" 
                secondary="Comparison of budgeted amounts versus actual spending by entity." 
              />
            </ListItem>
            
            <ListItem button>
              <ListItemIcon>
                <DescriptionIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Annual Summary Report" 
                secondary="Year-to-date summary of all telecom expenses, suitable for accounting purposes." 
              />
            </ListItem>
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body2" color="text.secondary">
            All reports are available in CSV format (compatible with Excel) and JSON format for data integration.
            Reports include detailed breakdowns of costs and usage patterns to help optimize your telecom spending.
          </Typography>
        </Paper>
      </Grid>
    </>
  );
};

export default FinancialReports;
