import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { telecomService } from '../../services/api.service';

const BudgetManagement = ({ budgets, spendingSummary, onSave, onDelete, loading }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [formData, setFormData] = useState({
    entity_type: 'line',
    entity_id: '',
    entity_name: '',
    amount: '',
    period: 'monthly',
    currency: 'EUR',
    alert_threshold: 80,
    start_date: new Date().toISOString().split('T')[0],
    end_date: ''
  });
  const [lines, setLines] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingEntities, setLoadingEntities] = useState(false);

  // Load telecom lines and departments when entity type changes
  const handleEntityTypeChange = async (event) => {
    const entityType = event.target.value;
    setFormData({ ...formData, entity_type: entityType, entity_id: '', entity_name: '' });
    
    if (entityType === 'line' || entityType === 'department') {
      setLoadingEntities(true);
      try {
        const response = await telecomService.getAllLines();
        const telecomLines = response.data.lines || [];
        
        if (entityType === 'line') {
          setLines(telecomLines);
        } else if (entityType === 'department') {
          // Extract unique departments
          const uniqueDepartments = [...new Set(telecomLines.map(line => line.department))];
          setDepartments(uniqueDepartments.map(dept => ({ id: dept, name: dept })));
        }
      } catch (error) {
        console.error('Error loading entities:', error);
      } finally {
        setLoadingEntities(false);
      }
    }
  };

  // Handle entity selection
  const handleEntityChange = (event) => {
    const entityId = event.target.value;
    let entityName = '';
    
    if (formData.entity_type === 'line') {
      const selectedLine = lines.find(line => line.id.toString() === entityId.toString());
      if (selectedLine) {
        entityName = `${selectedLine.phone_number} (${selectedLine.assigned_to})`;
      }
    } else if (formData.entity_type === 'department') {
      const selectedDept = departments.find(dept => dept.id.toString() === entityId.toString());
      if (selectedDept) {
        entityName = selectedDept.name;
      }
    } else if (formData.entity_type === 'company') {
      entityName = 'Company-wide';
    }
    
    setFormData({ ...formData, entity_id: entityId, entity_name: entityName });
  };

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open dialog to create a new budget
  const handleOpenCreateDialog = () => {
    setSelectedBudget(null);
    setFormData({
      entity_type: 'line',
      entity_id: '',
      entity_name: '',
      amount: '',
      period: 'monthly',
      currency: 'EUR',
      alert_threshold: 80,
      start_date: new Date().toISOString().split('T')[0],
      end_date: ''
    });
    setDialogOpen(true);
  };

  // Open dialog to edit an existing budget
  const handleOpenEditDialog = (budget) => {
    setSelectedBudget(budget);
    setFormData({
      id: budget.id,
      entity_type: budget.entity_type,
      entity_id: budget.entity_id,
      entity_name: budget.entity_name,
      amount: budget.amount,
      period: budget.period,
      currency: budget.currency,
      alert_threshold: budget.alert_threshold,
      start_date: budget.start_date ? new Date(budget.start_date).toISOString().split('T')[0] : '',
      end_date: budget.end_date ? new Date(budget.end_date).toISOString().split('T')[0] : ''
    });
    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Save budget
  const handleSaveBudget = async () => {
    // Validate form data
    if (!formData.entity_name || !formData.amount) {
      return;
    }
    
    // If entity type is company, set entity_id to null
    const budgetData = { ...formData };
    if (budgetData.entity_type === 'company') {
      budgetData.entity_id = null;
    }
    
    // Save budget
    await onSave(budgetData, !!selectedBudget);
    handleCloseDialog();
  };

  // Delete budget
  const handleDeleteBudget = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      await onDelete(budgetId);
    }
  };

  // Format currency
  const formatCurrency = (amount, currency = 'EUR') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Budget Management</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            disabled={loading}
          >
            Add Budget
          </Button>
        </Box>
      </Grid>

      {/* Spending Summary */}
      {spendingSummary && (
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Spending Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" color="text.secondary">
                      Total Budget
                    </Typography>
                    <Typography variant="h4">
                      {formatCurrency(spendingSummary.totalBudget)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" color="text.secondary">
                      Total Spending
                    </Typography>
                    <Typography variant="h4">
                      {formatCurrency(spendingSummary.totalSpending)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" color="text.secondary">
                      Overall Percentage
                    </Typography>
                    <Typography variant="h4">
                      {spendingSummary.overallPercentage.toFixed(1)}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(spendingSummary.overallPercentage, 100)}
                      color={spendingSummary.overallPercentage > 90 ? 'error' : 'primary'}
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}

      {/* Budgets Table */}
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Entity</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>Alert Threshold</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : budgets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No budgets found. Click "Add Budget" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                budgets.map((budget) => (
                  <TableRow key={budget.id}>
                    <TableCell>{budget.entity_name}</TableCell>
                    <TableCell>{budget.entity_type}</TableCell>
                    <TableCell>{formatCurrency(budget.amount, budget.currency)}</TableCell>
                    <TableCell>{budget.period}</TableCell>
                    <TableCell>{budget.alert_threshold}%</TableCell>
                    <TableCell>{new Date(budget.start_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {budget.end_date ? new Date(budget.end_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEditDialog(budget)}
                        disabled={loading}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteBudget(budget.id)}
                        disabled={loading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* Budget Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedBudget ? 'Edit Budget' : 'Create Budget'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Entity Type"
                name="entity_type"
                value={formData.entity_type}
                onChange={handleEntityTypeChange}
                fullWidth
                required
              >
                <MenuItem value="line">Telecom Line</MenuItem>
                <MenuItem value="department">Department</MenuItem>
                <MenuItem value="company">Company-wide</MenuItem>
              </TextField>
            </Grid>
            
            {formData.entity_type !== 'company' && (
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label={formData.entity_type === 'line' ? 'Telecom Line' : 'Department'}
                  name="entity_id"
                  value={formData.entity_id}
                  onChange={handleEntityChange}
                  fullWidth
                  required
                  disabled={loadingEntities}
                >
                  {loadingEntities ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : formData.entity_type === 'line' ? (
                    lines.map((line) => (
                      <MenuItem key={line.id} value={line.id}>
                        {line.phone_number} ({line.assigned_to})
                      </MenuItem>
                    ))
                  ) : (
                    departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </Grid>
            )}
            
            {formData.entity_type === 'company' && (
              <Grid item xs={12} md={6}>
                <TextField
                  label="Entity Name"
                  name="entity_name"
                  value="Company-wide"
                  fullWidth
                  disabled
                />
              </Grid>
            )}
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Budget Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                fullWidth
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Period"
                name="period"
                value={formData.period}
                onChange={handleInputChange}
                fullWidth
                required
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                fullWidth
              >
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="ALL">ALL</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Alert Threshold (%)"
                name="alert_threshold"
                type="number"
                value={formData.alert_threshold}
                onChange={handleInputChange}
                fullWidth
                inputProps={{ min: 1, max: 100 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Start Date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="End Date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveBudget}
            variant="contained"
            color="primary"
            disabled={loading || !formData.entity_name || !formData.amount}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BudgetManagement;
