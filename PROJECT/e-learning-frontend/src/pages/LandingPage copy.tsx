import { Box, Button, Container, Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PaymentIcon from '@mui/icons-material/Payment';
import EventNoteIcon from '@mui/icons-material/EventNote';

const features = [
  {
    icon: <SchoolIcon color="primary" fontSize="large" />,
    title: 'Easy Enrollment',
    description: 'Register and enroll in your preferred courses with just a few clicks.'
  },
  {
    icon: <EventAvailableIcon color="primary" fontSize="large" />,
    title: 'Real-Time Booking',
    description: 'Book and manage tutoring sessions directly from your dashboard.'
  },
  {
    icon: <PaymentIcon color="primary" fontSize="large" />,
    title: 'Secure Payments',
    description: 'Enjoy peace of mind with integrated, PCI-compliant payment systems.'
  },
];

const events = [
  {
    title: 'Algebra Bootcamp',
    date: 'May 10, 2025',
    description: 'Master core algebra concepts in an interactive live session.'
  },
  {
    title: 'Term 2 Enrollment Drive',
    date: 'Open Now',
    description: 'Sign up before May 15 to receive special tuition discounts.'
  },
  {
    title: 'New LMS Launch',
    date: 'Coming Soon',
    description: 'A new interactive learning platform goes live in June 2025.'
  },
];

const heroBg = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';

const LandingPage = () => (
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
          Start Enrolling Today
        </Button>
      </Container>
    </Box>

    {/* Features Section */}
    <Container sx={{ mb: 6 }}>
      <Grid container spacing={3} justifyContent="center">
        {features.map((feature) => (
          <Grid item xs={12} md={4} key={feature.title}>
            <Card elevation={2} sx={{ p: 2, minHeight: 160 }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {feature.icon}
                <Typography variant="h6" mt={2} mb={1} align="center">
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" align="center">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>

    {/* Latest Events Section */}
    <Container>
      <Typography variant="h5" mb={2} fontWeight={600}>
        <EventNoteIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Latest Events
      </Typography>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={4} key={event.title}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {event.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {event.date}
              </Typography>
              <Typography variant="body2">{event.description}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default LandingPage; 