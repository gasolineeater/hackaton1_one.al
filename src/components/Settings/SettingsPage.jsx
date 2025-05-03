import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Slider,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Language,
  Brightness4,
  Notifications,
  Security,
  DataUsage,
  CreditCard,
  Visibility,
  VisibilityOff,
  Save,
  Info,
  Download,
  Delete,
  CloudDownload,
  Help
} from '@mui/icons-material';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
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

const SettingsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [dataAlertThreshold, setDataAlertThreshold] = useState(80);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoRenew, setAutoRenew] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSaveSettings = () => {
    // Here you would typically save the settings to a backend
    setSnackbarMessage('Settings saved successfully');
    setShowSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDataExport = () => {
    // Here you would typically handle data export
    setSnackbarMessage('Data export initiated. You will receive an email when ready.');
    setShowSnackbar(true);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom className="mont-bold">
        Settings
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }} className="co-text">
        Configure your account preferences and application settings
      </Typography>

      <Paper elevation={1} sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="settings tabs"
            textColor="primary"
            indicatorColor="primary"
            sx={{ px: 2 }}
          >
            <Tab
              label="General"
              icon={<Language />}
              iconPosition="start"
              className="mont-medium"
            />
            <Tab
              label="Notifications"
              icon={<Notifications />}
              iconPosition="start"
              className="mont-medium"
            />
            <Tab
              label="Usage & Billing"
              icon={<DataUsage />}
              iconPosition="start"
              className="mont-medium"
            />
            <Tab
              label="Privacy & Security"
              icon={<Security />}
              iconPosition="start"
              className="mont-medium"
            />
          </Tabs>
        </Box>

        {/* General Settings Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ px: 3 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="mont-semibold">
                      Appearance & Language
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Brightness4 />
                        </ListItemIcon>
                        <ListItemText
                          primary="Dark Mode"
                          secondary="Switch between light and dark theme"
                        />
                        <Switch
                          checked={darkMode}
                          onChange={(e) => setDarkMode(e.target.checked)}
                          color="primary"
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemIcon>
                          <Language />
                        </ListItemIcon>
                        <ListItemText
                          primary="Language"
                          secondary="Select your preferred language"
                        />
                        <FormControl sx={{ minWidth: 120 }} size="small">
                          <Select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                          >
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="sq">Albanian</MenuItem>
                            <MenuItem value="it">Italian</MenuItem>
                            <MenuItem value="de">German</MenuItem>
                          </Select>
                        </FormControl>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>

                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="mont-semibold">
                      Time & Date
                    </Typography>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="timezone-label">Time Zone</InputLabel>
                      <Select
                        labelId="timezone-label"
                        id="timezone"
                        value="Europe/Tirane"
                        label="Time Zone"
                      >
                        <MenuItem value="Europe/Tirane">Tirana (GMT+2)</MenuItem>
                        <MenuItem value="Europe/London">London (GMT+1)</MenuItem>
                        <MenuItem value="Europe/Paris">Paris (GMT+2)</MenuItem>
                        <MenuItem value="America/New_York">New York (GMT-4)</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="date-format-label">Date Format</InputLabel>
                      <Select
                        labelId="date-format-label"
                        id="date-format"
                        value="dd/MM/yyyy"
                        label="Date Format"
                      >
                        <MenuItem value="dd/MM/yyyy">DD/MM/YYYY</MenuItem>
                        <MenuItem value="MM/dd/yyyy">MM/DD/YYYY</MenuItem>
                        <MenuItem value="yyyy-MM-dd">YYYY-MM-DD</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="mont-semibold">
                      Dashboard Preferences
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Show usage statistics on dashboard"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Show billing information on dashboard"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Show recent alerts on dashboard"
                      />
                      <FormControlLabel
                        control={<Switch color="primary" />}
                        label="Show promotional offers on dashboard"
                      />
                    </FormGroup>
                  </CardContent>
                </Card>

                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="mont-semibold">
                      Accessibility
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={<Switch color="primary" />}
                        label="High contrast mode"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Animations"
                      />
                    </FormGroup>
                    <Box sx={{ mt: 2 }}>
                      <Typography gutterBottom>Text Size</Typography>
                      <Slider
                        defaultValue={2}
                        step={1}
                        marks
                        min={1}
                        max={5}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => {
                          return ['XS', 'S', 'M', 'L', 'XL'][value - 1];
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ px: 3 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="mont-semibold">
                      Notification Channels
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Email Notifications"
                          secondary="Receive updates via email"
                        />
                        <Switch
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                          color="primary"
                        />
                      </ListItem>
                      {emailNotifications && (
                        <Box sx={{ ml: 4, mb: 2 }}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            variant="outlined"
                            size="small"
                            defaultValue="john.doe@company.com"
                            sx={{ mb: 1 }}
                          />
                        </Box>
                      )}
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText
                          primary="SMS Notifications"
                          secondary="Receive updates via SMS"
                        />
                        <Switch
                          checked={smsNotifications}
                          onChange={(e) => setSmsNotifications(e.target.checked)}
                          color="primary"
                        />
                      </ListItem>
                      {smsNotifications && (
                        <Box sx={{ ml: 4, mb: 2 }}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            variant="outlined"
                            size="small"
                            defaultValue="+355 69 123 4567"
                          />
                        </Box>
                      )}
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText
                          primary="Push Notifications"
                          secondary="Receive updates in your browser"
                        />
                        <Switch
                          checked={pushNotifications}
                          onChange={(e) => setPushNotifications(e.target.checked)}
                          color="primary"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="mont-semibold">
                      Notification Types
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Usage alerts"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Billing notifications"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Service updates"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Security alerts"
                      />
                      <FormControlLabel
                        control={<Switch color="primary" />}
                        label="Marketing communications"
                      />
                      <FormControlLabel
                        control={<Switch color="primary" />}
                        label="Product announcements"
                      />
                    </FormGroup>
                  </CardContent>
                </Card>

                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="mont-semibold">
                      Notification Schedule
                    </Typography>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Quiet Hours Start</InputLabel>
                      <Select
                        value="22:00"
                        label="Quiet Hours Start"
                      >
                        <MenuItem value="20:00">8:00 PM</MenuItem>
                        <MenuItem value="21:00">9:00 PM</MenuItem>
                        <MenuItem value="22:00">10:00 PM</MenuItem>
                        <MenuItem value="23:00">11:00 PM</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Quiet Hours End</InputLabel>
                      <Select
                        value="07:00"
                        label="Quiet Hours End"
                      >
                        <MenuItem value="06:00">6:00 AM</MenuItem>
                        <MenuItem value="07:00">7:00 AM</MenuItem>
                        <MenuItem value="08:00">8:00 AM</MenuItem>
                        <MenuItem value="09:00">9:00 AM</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControlLabel
                      control={<Switch defaultChecked color="primary" />}
                      label="Enable quiet hours"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Usage & Billing Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ px: 3 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="mont-semibold">
                      Usage Alerts
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography gutterBottom>
                        Data Usage Alert Threshold ({dataAlertThreshold}%)
                      </Typography>
                      <Slider
                        value={dataAlertThreshold}
                        onChange={(e, newValue) => setDataAlertThreshold(newValue)}
                        step={5}
                        marks
                        min={50}
                        max={95}
                        valueLabelDisplay="auto"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Receive alerts when your data usage reaches this percentage of your monthly limit
                      </Typography>
                    </Box>
                    <FormGroup>
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Enable data usage alerts"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Enable voice usage alerts"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Enable SMS usage alerts"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Enable roaming alerts"
                      />
                    </FormGroup>
                  </CardContent>
                </Card>

                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="mont-semibold">
                      Data Management
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <CloudDownload color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Export Account Data"
                          secondary="Download all your account data and usage history"
                        />
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<Download />}
                          onClick={handleDataExport}
                          size="small"
                        >
                          Export
                        </Button>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="mont-semibold">
                      Billing Preferences
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <CreditCard color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Auto-Renew Subscription"
                          secondary="Automatically renew your subscription at the end of each billing cycle"
                        />
                        <Switch
                          checked={autoRenew}
                          onChange={(e) => setAutoRenew(e.target.checked)}
                          color="primary"
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemIcon>
                          <CreditCard color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Payment Method"
                          secondary="Visa ending in 4242"
                        />
                        <Button
                          variant="text"
                          color="primary"
                          size="small"
                        >
                          Change
                        </Button>
                      </ListItem>
                    </List>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Invoice Delivery</InputLabel>
                      <Select
                        value="email"
                        label="Invoice Delivery"
                      >
                        <MenuItem value="email">Email</MenuItem>
                        <MenuItem value="portal">Portal Only</MenuItem>
                        <MenuItem value="both">Email & Portal</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Billing Currency</InputLabel>
                      <Select
                        value="EUR"
                        label="Billing Currency"
                      >
                        <MenuItem value="EUR">Euro (€)</MenuItem>
                        <MenuItem value="ALL">Albanian Lek (L)</MenuItem>
                        <MenuItem value="USD">US Dollar ($)</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>

                {/* Space for future content like billing analytics */}
                <Box sx={{
                  height: 150,
                  bgcolor: 'rgba(106, 27, 154, 0.05)',
                  borderRadius: 2,
                  mt: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  p: 2
                }}>
                  <Typography variant="subtitle1" color="primary" className="mont-semibold" gutterBottom>
                    Billing Analytics
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    This space will show billing trends and cost analysis
                    (Coming Soon)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Privacy & Security Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ px: 3 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="mont-semibold">
                      Security Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Two-Factor Authentication"
                          secondary="Add an extra layer of security to your account"
                        />
                        <Switch
                          defaultChecked
                          color="primary"
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText
                          primary="Login Notifications"
                          secondary="Get notified when someone logs into your account"
                        />
                        <Switch
                          defaultChecked
                          color="primary"
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText
                          primary="Suspicious Activity Alerts"
                          secondary="Get notified about unusual account activity"
                        />
                        <Switch
                          defaultChecked
                          color="primary"
                        />
                      </ListItem>
                    </List>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        className="mont-medium"
                      >
                        Change Password
                      </Button>
                    </Box>
                  </CardContent>
                </Card>

                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="mont-semibold">
                      Session Management
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Auto Logout"
                          secondary="Automatically log out after period of inactivity"
                        />
                        <FormControl sx={{ minWidth: 120 }} size="small">
                          <Select
                            value="30"
                          >
                            <MenuItem value="15">15 minutes</MenuItem>
                            <MenuItem value="30">30 minutes</MenuItem>
                            <MenuItem value="60">1 hour</MenuItem>
                            <MenuItem value="never">Never</MenuItem>
                          </Select>
                        </FormControl>
                      </ListItem>
                      <Divider component="li" />
                      <ListItem>
                        <ListItemText
                          primary="Remember Me"
                          secondary="Stay logged in on this device"
                        />
                        <Switch
                          defaultChecked
                          color="primary"
                        />
                      </ListItem>
                    </List>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        className="mont-medium"
                      >
                        Log Out All Devices
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="mont-semibold">
                      Privacy Settings
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Allow usage data collection for service improvement"
                      />
                      <FormControlLabel
                        control={<Switch color="primary" />}
                        label="Allow personalized recommendations"
                      />
                      <FormControlLabel
                        control={<Switch color="primary" />}
                        label="Allow marketing communications"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Allow cookies for essential functionality"
                      />
                    </FormGroup>
                  </CardContent>
                </Card>

                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="mont-semibold">
                      Data Privacy
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Download color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Download Your Data"
                          secondary="Get a copy of your personal data"
                        />
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                        >
                          Download
                        </Button>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemIcon>
                          <Delete color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Delete Account"
                          secondary="Permanently delete your account and all data"
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={handleOpenDialog}
                        >
                          Delete
                        </Button>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>

                <Alert
                  severity="info"
                  sx={{ mt: 3 }}
                  action={
                    <Tooltip title="Learn more about our privacy policy">
                      <IconButton color="info" size="small">
                        <Help />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <Typography variant="body2">
                    Your privacy is important to us. Read our <Link href="#" color="primary">Privacy Policy</Link> to learn more about how we protect your data.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSettings}
            startIcon={<Save />}
            className="mont-medium"
          >
            Save Settings
          </Button>
        </Box>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>{"Delete Your Account?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. All your data, including usage history, billing information, and account settings will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" className="mont-medium">
            Cancel
          </Button>
          <Button onClick={handleCloseDialog} color="error" className="mont-medium">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;
