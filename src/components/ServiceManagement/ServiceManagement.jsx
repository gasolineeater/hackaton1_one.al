import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const ServiceManagement = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Service Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Control and configure your telecom services.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Coming Soon
            </Typography>
            <Typography variant="body1">
              The Service Management module is under development. This section will allow you to:
            </Typography>
            <ul>
              <li>Enable or disable services like roaming, international calls, etc.</li>
              <li>Configure data caps and usage limits</li>
              <li>Manage service add-ons and features</li>
              <li>Set up automated service rules</li>
              <li>Configure user permissions and access controls</li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ServiceManagement;
