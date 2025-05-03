import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  IconButton, 
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

import { telecomLines, servicePlans } from '../../data/mockData';

const ServiceOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newLine, setNewLine] = useState({
    phoneNumber: '',
    assignedTo: '',
    plan: '',
    monthlyLimit: 0,
    status: 'active'
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };

  const handleNewLineChange = (prop) => (event) => {
    setNewLine({ ...newLine, [prop]: event.target.value });
  };

  const handleAddLine = () => {
    // In a real app, this would add the line to the database
    console.log('Adding new line:', newLine);
    handleAddDialogClose();
  };

  const filteredLines = telecomLines.filter(line => 
    line.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    line.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    line.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Service Overview
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Manage all your telecom lines and services in one place.
      </Typography>

      {/* Action Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder="Search lines..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddDialogOpen}
        >
          Add New Line
        </Button>
      </Box>

      {/* Lines Table */}
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Phone Number</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Data Usage</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLines.map((line) => (
              <TableRow key={line.id}>
                <TableCell component="th" scope="row">
                  {line.phoneNumber}
                </TableCell>
                <TableCell>{line.assignedTo}</TableCell>
                <TableCell>{line.plan}</TableCell>
                <TableCell>
                  {line.currentUsage} / {line.monthlyLimit} GB
                </TableCell>
                <TableCell>
                  <Chip 
                    label={line.status} 
                    color={line.status === 'active' ? 'success' : 'default'} 
                    size="small" 
                    icon={line.status === 'active' ? <CheckCircleIcon /> : <CancelIcon />}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Service Plans */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Available Service Plans
      </Typography>
      <Grid container spacing={3}>
        {servicePlans.map((plan) => (
          <Grid item xs={12} sm={6} md={3} key={plan.id}>
            <Card elevation={0} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  €{plan.price}
                  <Typography variant="caption" color="text.secondary">
                    /month
                  </Typography>
                </Typography>
                <Box sx={{ my: 2 }}>
                  <Typography variant="body2">
                    <strong>Data:</strong> {typeof plan.data === 'number' ? `${plan.data} GB` : plan.data}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Calls:</strong> {plan.calls}
                  </Typography>
                  <Typography variant="body2">
                    <strong>SMS:</strong> {typeof plan.sms === 'number' ? `${plan.sms} messages` : plan.sms}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" gutterBottom>
                  Features:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {plan.features.map((feature, index) => (
                    <Typography component="li" variant="body2" key={index}>
                      {feature}
                    </Typography>
                  ))}
                </Box>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ mt: 2 }}
                >
                  Select Plan
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add New Line Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
        <DialogTitle>Add New Line</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              margin="dense"
              label="Phone Number"
              type="text"
              fullWidth
              variant="outlined"
              value={newLine.phoneNumber}
              onChange={handleNewLineChange('phoneNumber')}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Assigned To"
              type="text"
              fullWidth
              variant="outlined"
              value={newLine.assignedTo}
              onChange={handleNewLineChange('assignedTo')}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Plan</InputLabel>
              <Select
                value={newLine.plan}
                label="Plan"
                onChange={handleNewLineChange('plan')}
              >
                {servicePlans.map((plan) => (
                  <MenuItem value={plan.name} key={plan.id}>
                    {plan.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Monthly Data Limit (GB)"
              type="number"
              fullWidth
              variant="outlined"
              value={newLine.monthlyLimit}
              onChange={handleNewLineChange('monthlyLimit')}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newLine.status}
                label="Status"
                onChange={handleNewLineChange('status')}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleAddLine} variant="contained">Add Line</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceOverview;
