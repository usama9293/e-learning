import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container, Stack, IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState<any>(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });

  // Profile menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
    const userStr = localStorage.getItem('user');
    setUser(userStr ? JSON.parse(userStr) : null);
  }, [location.pathname]);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }
    const publicPaths = ['/', '/login', '/register', '/about', '/contact'];
    const isPublicPath = publicPaths.includes(location.pathname);
    if (!isAuthenticated && !isPublicPath) {
      navigate('/login', { replace: true });
    } else if (isAuthenticated && isPublicPath) {
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
  };
  const handleLogout = () => {
    handleClose();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/', { replace: true });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: '#003366' }}>
        <Container maxWidth="xl">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              E-Learning Platform
            </Typography>
            {isAuthenticated ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Welcome, {user?.full_name}
                </Typography>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  onClick={handleMenu}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
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
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout; 