import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Grid,
  Avatar,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Card,
  CardContent,
  Stack,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import api from '../../services/api'
interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  gradeLevel: string;
  homeAddress: string;
  emergencyContact: string;
  parentName: string;
  avatar?: string;
  bio?: string;
  subjects: string[];
  notifications: {
    email: boolean;
    sms: boolean;
    marketing: boolean;
  };
}

const initialProfile: ProfileData = {
  fullName: 'John Doe',
  email: 'johndoe@example.com',
  phone: '0412345678',
  gradeLevel: 'Year 8',
  homeAddress: '123 Main Street, Ravenhall, VIC',
  emergencyContact: 'Jane Doe - 0412987654',
  parentName: 'Jane Doe',
  bio: 'Passionate about mathematics and eager to learn!',
  subjects: ['Algebra', 'Geometry', 'Trigonometry'],
  notifications: {
    email: true,
    sms: true,
    marketing: false,
  },
};

const gradeLevels = [
  'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12'
];

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const userStr = localStorage.getItem('user');
  const user = JSON.parse(userStr);
  const info = user.info; 
  const [sessions, SetSessions] = useState([]);

  useEffect(() => { 
    const loadSessions = async () => {
      
      try{
        const res = await api.get(`/students/${info.id}/sessions`);
        SetSessions(res.data)
        
       
       
      }
    
      catch(err){
        // enqueueSnackbar('Failed to load sessions:', { variant: 'error' });
        SetSessions([]);
      }
    } 
    

    loadSessions();
  }, []);

  const navigate = useNavigate();

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
    // TODO: Save changes to backend
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Summary Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', pt: 4 }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={profile.avatar}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                {isEditing && (
                  <IconButton
                    component="label"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <PhotoCamera />
                  </IconButton>
                )}
              </Box>
              <Typography variant="h5" gutterBottom>
                {user.full_name}
              </Typography>
              
              {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {profile.bio}
              </Typography> */}
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" gap={1}>
                {sessions.map((session) => (
                  <Chip key={session.course.name} label={session.course.name} size="small" />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Profile Content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight={700}>
                Profile Settings
              </Typography>
              {!isEditing ? (
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <Stack direction="row" spacing={1}>
                  <Button
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    color="error"
                  >
                    Cancel
                  </Button>
                  <Button
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    variant="contained"
                  >
                    Save Changes
                  </Button>
                </Stack>
              )}
            </Box>

            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
            >
              <Tab icon={<EditIcon />} label="Personal Info" />
              <Tab icon={<NotificationsIcon />} label="Notifications" />
              <Tab icon={<SecurityIcon />} label="Security" />
            </Tabs>

            {activeTab === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    value={user.full_name}
                    onChange={handleChange}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    fullWidth
                    type="email"
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    name="phone"
                    value={info.contact_number}
                    onChange={handleChange}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Emergency Contact"
                    name="emergencyContact"
                    value={info.emergency_contact}
                    onChange={handleChange}
                    fullWidth
                    disabled={!isEditing}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Home Address"
                    name="homeAddress"
                    value={info.address}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={2}
                    disabled={!isEditing}
                  />
                </Grid>
                
                <Grid item xs={12} >
                  <TextField
                    label="Parent/Guardian Name"
                    name="parentName"
                    value={info.parent_guardian}
                    onChange={handleChange}
                    fullWidth
                    rows={2}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Notification Preferences
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography>Email Notifications</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Receive updates about your courses and assignments
                      </Typography>
                    </Box>
                    <Button
                      variant={profile.notifications.email ? 'contained' : 'outlined'}
                      onClick={() => handleNotificationChange('email')}
                    >
                      {profile.notifications.email ? 'Enabled' : 'Disabled'}
                    </Button>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography>SMS Notifications</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Get important alerts via text message
                      </Typography>
                    </Box>
                    <Button
                      variant={profile.notifications.sms ? 'contained' : 'outlined'}
                      onClick={() => handleNotificationChange('sms')}
                    >
                      {profile.notifications.sms ? 'Enabled' : 'Disabled'}
                    </Button>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography>Marketing Communications</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Receive updates about new courses and promotions
                      </Typography>
                    </Box>
                    <Button
                      variant={profile.notifications.marketing ? 'contained' : 'outlined'}
                      onClick={() => handleNotificationChange('marketing')}
                    >
                      {profile.notifications.marketing ? 'Enabled' : 'Disabled'}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Change Password
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          label="Current Password"
                          type="password"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="New Password"
                          type="password"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Confirm New Password"
                          type="password"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          startIcon={<LockIcon />}
                        >
                          Update Password
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Account Actions
                    </Typography>
                    <Stack spacing={2}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                      >
                        Delete Account
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 