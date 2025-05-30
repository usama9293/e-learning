import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  useTheme,
  Grid,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Payment as PaymentIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import UsersManagement from './UsersManagement';
import CoursesManagement from './CoursesManagement';
import SessionsManagement from './SessionsManagement';
import PaymentsManagement from './PaymentsManagement';
import LogsManagement from './LogsManagement';
import Settings from './Settings';
import { useSnackbar } from 'notistack';
import api from '../../services/api';
import SideBar from './SideBar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const drawerWidth = 240; 

interface DashboardStats {
  totalStudents: number;
  totalTutors: number;
  totalCourses: number;
  totalSessions: number;
  recentActivity: Array<{
    id: number;
    type: string;
    description: string;
    timestamp: string;
  }>;
  enrollmentTrend: Array<{
    date: string;
    count: number;
  }>;
}

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // setLoading(true);
      const response = await api.get('/admin/dashboard');
      console.log(response.data);
      setStats(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to fetch dashboard data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  

  // const [stats, setStats] = useState<DashboardStats | null>(null);
  // const [loading, setLoading] = useState(false);
  // const { enqueueSnackbar } = useSnackbar();

  const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>{icon}</Avatar>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  );
  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <SideBar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: '64px',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        {loading || !stats ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Dashboard Overview
            </Typography>
  
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Students"
                  value={stats.totalStudents}
                  icon={<PeopleIcon />}
                  color="#1976d2"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Tutors"
                  value={stats.totalTutors}
                  icon={<SchoolIcon />}
                  color="#2e7d32"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Active Courses"
                  value={stats.totalCourses}
                  icon={<AssignmentIcon />}
                  color="#ed6c02"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Scheduled Sessions"
                  value={stats.totalSessions}
                  icon={<EventIcon />}
                  color="#9c27b0"
                />
              </Grid>
  
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2, height: '400px' }}>
                  <Typography variant="h6" gutterBottom>
                    Enrollment Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.enrollmentTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#1976d2"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
  
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, height: '400px', overflow: 'auto' }}>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <List>
                    {stats.recentActivity?.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={activity.description}
                            secondary={new Date(activity.timestamp).toLocaleString()}
                          />
                        </ListItem>
                        {index < stats.recentActivity.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};  

export default AdminDashboard; 