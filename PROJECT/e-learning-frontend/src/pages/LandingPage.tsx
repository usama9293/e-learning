import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // adjust if needed

// Icons
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';

// Images
const heroBg = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
const aboutImg = 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80';

// Features and Events
const features = [
  {
    icon: <SchoolOutlinedIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Conceptual Clarity',
    description: 'Deep Understanding',
  },
  {
    icon: <AccessTimeOutlinedIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Flexible Timings',
    description: 'Customizable Schedule',
  },
  {
    icon: <TrendingUpOutlinedIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Progress Tracking',
    description: 'Regular Assessments',
  },
  {
    icon: <AssignmentOutlinedIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Exam Preparation',
    description: 'Focused Practice',
  },
];

const LandingPage = () => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (role) {
      const redirectTo = {
        student: '/student',
        tutor: '/tutor',
        admin: '/admin',
      }[role];

      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [role, navigate]);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: { xs: 300, md: 400 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          color: 'white',
          mb: 6,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0, 51, 102, 0.6)',
            zIndex: 1,
          }}
        />
        <Container sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Transform Your Learning Journey
          </Typography>
          <Typography variant="h6" mb={3}>
            Interactive learning, real-time booking, and seamless access — all in one place.
          </Typography>
          <Button variant="contained" color="warning" size="large" href="/register">
            START ENROLLING TODAY
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ mb: 6 }}>
        <Typography variant="h4" align="center" fontWeight={700} mb={3}>
          Key Features
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Card elevation={2} sx={{ p: 2, minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {feature.icon}
                <Typography variant="h6" mt={2} mb={1} align="center">
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" align="center">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Us */}
      <Container sx={{ mb: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight={700} mb={2}>
              ABOUT US
            </Typography>
            <Typography color="text.secondary" mb={2}>
              At MathsMastery Institute, we believe that every student has the potential to excel in mathematics—whether you're struggling with the basics or aiming for top-tier university entrance.
              <br />
              <br />
              {showMore && (
                <>
                  Founded in Melbourne, our institute brings together experienced educators, data-driven teaching strategies, and a supportive environment tailored to individual learning needs.
                  <br />
                  <br />
                  We provide an immersive learning experience designed to build clarity, confidence, and competence. With the support of expert tutors and smart use of technology, we help you achieve mathematical excellence and unlock your full academic potential.
                </>
              )}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontWeight: 700 }}
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? 'READ LESS' : 'READ MORE'}
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={aboutImg}
              alt="About us"
              sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Contact Section */}
      <Box sx={{ bgcolor: 'primary.dark', color: 'white', py: 4 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                CONTACT
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneOutlinedIcon sx={{ mr: 1 }} /> (123) 466-7690
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneOutlinedIcon sx={{ mr: 1 }} /> (123) 456-7890
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailOutlinedIcon sx={{ mr: 1 }} /> info@mathainstitute.edu.au
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnOutlinedIcon sx={{ mr: 1 }} />  2/56 Barretta Road, <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ravenhall, Vic 3023 
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
