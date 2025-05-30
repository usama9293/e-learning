import { useEffect, useState } from 'react';
import {
  Box, Button, Container, Paper, TextField, Typography, Grid,
  Avatar, Tabs, Tab, Divider, IconButton, Card, CardContent, Stack,
  Chip, Alert, Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import api from '../../services/api';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  homeAddress: string;
  emergencyContact: string;
  avatar?: string;
  bio?: string;
  subjects: string[];
  notifications: {
    email: boolean;
    sms: boolean;
    marketing: boolean;
  };
}

const TutorProfile = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const info = user?.info;

  const initialProfile: ProfileData = {
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: info?.contact_number || '',
    homeAddress: info?.address || '',
    emergencyContact: info?.emergency_contact || '',
    avatar: '',
    bio: '',
    subjects: [],
    notifications: {
      email: true,
      sms: true,
      marketing: false,
    },
  };

  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [sessions, setSessions] = useState([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!user || !info) navigate('/login');

    const loadSessions = async () => {
      try {
        const res = await api.get(`/tutors/${info.id}/sessions`);
        setSessions(res.data);
      } catch (err) {
        setSessions([]);
      }
    };

    loadSessions();
  }, [user, info, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (type: keyof ProfileData['notifications']) => {
    setProfile({
      ...profile,
      notifications: {
        ...profile.notifications,
        [type]: !profile.notifications[type],
      },
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    setSnackbarMessage('Profile updated successfully!');
    setShowSnackbar(true);
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setSnackbarMessage("All password fields are required.");
      setShowSnackbar(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setSnackbarMessage("New passwords do not match.");
      setShowSnackbar(true);
      return;
    }

    try {
      const res = await api.post('/auth/change-password', {
        userId: user.id,
        currentPassword,
        newPassword,
      });

      if (res.status === 200) {
        setSnackbarMessage('Password updated successfully!');
        setShowSnackbar(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Password update failed.';
      setSnackbarMessage(errorMessage);
      setShowSnackbar(true);
    }
  };

  if (!user || !info) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', pt: 4 }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar src={profile.avatar} sx={{ width: 120, height: 120, mb: 2 }} />
                {isEditing && (
                  <IconButton component="label" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'background.paper' }}>
                    <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                    <PhotoCamera />
                  </IconButton>
                )}
              </Box>
              <Typography variant="h5" gutterBottom>{user.full_name}</Typography>
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" gap={1}>
                {sessions.map((session: any) => (
                  <Chip key={session.course.name} label={session.course.name} size="small" />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight={700}>Profile Settings</Typography>
              {!isEditing ? (
                <Button startIcon={<EditIcon />} onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                <Stack direction="row" spacing={1}>
                  <Button startIcon={<CancelIcon />} onClick={handleCancel} color="error">Cancel</Button>
                  <Button startIcon={<SaveIcon />} onClick={handleSave} variant="contained">Save Changes</Button>
                </Stack>
              )}
            </Box>

            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tab icon={<EditIcon />} label="Personal Info" />
              <Tab icon={<NotificationsIcon />} label="Notifications" />
              <Tab icon={<SecurityIcon />} label="Security" />
            </Tabs>

            {activeTab === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><TextField label="Full Name" name="fullName" value={profile.fullName} onChange={handleChange} fullWidth disabled={!isEditing} /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Email Address" name="email" value={profile.email} onChange={handleChange} fullWidth type="email" disabled={!isEditing} /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Phone Number" name="phone" value={profile.phone} onChange={handleChange} fullWidth disabled={!isEditing} /></Grid>
                <Grid item xs={12} sm={6}><TextField label="Emergency Contact" name="emergencyContact" value={profile.emergencyContact} onChange={handleChange} fullWidth disabled={!isEditing} /></Grid>
                <Grid item xs={12}><TextField label="Home Address" name="homeAddress" value={profile.homeAddress} onChange={handleChange} fullWidth multiline rows={2} disabled={!isEditing} /></Grid>
              </Grid>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
                <Stack spacing={2}>
                  {(['email', 'sms', 'marketing'] as (keyof ProfileData['notifications'])[]).map((type) => (
                    <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography>{type.toUpperCase()} Notifications</Typography>
                        <Typography variant="body2" color="text.secondary">Manage your {type} notifications</Typography>
                      </Box>
                      <Button variant={profile.notifications[type] ? 'contained' : 'outlined'} onClick={() => handleNotificationChange(type)}>
                        {profile.notifications[type] ? 'Enabled' : 'Disabled'}
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>Security Settings</Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>Change Password</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}><TextField label="Current Password" type="password" fullWidth value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></Grid>
                      <Grid item xs={12}><TextField label="New Password" type="password" fullWidth value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></Grid>
                      <Grid item xs={12}><TextField label="Confirm New Password" type="password" fullWidth value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></Grid>
                      <Grid item xs={12}><Button variant="contained" startIcon={<LockIcon />} onClick={handlePasswordUpdate}>Update Password</Button></Grid>
                    </Grid>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>Account Actions</Typography>
                    <Stack spacing={2}>
                      <Button variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
                      <Button variant="outlined" color="error">Delete Account</Button>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={() => setShowSnackbar(false)}>
        <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TutorProfile;
