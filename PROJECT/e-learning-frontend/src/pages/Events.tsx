import { useEffect, useState } from 'react';
import { Box, Container, Grid, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import api from '../services/api';


const Events = () => {
  const [selected, setSelected] = useState<null | typeof events[0]>(null);
  const [events, setEvents] = useState([]);

  const getEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom align="center">
          Latest Events
        </Typography>
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} md={6} key={event.title}>
              <Paper
                elevation={1}
                sx={{ p: 2, height: '100%', borderLeft: '4px solid #1976d2', cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}
                onClick={() => setSelected(event)}
              >
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" sx={{ bgcolor: '#ffe066', color: '#003366', px: 1, py: 0.5, borderRadius: 1, fontWeight: 700 }}>
                  {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{selected?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" color="primary" mb={2}>
          {new Date(selected?.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
          </Typography>
          <Typography variant="body1">{selected?.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Events; 