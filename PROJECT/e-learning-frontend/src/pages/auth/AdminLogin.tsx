import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Link,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem, 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';


const  AdminLogin = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [role, setRole] = useState('');
      const navigate = useNavigate();
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
    
        try {
          const res = await fetch('https://e-learning-backend-7-57nd.onrender.com/api/v1/auth/adminlogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ username: email, password: password, role: role }),
          });
    
          if (!res.ok) {
            const data = await res.json();
            setError(data.detail || 'Login failed.');
            setIsLoading(false);
            return;
          }
    
          const data = await res.json();
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('role', data.role);
          setRole(data.role)
          console.log(role)
    
          // Redirect based on role
          if (data.role === 'admin') {
            console.log('admin');
            navigate('/admin');
          }
          
        } catch (err) {
          setError('Network error. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
    
      return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 2, boxShadow: 3, borderRadius: 2, bgcolor: '#fff' }}>
          <Typography variant="h4" gutterBottom align="center">
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Password *"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
             
            {error && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {error}
              </Alert>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <Typography align="center" sx={{ mt: 2 }}>
            <Link href="/register" underline="hover">
              Don't have an account? Register
            </Link>
          </Typography>
        </Box>
      );
    };
    
    export default AdminLogin; 