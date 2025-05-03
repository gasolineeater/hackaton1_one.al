import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  TextField,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Card,
  CardContent,
  Container,
  IconButton,
  Badge,
  Chip
} from '@mui/material';
import {
  Person,
  Security,
  Notifications,
  Payment,
  Edit,
  Save,
  Phone,
  Email,
  Business,
  LocationOn,
  CreditCard,
  Receipt,
  History,
  CloudUpload
} from '@mui/icons-material';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const MyAccountPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+355 69 123 4567',
    company: 'ABC Corporation',
    position: 'IT Manager',
    address: 'Rruga Myslym Shyri, Tirana, Albania'
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    // Here you would typically save the profile data to a backend
    console.log('Saving profile:', profileData);
    setEditMode(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom className="mont-bold">
        My Account
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }} className="co-text">
        Manage your profile, security settings, and account preferences
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Summary Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton
                    size="small"
                    sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                  >
                    <Edit sx={{ fontSize: 16 }} />
                  </IconButton>
                }
              >
                <Avatar
                  sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}
                  alt={`${profileData.firstName} ${profileData.lastName}`}
                  src="/placeholder-avatar.jpg" // Replace with actual user avatar
                >
                  {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                </Avatar>
              </Badge>
              <Typography variant="h5" className="mont-semibold">
                {profileData.firstName} {profileData.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary" className="co-text">
                {profileData.position}
              </Typography>
              <Typography variant="body2" color="text.secondary" className="co-text">
                {profileData.company}
              </Typography>
              <Chip
                label="Business Account"
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Email fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={profileData.email}
                  primaryTypographyProps={{ variant: 'body2', className: 'co-medium' }}
                  secondaryTypographyProps={{ className: 'co-text' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Phone"
                  secondary={profileData.phone}
                  primaryTypographyProps={{ variant: 'body2', className: 'co-medium' }}
                  secondaryTypographyProps={{ className: 'co-text' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Business fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Company"
                  secondary={profileData.company}
                  primaryTypographyProps={{ variant: 'body2', className: 'co-medium' }}
                  secondaryTypographyProps={{ className: 'co-text' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationOn fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Address"
                  secondary={profileData.address}
                  primaryTypographyProps={{ variant: 'body2', className: 'co-medium' }}
                  secondaryTypographyProps={{ className: 'co-text' }}
                />
              </ListItem>
            </List>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                className="mont-medium"
              >
                View Business Profile
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Tabs Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={1} sx={{ borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="account tabs"
                textColor="primary"
                indicatorColor="primary"
                sx={{ px: 2 }}
              >
                <Tab
                  label="Profile"
                  icon={<Person />}
                  iconPosition="start"
                  className="mont-medium"
                />
                <Tab
                  label="Security"
                  icon={<Security />}
                  iconPosition="start"
                  className="mont-medium"
                />
                <Tab
                  label="Billing"
                  icon={<Payment />}
                  iconPosition="start"
                  className="mont-medium"
                />
                <Tab
                  label="Notifications"
                  icon={<Notifications />}
                  iconPosition="start"
                  className="mont-medium"
                />
              </Tabs>
            </Box>

            {/* Profile Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ px: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" className="mont-semibold">
                    Personal Information
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={editMode ? <Save /> : <Edit />}
                    onClick={editMode ? handleSaveProfile : handleEditToggle}
                    className="mont-medium"
                  >
                    {editMode ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      name="company"
                      value={profileData.company}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Position"
                      name="position"
                      value={profileData.position}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      variant="outlined"
                      margin="normal"
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>

                {/* Profile Picture Upload Section */}
                {editMode && (
                  <Box sx={{ mt: 4, p: 3, border: '1px dashed', borderColor: 'primary.main', borderRadius: 2, textAlign: 'center' }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="profile-image-upload"
                      type="file"
                    />
                    <label htmlFor="profile-image-upload">
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        startIcon={<CloudUpload />}
                        className="mont-medium"
                      >
                        Upload Profile Picture
                      </Button>
                    </label>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
                      Recommended size: 300x300 pixels. Max file size: 2MB.
                    </Typography>
                  </Box>
                )}
              </Box>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ px: 3 }}>
                <Typography variant="h6" gutterBottom className="mont-semibold">
                  Security Settings
                </Typography>

                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom className="mont-semibold">
                      Change Password
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Current Password"
                          type="password"
                          variant="outlined"
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="New Password"
                          type="password"
                          variant="outlined"
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          type="password"
                          variant="outlined"
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="primary"
                          className="mont-medium"
                        >
                          Update Password
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom className="mont-semibold">
                      Two-Factor Authentication
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1">
                        Enable Two-Factor Authentication
                      </Typography>
                      <Switch color="primary" />
                    </Box>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom className="mont-semibold">
                      Login Sessions
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      These are the devices that have logged into your account. Revoke any sessions that you don't recognize.
                    </Typography>
                    <List>
                      <ListItem secondaryAction={
                        <Button size="small" color="primary" variant="outlined">
                          Revoke
                        </Button>
                      }>
                        <ListItemText
                          primary="Chrome on Windows"
                          secondary="Tirana, Albania • Active now"
                        />
                      </ListItem>
                      <ListItem secondaryAction={
                        <Button size="small" color="primary" variant="outlined">
                          Revoke
                        </Button>
                      }>
                        <ListItemText
                          primary="Safari on iPhone"
                          secondary="Tirana, Albania • Last active: 2 days ago"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Box>
            </TabPanel>

            {/* Billing Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ px: 3 }}>
                <Typography variant="h6" gutterBottom className="mont-semibold">
                  Billing Information
                </Typography>

                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom className="mont-semibold">
                      Payment Methods
                    </Typography>
                    <List>
                      <ListItem
                        secondaryAction={
                          <Button size="small" color="primary">
                            Edit
                          </Button>
                        }
                      >
                        <ListItemIcon>
                          <CreditCard color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Visa ending in 4242"
                          secondary="Expires 12/2025"
                        />
                      </ListItem>
                    </List>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ mt: 2 }}
                      className="mont-medium"
                    >
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>

                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom className="mont-semibold">
                      Billing Address
                    </Typography>
                    <Typography variant="body2" paragraph>
                      ABC Corporation<br />
                      Rruga Myslym Shyri<br />
                      Tirana, Albania<br />
                      NIPT: AL123456789
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      className="mont-medium"
                    >
                      Edit Billing Address
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom className="mont-semibold">
                      Billing History
                    </Typography>
                    <List>
                      <ListItem
                        secondaryAction={
                          <Button size="small" startIcon={<Receipt />} color="primary">
                            Invoice
                          </Button>
                        }
                      >
                        <ListItemIcon>
                          <History color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Invoice #INV-2023-001"
                          secondary="May 1, 2023 • €175.00"
                        />
                      </ListItem>
                      <ListItem
                        secondaryAction={
                          <Button size="small" startIcon={<Receipt />} color="primary">
                            Invoice
                          </Button>
                        }
                      >
                        <ListItemIcon>
                          <History color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Invoice #INV-2023-002"
                          secondary="June 1, 2023 • €175.00"
                        />
                      </ListItem>
                      <ListItem
                        secondaryAction={
                          <Button size="small" startIcon={<Receipt />} color="primary">
                            Invoice
                          </Button>
                        }
                      >
                        <ListItemIcon>
                          <History color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Invoice #INV-2023-003"
                          secondary="July 1, 2023 • €175.00"
                        />
                      </ListItem>
                    </List>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ mt: 2 }}
                      className="mont-medium"
                    >
                      View All Invoices
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ px: 3 }}>
                <Typography variant="h6" gutterBottom className="mont-semibold">
                  Notification Preferences
                </Typography>

                <Card>
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Email Notifications"
                          secondary="Receive updates, invoices, and service notifications via email"
                        />
                        <Switch defaultChecked color="primary" />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText
                          primary="SMS Notifications"
                          secondary="Receive urgent alerts and authentication codes via SMS"
                        />
                        <Switch defaultChecked color="primary" />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText
                          primary="Usage Alerts"
                          secondary="Get notified when you reach 80% of your data, minutes, or SMS limits"
                        />
                        <Switch defaultChecked color="primary" />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText
                          primary="Billing Notifications"
                          secondary="Receive payment reminders and invoice notifications"
                        />
                        <Switch defaultChecked color="primary" />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText
                          primary="Product Updates"
                          secondary="Stay informed about new features and service improvements"
                        />
                        <Switch color="primary" />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText
                          primary="Marketing Communications"
                          secondary="Receive special offers and promotional information"
                        />
                        <Switch color="primary" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    className="mont-medium"
                  >
                    Save Preferences
                  </Button>
                </Box>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyAccountPage;
