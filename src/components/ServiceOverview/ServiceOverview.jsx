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
  MenuItem,
  List,
  ListItem,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header Section */}
      <Box
        sx={{
          mb: 5,
          mx: 0,
          px: { xs: 2, sm: 3, md: 4 },
          textAlign: 'center',
          mt: { xs: 6, sm: 8, md: 10 } // Significantly increased top margin to move content further down
        }}
      >
        <Typography variant="h3" gutterBottom className="mont-bold" sx={{
          mb: 2,
          background: 'linear-gradient(45deg, #6A1B9A 30%, #9575CD 90%)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Service Overview
        </Typography>
        <Typography variant="h6" color="text.secondary" className="co-text" sx={{
          mb: 3,
          maxWidth: '800px',
          mx: 'auto'
        }}>
          Manage all your telecom lines and services in one place.
        </Typography>
      </Box>

      {/* Action Bar */}
      <Box sx={{
        mb: 5,
        mx: 0,
        px: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        maxWidth: '1200px'
      }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 0,
            background: 'linear-gradient(to right, rgba(106, 27, 154, 0.05), rgba(149, 117, 205, 0.05))',
            border: '1px solid rgba(106, 27, 154, 0.1)',
            mb: 4
          }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" className="mont-semibold" sx={{ mb: 1, color: '#6A1B9A' }}>
                Line Management
              </Typography>
              <Typography variant="body2" color="text.secondary" className="co-text">
                Search, add, or manage your telecom lines
              </Typography>
            </Box>
            <Box sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', sm: 'auto' }
            }}>
              <TextField
                placeholder="Search lines..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                  width: { xs: '100%', sm: 250 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    backgroundColor: 'white'
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddDialogOpen}
                sx={{
                  borderRadius: 0,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    borderRadius: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 10px rgba(0,0,0,0.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Add New Line
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Lines Table */}
      <Box sx={{
        mx: 0,
        px: { xs: 2, sm: 3, md: 4 },
        mb: 5,
        maxWidth: '1300px',
        margin: '0 auto',
        width: '100%'
      }}>
        <Box sx={{
          textAlign: 'center',
          mb: 4,
          mt: -2, // Added negative top margin to move text up
          position: 'relative'
        }}>
          <Typography variant="h3" gutterBottom className="mont-bold" sx={{
            mb: 2,
            background: 'linear-gradient(45deg, #6A1B9A 30%, #9575CD 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Active Lines
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" className="co-text" sx={{
            maxWidth: 500,
            mx: 'auto',
            opacity: 0.8
          }}>
            Manage your telecom lines and monitor usage
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 0,
            overflow: 'hidden',
            border: '1px solid rgba(106, 27, 154, 0.1)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            background: 'linear-gradient(to bottom, rgba(106, 27, 154, 0.02) 0%, rgba(255, 255, 255, 1) 100px)'
          }}
        >
          <Box sx={{ p: { xs: 1, sm: 2 }, borderBottom: '1px solid rgba(106, 27, 154, 0.08)' }}>
            <Typography variant="subtitle1" className="mont-semibold" sx={{ color: '#6A1B9A', ml: 1 }}>
              Your Business Lines
            </Typography>
          </Box>
          <TableContainer>
            <Table sx={{ minWidth: 650, width: '100%' }}>
              <TableHead>
                <TableRow sx={{
                  backgroundColor: 'rgba(106, 27, 154, 0.08)',
                  '& .MuiTableCell-head': {
                    color: '#6A1B9A',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    py: 2.2
                  }
                }}>
                  <TableCell width="18%">Phone Number</TableCell>
                  <TableCell width="20%">Assigned To</TableCell>
                  <TableCell width="18%">Plan</TableCell>
                  <TableCell width="25%">Data Usage</TableCell>
                  <TableCell width="12%">Status</TableCell>
                  <TableCell width="7%" align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLines.map((line, index) => (
                  <TableRow key={line.id} sx={{
                    backgroundColor: index % 2 === 0 ? 'white' : 'rgba(106, 27, 154, 0.01)',
                    '&:hover': {
                      backgroundColor: 'rgba(106, 27, 154, 0.04)'
                    },
                    '& .MuiTableCell-root': {
                      py: 2.2,
                      borderBottom: '1px solid rgba(106, 27, 154, 0.05)',
                      fontSize: '0.9rem'
                    }
                  }}>
                    <TableCell component="th" scope="row" className="mont-medium" sx={{ color: '#6A1B9A' }}>
                      {line.phoneNumber}
                    </TableCell>
                    <TableCell>{line.assignedTo}</TableCell>
                    <TableCell className="mont-medium">{line.plan}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                          flex: 1,
                          height: 7,
                          bgcolor: 'rgba(106, 27, 154, 0.1)',
                          borderRadius: 4,
                          overflow: 'hidden'
                        }}>
                          <Box sx={{
                            height: '100%',
                            width: `${(line.currentUsage / line.monthlyLimit) * 100}%`,
                            bgcolor: (line.currentUsage / line.monthlyLimit) > 0.9 ? '#f44336' :
                                    (line.currentUsage / line.monthlyLimit) > 0.7 ? '#ff9800' : '#6A1B9A',
                            borderRadius: 4
                          }} />
                        </Box>
                        <Typography variant="body2" sx={{
                          whiteSpace: 'nowrap',
                          fontWeight: 500,
                          color: (line.currentUsage / line.monthlyLimit) > 0.9 ? '#f44336' :
                                (line.currentUsage / line.monthlyLimit) > 0.7 ? '#ff9800' : 'text.secondary'
                        }}>
                          {line.currentUsage} / {line.monthlyLimit} GB
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={line.status}
                        color={line.status === 'active' ? 'success' : 'default'}
                        size="small"
                        icon={line.status === 'active' ? <CheckCircleIcon /> : <CancelIcon />}
                        sx={{
                          borderRadius: 1,
                          fontWeight: 500,
                          height: 26,
                          fontSize: '0.75rem',
                          '& .MuiChip-icon': {
                            fontSize: '0.85rem',
                            marginLeft: '4px'
                          },
                          '& .MuiChip-label': {
                            paddingLeft: '6px',
                            paddingRight: '8px'
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.75 }}>
                        <IconButton
                          size="small"
                          sx={{
                            padding: 0.75,
                            color: 'rgba(0, 0, 0, 0.54)',
                            '&:hover': {
                              color: '#6A1B9A',
                              backgroundColor: 'rgba(106, 27, 154, 0.08)'
                            }
                          }}
                        >
                          <EditIcon sx={{ fontSize: '1.1rem' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            padding: 0.75,
                            color: 'rgba(0, 0, 0, 0.54)',
                            '&:hover': {
                              color: '#f44336',
                              backgroundColor: 'rgba(244, 67, 54, 0.08)'
                            }
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: '1.1rem' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            padding: 0.75,
                            color: 'rgba(0, 0, 0, 0.54)',
                            '&:hover': {
                              color: '#6A1B9A',
                              backgroundColor: 'rgba(106, 27, 154, 0.08)'
                            }
                          }}
                        >
                          <MoreVertIcon sx={{ fontSize: '1.1rem' }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderTop: '1px solid rgba(106, 27, 154, 0.08)',
            backgroundColor: 'rgba(106, 27, 154, 0.02)'
          }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredLines.length} of {filteredLines.length} lines
            </Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              sx={{
                color: '#6A1B9A',
                '&:hover': { backgroundColor: 'rgba(106, 27, 154, 0.08)' }
              }}
              onClick={handleAddDialogOpen}
            >
              Add New Line
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Service Plans */}
      <Box sx={{
        mx: 0,
        px: { xs: 2, sm: 3, md: 4 },
        mb: 5,
        mt: 30, // Extremely increased top margin to move section very far down
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        <Box sx={{
          textAlign: 'center',
          mb: 5,
          mt: 10, // Added top margin to move the text down from the box above
          position: 'relative'
        }}>
          <Typography variant="h4" className="mont-bold" sx={{
            mb: 2,
            color: '#6A1B9A',
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 3,
              backgroundColor: '#6A1B9A',
              borderRadius: 1.5
            }
          }}>
            Available Service Plans
          </Typography>
          <Typography variant="h6" color="text.secondary" className="co-text" sx={{
            maxWidth: 600,
            mx: 'auto',
            opacity: 0.8
          }}>
            Choose the perfect plan for your business needs
          </Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: { xs: 'wrap', lg: 'nowrap' },
          gap: 4
        }}>
          {servicePlans.map((plan) => (
            <Box
              key={plan.id}
              sx={{
                width: { xs: '100%', sm: '45%', lg: '20%' },
                minWidth: '200px',
                maxWidth: '250px'
              }}>
              <Card elevation={0} sx={{
                width: '100%',
                height: '100%',
                borderRadius: 0,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid rgba(106, 27, 154, 0.1)',
                position: 'relative',
                // Removed special styling for Business Economy to make boxes more similar
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }
              }}>
                <Box sx={{
                  bgcolor: 'rgba(106, 27, 154, 0.03)',
                  p: 2,
                  textAlign: 'center',
                  borderBottom: '1px solid rgba(106, 27, 154, 0.1)'
                }}>
                  <Typography variant="h6" className="mont-semibold" sx={{ color: '#6A1B9A' }}>
                    {plan.name}
                  </Typography>
                </Box>
                <CardContent sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  p: 2
                }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography variant="h4" color="primary" className="mont-bold" sx={{ mb: 0 }}>
                        €{plan.price}
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                          /month
                        </Typography>
                      </Typography>
                    </Box>

                    <Box sx={{
                      my: 2,
                      p: 2,
                      bgcolor: 'rgba(106, 27, 154, 0.03)',
                      borderRadius: 1,
                      border: '1px solid rgba(106, 27, 154, 0.05)'
                    }}>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <span><strong>Data:</strong></span>
                        <span>{typeof plan.data === 'number' ? `${plan.data} GB` : plan.data}</span>
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <span><strong>Calls:</strong></span>
                        <span>{plan.calls}</span>
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong>SMS:</strong></span>
                        <span>{typeof plan.sms === 'number' ? `${plan.sms}` : plan.sms}</span>
                      </Typography>
                    </Box>

                    <Typography variant="subtitle2" gutterBottom className="mont-medium" sx={{ mt: 3 }}>
                      Features:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                      {plan.features.map((feature, index) => (
                        <Typography component="li" variant="body2" key={index} className="co-text" sx={{ mb: 0.5 }}>
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                  <Box sx={{ pt: 2, mt: 'auto' }}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        borderRadius: 0,
                        py: 1.2,
                        backgroundColor: '#6A1B9A',
                        color: 'white',
                        '&:hover': {
                          borderRadius: 2,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 10px rgba(0,0,0,0.1)',
                          backgroundColor: '#7B1FA2' // slightly lighter purple on hover
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Select Plan
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 8,
          py: 6,
          bgcolor: 'primary.dark',
          color: 'white',
          borderRadius: 0,
          px: { xs: 2, sm: 3, md: 4 },
          mx: 0, // No margin for true edge-to-edge
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '1200px' }}>
          <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className="mont-bold" gutterBottom>
              ONE Albania Business
            </Typography>
            <Typography variant="body2" className="co-text" sx={{ mb: 2, opacity: 0.8 }}>
              Providing innovative telecom solutions for businesses of all sizes across Albania.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Instagram fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" className="mont-semibold" gutterBottom>
              Services
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Business Plans
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  International Roaming
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Internet Solutions
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Cloud Services
                </Button>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" className="mont-semibold" gutterBottom>
              Support
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Contact Us
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  FAQs
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Technical Support
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Network Status
                </Button>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" className="mont-semibold" gutterBottom>
              Company
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  About Us
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Careers
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  News
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Sustainability
                </Button>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" className="mont-semibold" gutterBottom>
              Legal
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Terms of Service
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Privacy Policy
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Cookie Policy
                </Button>
              </ListItem>
              <ListItem disableGutters disablePadding>
                <Button color="inherit" sx={{ opacity: 0.8, textAlign: 'left', justifyContent: 'flex-start', px: 0 }}>
                  Compliance
                </Button>
              </ListItem>
            </List>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" className="co-text" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} ONE Albania. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button color="inherit" size="small" sx={{ opacity: 0.7 }}>
              Sitemap
            </Button>
            <Button color="inherit" size="small" sx={{ opacity: 0.7 }}>
              Accessibility
            </Button>
            <Button color="inherit" size="small" sx={{ opacity: 0.7 }}>
              Cookie Settings
            </Button>
          </Box>
        </Box>
        </Box>
      </Box>

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
