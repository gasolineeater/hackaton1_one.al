import React from 'react';
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
  Chip
} from '@mui/material';
import { 
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

import { aiRecommendations } from '../../data/mockData';

const AIRecommendations = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Recommendations
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Smart suggestions to optimize your telecom services and reduce costs.
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Card */}
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              bgcolor: 'primary.lighter', 
              border: 1, 
              borderColor: 'primary.light' 
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LightbulbIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h5" gutterBottom>
                  Potential Monthly Savings
                </Typography>
                <Typography variant="h3" color="primary.dark">
                  €{aiRecommendations.reduce((total, rec) => total + rec.savingsAmount, 0)}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1">
              Our AI has analyzed your usage patterns and identified several opportunities to optimize your services and reduce costs.
              Implementing all recommendations could lead to significant monthly savings.
            </Typography>
          </Paper>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Personalized Recommendations
          </Typography>
        </Grid>
        
        {aiRecommendations.map((recommendation) => (
          <Grid item xs={12} md={6} key={recommendation.id}>
            <Card elevation={0}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LightbulbIcon 
                    color={recommendation.priority === 'high' ? 'error' : 'primary'} 
                    sx={{ mr: 2 }} 
                  />
                  <Typography variant="h6">
                    {recommendation.title}
                  </Typography>
                </Box>
                
                <Typography variant="body1" paragraph>
                  {recommendation.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    icon={<AttachMoneyIcon />} 
                    label={`Save €${recommendation.savingsAmount}/month`} 
                    color="success" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={recommendation.priority === 'high' ? 'High Priority' : 'Medium Priority'} 
                    color={recommendation.priority === 'high' ? 'error' : 'primary'} 
                    size="small" 
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button variant="outlined" sx={{ mr: 1 }}>
                    Details
                  </Button>
                  <Button variant="contained">
                    Apply
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        
        {/* How It Works */}
        <Grid item xs={12}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                How Our AI Recommendations Work
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUpIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Usage Analysis" 
                    secondary="We analyze your historical usage patterns across all lines and services." 
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemIcon>
                    <LightbulbIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Pattern Recognition" 
                    secondary="Our AI identifies trends, anomalies, and optimization opportunities." 
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemIcon>
                    <AttachMoneyIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Cost Optimization" 
                    secondary="We compare your usage with available plans to find the most cost-effective options." 
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Personalized Suggestions" 
                    secondary="You receive tailored recommendations based on your specific business needs." 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIRecommendations;
