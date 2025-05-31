import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container, Stack, IconButton, Menu, MenuItem } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
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

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // Profile menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
 
  useEffect(() => {
    // Only run navigation logic after initial mount
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }

    const publicPaths = ['/', '/login', '/register', '/about', '/contact'];
    const isPublicPath = publicPaths.includes(location.pathname);

    if (!isAuthenticated && !isPublicPath) {
      navigate('/login', { replace: true });
    } else if (isAuthenticated && isPublicPath) {
      // Redirect authenticated users from public pages to their dashboard
      const role = localStorage.getItem('role')?.toLowerCase();
      switch(role) {
        case 'student':
          navigate('/student', { replace: true });
          break;
        case 'tutor':
          navigate('/tutor', { replace: true });
          break;
        case 'admin':
          navigate('/admin', { replace: true });
          break;
      }
    }
  }, [location.pathname, isAuthenticated, navigate, isInitialized]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    if(localStorage.getItem('role') === "tutor"){
      navigate('/tutor/profile');
    }
    else{
      navigate('/profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  // Helper to check if nav item is active
  const isActive = (path: string) => {
    if (path === '/student' && location.pathname === '/student') return true;
    if (path !== '/student' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
            {isAuthenticated ? (
              <Stack direction="row" spacing={2} alignItems="center">
                {navItems
                  .filter((item) => item.role === localStorage.getItem('role'))
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
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Welcome, {user?.full_name}
                </Typography>
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
                <Button color="inherit" onClick={() => navigate('/register')}>
                  Register
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