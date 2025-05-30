import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import api from '../../services/api';
import SideBar from './SideBar';
interface SystemSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  maintenance_mode: boolean;
  max_file_size: number;
  allowed_file_types: string;
  session_timeout: number;
  max_login_attempts: number;
  enable_registration: boolean;
  enable_email_verification: boolean;
  default_user_role: string;
  payment_gateway: string;
  currency: string;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    site_name: '',
    site_description: '',
    contact_email: '',
    maintenance_mode: false,
    max_file_size: 5,
    allowed_file_types: '',
    session_timeout: 30,
    max_login_attempts: 5,
    enable_registration: true,
    enable_email_verification: true,
    default_user_role: 'student',
    payment_gateway: 'stripe',
    currency: 'USD',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const drawerWidth = 240; 
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/settings');
      setSettings(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to fetch settings', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof SystemSettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.type === 'number'
        ? Number(event.target.value)
        : event.target.value;
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: keyof SystemSettings) => (
    event: SelectChangeEvent<string>
  ) => {
    setSettings((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      await api.put('/admin/settings', settings);
      enqueueSnackbar('Settings updated successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update settings', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Typography>Loading settings...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      
      <SideBar />
      {/* <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      ></Box> */}
    <Box>
      <Typography variant="h4" gutterBottom>
        System Settings
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Site Name"
                value={settings.site_name}
                onChange={handleChange('site_name')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Email"
                type="email"
                value={settings.contact_email}
                onChange={handleChange('contact_email')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Site Description"
                multiline
                rows={3}
                value={settings.site_description}
                onChange={handleChange('site_description')}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                System Configuration
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Max File Size (MB)"
                type="number"
                value={settings.max_file_size}
                onChange={handleChange('max_file_size')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Allowed File Types"
                value={settings.allowed_file_types}
                onChange={handleChange('allowed_file_types')}
                helperText="Comma-separated list of file extensions (e.g., jpg,png,pdf)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Session Timeout (minutes)"
                type="number"
                value={settings.session_timeout}
                onChange={handleChange('session_timeout')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Max Login Attempts"
                type="number"
                value={settings.max_login_attempts}
                onChange={handleChange('max_login_attempts')}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Feature Flags
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.maintenance_mode}
                    onChange={handleChange('maintenance_mode')}
                  />
                }
                label="Maintenance Mode"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enable_registration}
                    onChange={handleChange('enable_registration')}
                  />
                }
                label="Enable Registration"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enable_email_verification}
                    onChange={handleChange('enable_email_verification')}
                  />
                }
                label="Enable Email Verification"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                User & Payment Settings
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Default User Role</InputLabel>
                <Select
                  value={settings.default_user_role}
                  label="Default User Role"
                  onChange={handleSelectChange('default_user_role')}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="tutor">Tutor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Gateway</InputLabel>
                <Select
                  value={settings.payment_gateway}
                  label="Payment Gateway"
                  onChange={handleSelectChange('payment_gateway')}
                >
                  <MenuItem value="stripe">Stripe</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={settings.currency}
                  label="Currency"
                  onChange={handleSelectChange('currency')}
                >
                  <MenuItem value="USD">USD ($)</MenuItem>
                  <MenuItem value="EUR">EUR (€)</MenuItem>
                  <MenuItem value="GBP">GBP (£)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {settings.maintenance_mode && (
              <Grid item xs={12}>
                <Alert severity="warning">
                  Maintenance mode is enabled. The site will be inaccessible to regular users.
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  sx={{ minWidth: 120 }}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
    </Box>
  );
};

export default Settings;