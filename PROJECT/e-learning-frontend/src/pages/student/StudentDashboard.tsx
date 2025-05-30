import { useEffect, useState } from 'react';
import { fetchStudentCourses, fetchStudentSessions } from '../../api/courses';
import { Box, Container, Grid, Card, CardContent, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api'


const StudentDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<null | typeof events[0]>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [latestEvents,setlatestEvents] = useState([]);
  const [events,setEvents] = useState([]);
  const navigate = useNavigate();
  
  const getEvents = async () =>{
      try{
        const res = await api.get('/events/latest');
      setEvents(res.data)
      }catch(error){
        console.log(error);
      }
  }
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const id_ = user.info.id
    if (!token) return;
    getEvents();
    fetchStudentSessions(id_)
      .then(setSessions)
      .catch(() => setError('Failed to load sessions'))
      .finally(() => setLoading(false));
  }, []);

  
  return (
    <Box>
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          My Courses
        </Typography>
        {loading ? (
          <Typography>Loading courses...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3} mb={4}>
            {sessions.map((session) => (
              <Grid item xs={12} md={4} key={session.id}>
                <Card
                  elevation={2}
                  sx={{ p: 2, minHeight: 180, cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}
                  onClick={() => setSelectedCourse(session)}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <SchoolIcon color="primary" fontSize="large" />
                    <Typography variant="h6" mt={2} mb={1} align="center">
                      {session.course.name}
                    </Typography>
                    <Typography color="text.secondary" align="center" mb={1}>
                      Description: {session.description}
                    </Typography>
                    {/* <Typography color="text.secondary" align="center" mb={1}>
                      Days: {session.days}
                    </Typography> */}
                    <Typography color="text.primary" align="center" mb={1}>
                      Schedule: 
                    </Typography>
                    <Typography color="text.secondary" align="center" mb={1}>
                      {session.days} - {session.start_time} : {session.end_time} 
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Typography variant="h5" mb={2} fontWeight={600}>
          <EventNoteIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Latest Events
        </Typography>
        <Grid container spacing={3} mb={2}>
          {events.map((event) => (
            <Grid item xs={12} md={4} key={event.title}>
              <Paper
                elevation={1}
                sx={{ p: 2, cursor: 'pointer', borderLeft: '4px solid #1976d2', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}
                onClick={() => setSelectedEvent(event)}
              >
                <Typography variant="caption" sx={{ bgcolor: '#ffe066', color: '#003366', px: 1, py: 0.5, borderRadius: 1, fontWeight: 700 }}>
                {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                </Typography>
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
        <Box sx={{ textAlign: 'right', mb: 4 }}>
          <Button variant="text" color="primary" onClick={() => navigate('/student-events')}>
            View All Events →
          </Button>
        </Box>
      </Container>
      <Dialog open={!!selectedCourse} onClose={() => setSelectedCourse(null)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{selectedCourse?.name}</DialogTitle>
        <DialogContent>
          {/* <Typography variant="body1" mb={2}>Tutor: {selectedCourse?.tutor_id}</Typography> */}
          <Typography variant="body1" mb={2}>Tutor: {selectedCourse?.tutor.full_name}</Typography>
          {/* <Typography variant="body1" mb={2}>Time: {selectedCourse?.schedule_time}</Typography> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedCourse(null)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{selectedEvent?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" color="primary" mb={2}>
            {selectedEvent?.date}
          </Typography>
          <Typography variant="body1">{selectedEvent?.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedEvent(null)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ bgcolor: '#003366', color: 'white', py: 2, mt: 4, textAlign: 'center' }}>
        <Typography variant="body2">
          © 2025 Mathsmastery Institute | Raswell, Victoria | All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default StudentDashboard; 