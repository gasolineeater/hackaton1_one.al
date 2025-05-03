import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { budgetService, costControlService } from '../../services/api.service';
import BudgetManagement from './BudgetManagement';
import CostBreakdown from './CostBreakdown';
import CostOptimization from './CostOptimization';
import FinancialReports from './FinancialReports';

const CostControl = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [spendingSummary, setSpendingSummary] = useState(null);
  const [costBreakdowns, setCostBreakdowns] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [costTrends, setCostTrends] = useState([]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Get budgets
        const budgetsResponse = await budgetService.getAllBudgets();
        setBudgets(budgetsResponse.data.budgets || []);

        // Get spending summary
        const summaryResponse = await budgetService.getSpendingSummary();
        setSpendingSummary(summaryResponse.data.summary || null);

        // Get cost breakdowns
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const breakdownsResponse = await costControlService.getAllCostBreakdowns({ year, month });
        setCostBreakdowns(breakdownsResponse.data.costBreakdowns || []);

        // Get cost trends
        const trendsResponse = await costControlService.getCostTrends(12);
        setCostTrends(trendsResponse.data.trends || []);

        // Get recommendations
        const recommendationsResponse = await costControlService.getOptimizationRecommendations();
        setRecommendations(recommendationsResponse.data.recommendations || []);

        setError(null);
      } catch (err) {
        console.error('Error loading cost control data:', err);
        setError('Failed to load cost control data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Check budget thresholds
  const handleCheckThresholds = async () => {
    setLoading(true);
    try {
      const response = await budgetService.checkThresholds();
      const exceededBudgets = response.data.exceededBudgets || [];

      if (exceededBudgets.length > 0) {
        setSuccess(`${exceededBudgets.length} budget(s) have exceeded their thresholds.`);
      } else {
        setSuccess('No budgets have exceeded their thresholds.');
      }

      // Refresh spending summary
      const summaryResponse = await budgetService.getSpendingSummary();
      setSpendingSummary(summaryResponse.data.summary || null);

      setError(null);
    } catch (err) {
      console.error('Error checking thresholds:', err);
      setError('Failed to check budget thresholds. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle budget creation/update
  const handleBudgetSave = async (budgetData, isUpdate = false) => {
    setLoading(true);
    try {
      let response;

      if (isUpdate) {
        response = await budgetService.updateBudget(budgetData.id, budgetData);
        setSuccess('Budget updated successfully.');
      } else {
        response = await budgetService.createBudget(budgetData);
        setSuccess('Budget created successfully.');
      }

      // Refresh budgets
      const budgetsResponse = await budgetService.getAllBudgets();
      setBudgets(budgetsResponse.data.budgets || []);

      // Refresh spending summary
      const summaryResponse = await budgetService.getSpendingSummary();
      setSpendingSummary(summaryResponse.data.summary || null);

      setError(null);
      return response.data.budget;
    } catch (err) {
      console.error('Error saving budget:', err);
      setError('Failed to save budget. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Handle budget deletion
  const handleBudgetDelete = async (budgetId) => {
    setLoading(true);
    try {
      await budgetService.deleteBudget(budgetId);

      // Refresh budgets
      const budgetsResponse = await budgetService.getAllBudgets();
      setBudgets(budgetsResponse.data.budgets || []);

      // Refresh spending summary
      const summaryResponse = await budgetService.getSpendingSummary();
      setSpendingSummary(summaryResponse.data.summary || null);

      setSuccess('Budget deleted successfully.');
      setError(null);
    } catch (err) {
      console.error('Error deleting budget:', err);
      setError('Failed to delete budget. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle cost breakdown generation
  const handleGenerateCostBreakdown = async (year, month) => {
    setLoading(true);
    try {
      await costControlService.generateCostBreakdown(year, month);

      // Refresh cost breakdowns
      const breakdownsResponse = await costControlService.getAllCostBreakdowns({ year, month });
      setCostBreakdowns(breakdownsResponse.data.costBreakdowns || []);

      setSuccess('Cost breakdown generated successfully.');
      setError(null);
    } catch (err) {
      console.error('Error generating cost breakdown:', err);
      setError('Failed to generate cost breakdown. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle financial report export
  const handleExportReport = async (format, type, year, month) => {
    setLoading(true);
    try {
      await costControlService.exportFinancialReport(format, type, year, month);
      setSuccess('Financial report exported successfully.');
      setError(null);
    } catch (err) {
      console.error('Error exporting financial report:', err);
      setError('Failed to export financial report. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSuccess(null);
    setError(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Cost Control
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Manage and optimize your telecom spending.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckThresholds}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Check Budget Thresholds'}
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Budget Management" />
          <Tab label="Cost Breakdown" />
          <Tab label="Cost Optimization" />
          <Tab label="Financial Reports" />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        {activeTab === 0 && (
          <BudgetManagement
            budgets={budgets}
            spendingSummary={spendingSummary}
            onSave={handleBudgetSave}
            onDelete={handleBudgetDelete}
            loading={loading}
          />
        )}

        {activeTab === 1 && (
          <CostBreakdown
            costBreakdowns={costBreakdowns}
            costTrends={costTrends}
            onGenerateBreakdown={handleGenerateCostBreakdown}
            loading={loading}
          />
        )}

        {activeTab === 2 && (
          <CostOptimization
            recommendations={recommendations}
            loading={loading}
          />
        )}

        {activeTab === 3 && (
          <FinancialReports
            onExport={handleExportReport}
            loading={loading}
          />
        )}
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CostControl;
