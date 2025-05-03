import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  TrendingDown as TrendingDownIcon,
  DataUsage as DataUsageIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Savings as SavingsIcon
} from '@mui/icons-material';

const CostOptimization = ({ recommendations, loading }) => {
  // Format currency
  const formatCurrency = (amount, currency = 'EUR') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Get icon based on recommendation type
  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'data_plan_downgrade':
        return <DataUsageIcon />;
      case 'shared_data_plan':
        return <BusinessIcon />;
      case 'international_calling_plan':
        return <PhoneIcon />;
      default:
        return <TrendingDownIcon />;
    }
  };

  // Get color based on potential savings
  const getSavingsColor = (savings) => {
    if (savings >= 50) return 'error';
    if (savings >= 20) return 'warning';
    return 'success';
  };

  // Calculate total potential savings
  const calculateTotalSavings = () => {
    return recommendations.reduce((total, rec) => total + (rec.potential_savings || 0), 0);
  };

  return (
    <>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Cost Optimization Recommendations</Typography>
        </Box>
      </Grid>

      {/* Total Potential Savings */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Potential Monthly Savings
          </Typography>
          <Typography variant="h3" color="primary" gutterBottom>
            {loading ? (
              <CircularProgress />
            ) : (
              formatCurrency(calculateTotalSavings())
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Implementing all recommendations could result in these estimated savings.
          </Typography>
        </Paper>
      </Grid>

      {/* Recommendations */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Recommendations
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : recommendations.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No optimization recommendations available at this time.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              We'll continue to analyze your usage patterns and provide recommendations when available.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {recommendations.map((recommendation, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 2, color: 'primary.main' }}>
                          {getRecommendationIcon(recommendation.type)}
                        </Box>
                        <Typography variant="h6">
                          {recommendation.type === 'data_plan_downgrade' && 'Data Plan Optimization'}
                          {recommendation.type === 'shared_data_plan' && 'Shared Data Plan'}
                          {recommendation.type === 'international_calling_plan' && 'International Calling Plan'}
                        </Typography>
                      </Box>
                      <Chip
                        icon={<SavingsIcon />}
                        label={formatCurrency(recommendation.potential_savings || 0)}
                        color={getSavingsColor(recommendation.potential_savings)}
                        variant="outlined"
                      />
                    </Box>
                    
                    <Typography variant="body1" paragraph>
                      {recommendation.message}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    {recommendation.type === 'data_plan_downgrade' && (
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Line" 
                            secondary={`${recommendation.phone_number} (${recommendation.assigned_to})`} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Current Plan" 
                            secondary={recommendation.current_plan} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Data Limit" 
                            secondary={`${recommendation.current_data_limit} GB`} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Average Data Used" 
                            secondary={`${recommendation.avg_data_used.toFixed(2)} GB`} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Maximum Data Used" 
                            secondary={`${recommendation.max_data_used.toFixed(2)} GB`} 
                          />
                        </ListItem>
                      </List>
                    )}
                    
                    {recommendation.type === 'shared_data_plan' && (
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Department" 
                            secondary={recommendation.department} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Number of Lines" 
                            secondary={recommendation.line_count} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Total Cost" 
                            secondary={formatCurrency(recommendation.total_cost)} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Cost Per Line" 
                            secondary={formatCurrency(recommendation.cost_per_line)} 
                          />
                        </ListItem>
                      </List>
                    )}
                    
                    {recommendation.type === 'international_calling_plan' && (
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Line" 
                            secondary={`${recommendation.phone_number} (${recommendation.assigned_to})`} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="International Calls Cost" 
                            secondary={formatCurrency(recommendation.international_calls_cost)} 
                          />
                        </ListItem>
                      </List>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Apply Recommendation
                    </Button>
                    <Button size="small">
                      Dismiss
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default CostOptimization;
