import React from 'react';
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
} from '@mui/icons-material';
import UsersManagement from './UsersManagement';
import CoursesManagement from './CoursesManagement';
import SessionsManagement from './SessionsManagement';
import PaymentsManagement from './PaymentsManagement';
import LogsManagement from './LogsManagement';
import Settings from './Settings';

import SideBar from './SideBar';
const drawerWidth = 240; 

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // const menuItems = [
  //   { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  //   { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  //   { text: 'Courses', icon: <SchoolIcon />, path: '/admin/courses' },
  //   { text: 'Sessions', icon: <EventIcon />, path: '/admin/sessions' },
  //   { text: 'Payments', icon: <PaymentIcon />, path: '/admin/payments' },
  //   { text: 'Logs', icon: <AssessmentIcon />, path: '/admin/logs' },
  //   { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  // ];

  // const drawer = (
  //   <div>
  //     <Toolbar>
  //       <Typography variant="h6" noWrap component="div">
  //         Admin Panel
  //       </Typography>
  //     </Toolbar>
  //     <Divider />
  //     <List>
  //       {menuItems.map((item) => (
  //         <ListItem
  //           button
  //           key={item.text}
  //           component={Link}
  //           to={item.path}
  //           selected={location.pathname === item.path}
  //           sx={{
  //             '&.Mui-selected': {
  //               backgroundColor: theme.palette.primary.light,
  //               '&:hover': {
  //                 backgroundColor: theme.palette.primary.light,
  //               },
  //             },
  //           }}
  //         >
  //           <ListItemIcon>{item.icon}</ListItemIcon>
  //           <ListItemText primary={item.text} />
  //         </ListItem>
  //       ))}
  //     </List>
  //   </div>
  // );

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
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users/*" element={<UsersManagement />} />
            <Route path="/admin/courses/*" element={<CoursesManagement />} />
            <Route path="/admin/sessions/*" element={<SessionsManagement />} />
            <Route path="/admin/payments/*" element={<PaymentsManagement />} />
            <Route path="/admin/logs/*" element={<LogsManagement />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      {/* Add dashboard widgets and statistics here */}
    </Box>
  );
};

export default AdminDashboard; 