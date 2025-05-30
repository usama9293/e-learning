import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';

const steps = ['Credentials', 'Personal Information'];

const initialForm = {
  role: '',
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  fullName: '',
  dob: '',
  gender: '',
  contactNumber: '',
  homeAddress: '',
  gradeLevel: '',
  emergencyContact: '',
  parentName: '',
};

const StudentRegistration = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [nameError, setnameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [e.target.name]: e.target.value });

    if(name === "username"){
      if(!value.length){
        setnameError("Please Enter UserName");
      }else{
        setnameError("");
      }
    }

    if (name === "email") {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setEmailError(!isValid);
    }

    if (name === "password") {
      if (value.length < 6) {
        setPasswordError("Password must be at least 6 characters.");
      } else {
        setPasswordError('');
      }

      if (form.confirmPassword && value !== form.confirmPassword) {
        setConfirmPasswordError("Passwords do not match.");
      } else {
        setConfirmPasswordError('');
      }
    }
    if (name === "confirmPassword") {
      if (form.password && value !== form.password) {
        setConfirmPasswordError("Passwords do not match.");
      } else {
        setConfirmPasswordError('');
      }
    }
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setForm({ ...form, role: event.target.value });
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);

    const payload = {
      email: form.email,
      password: form.password,
      role: form.role,
      full_name: form.fullName,
      dob: form.dob,
      gender: form.gender,
      contact_number: form.contactNumber,
      address: form.homeAddress,
      grade_level: form.gradeLevel,
      emergency_contact: form.emergencyContact,
      parent_guardian: form.parentName,
    };

    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 400 && data.detail === "Email already registered") {
          setError("This email is already registered. Please use another email or log in.");
        } else {
          setError(data.detail || "Registration failed.");
        }
        return;
      }

      setSubmitted(true);
      setError('');
      navigate('/login');
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom fontWeight={600}>
          Registration Form
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit}>
          {activeStep === 0 && (
            <Box>
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="role-label">Register as</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={form.role}
                  label="Register as"
                  onChange={handleRoleChange}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="tutor">Tutor</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!nameError}
                helperText={nameError}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!passwordError}
                helperText={passwordError}
                />
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={emailError}
                helperText={emailError ? "Please enter a valid email address." : ""}
              />
            </Box>
          )}
          {activeStep === 1 && (
            <Box>
              <TextField
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Date of Birth"
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                select
                fullWidth
                margin="normal"
                required
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <TextField
                label="Contact Number"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Home Address"
                name="homeAddress"
                value={form.homeAddress}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                minRows={2}
                required
              />
              {/* Only show these fields if role is student */}
              {form.role === 'student' && (
                <TextField
                  label="Grade Level"
                  name="gradeLevel"
                  value={form.gradeLevel}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
              )}
              <TextField
                label="Emergency Contact Details"
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                minRows={2}
                required
              />
              {/* Only show these fields if role is student */}
              {form.role === 'student' && (
                <TextField
                  label="Parent/Guardian Name"
                  name="parentName"
                  value={form.parentName}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
              )}
            </Box>
          )}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item>
              {activeStep > 0 && (
                <Button variant="outlined" onClick={handleBack}>
                  Previous
                </Button>
              )}
            </Grid>
            <Grid item>
              {activeStep < steps.length - 1 ? (
                <Button variant="contained" onClick={handleNext} disabled={!form.role || !form.username || !form.password || form.password !== form.confirmPassword || !form.email || emailError}>
                  Next
                </Button>
              ) : (
                <Button type="submit" variant="contained" color="success">
                  Submit Registration
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
        {submitted && (
          <Typography color="success.main" align="center" sx={{ mt: 2 }}>
            Registration submitted! (Demo only)
          </Typography>
        )}
        {error && (
          <Typography color="error.main" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default StudentRegistration; 