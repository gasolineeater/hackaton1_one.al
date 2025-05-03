import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const CostControl = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Cost Control
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Manage and optimize your telecom spending.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Coming Soon
            </Typography>
            <Typography variant="body1">
              The Cost Control module is under development. This section will allow you to:
            </Typography>
            <ul>
              <li>Set budget limits for individual lines and departments</li>
              <li>Receive alerts when spending thresholds are reached</li>
              <li>View detailed cost breakdowns and analytics</li>
              <li>Generate cost optimization recommendations</li>
              <li>Export financial reports for accounting</li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CostControl;
