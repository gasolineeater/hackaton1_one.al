import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const Analytics = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Gain insights from your telecom usage data.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Coming Soon
            </Typography>
            <Typography variant="body1">
              The Analytics module is under development. This section will provide:
            </Typography>
            <ul>
              <li>Detailed usage trends and patterns</li>
              <li>Comparative analysis across departments and time periods</li>
              <li>Anomaly detection and usage alerts</li>
              <li>Customizable reports and dashboards</li>
              <li>Data export capabilities for further analysis</li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
