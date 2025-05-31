import { AppBar, Toolbar, Typography, Button, Box, Container, Stack, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';

const navItems = [
  // Tutor nav
  { label: 'Home', path: '/tutor', role: 'tutor' },
  { label: 'Courses', path: '/tutor-course/:courseId', role:'tutor' },
  { label: 'Events', path: '/tutor-events', role: 'tutor'},
  
  // Student nav
  { label: 'Home', path: '/student', role: 'student' },
  { label: 'Courses', path: '/student/courses', role: 'student' },
  { label: 'Learning Platform', path: '/course/:courseId', role: 'student' },
  { label: 'Events', path: '/student-events', role: 'student'},
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(localStorage.getItem('token')));
  const userRole = localStorage.getItem('role');
  const isLandingPage = location.pathname === '/';

  // Profile menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
 
  // Check authentication on mount and when location changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentRole = localStorage.getItem('role');
    
    setIsAuthenticated(Boolean(token));
    
    // Only redirect if not authenticated and not on landing page or login page
    if (!token && !isLandingPage && !location.pathname.includes('/login')) {
      navigate('/login', { state: { from: location }, replace: true });
    }
    
    // Only redirect from landing page if authenticated
    if (token && isLandingPage) {
      const redirectPath = {
        student: "/student",
        tutor: "/tutor",
        admin: "/admin"
      }[currentRole?.toLowerCase() || ""];
      
      if (redirectPath && location.pathname !== redirectPath) {
        navigate(redirectPath, { replace: true });
      }
    }
  }, [location.pathname, navigate, isLandingPage]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    if(userRole === "tutor"){
      navigate('/tutor/profile');
    }
    else{
      navigate('/profile');
    }
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/', { replace: true });
  };

  // Helper to check if nav item is active
  const isActive = (path: string) => {
    if (path === '/student' && location.pathname === '/student') return true;
    if (path !== '/student' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <Box>
      <AppBar position="static" sx={{ bgcolor: '#003366' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 700 }}
              onClick={() => navigate('/')}
            >
              Mathsmastery Institute
            </Typography>
            {isLandingPage ? (
              <Stack direction="row" spacing={2}>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button color="inherit" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </Stack>
            ) : isAuthenticated ? (
              <Stack direction="row" spacing={2} alignItems="center">
                {navItems
                  .filter((item) => item.role === userRole)
                  .map((item) => (
                    <Button
                      key={item.label}
                      color={isActive(item.path) ? 'primary' : 'inherit'}
                      sx={{ 
                        fontWeight: isActive(item.path) ? 700 : 400,
                        textDecoration: isActive(item.path) ? 'underline' : 'none'
                      }}
                      onClick={() => navigate(item.path)}
                    >
                      {item.label}
                    </Button>
                  ))}
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  onClick={handleMenu}
                  sx={{ ml: 1 }}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={handleProfile}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Stack>
            ) : (
              <Stack direction="row" spacing={2}>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button color="inherit" variant="outlined" onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </Stack>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 