import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Stack,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import { format } from 'date-fns';

// Mock data with more details
const mockAvailableSessions = [
  {
    id: 1,
    tutor: 'Jane Smith',
    subject: 'Algebra',
    date: '2024-06-10',
    time: '10:00 AM',
    duration: 60,
    price: 50,
    level: 'Intermediate',
    maxStudents: 3,
    currentStudents: 1,
  },
  {
    id: 2,
    tutor: 'John Doe',
    subject: 'Geometry',
    date: '2024-06-11',
    time: '2:00 PM',
    duration: 45,
    price: 40,
    level: 'Beginner',
    maxStudents: 2,
    currentStudents: 0,
  },
  {
    id: 3,
    tutor: 'Emily Johnson',
    subject: 'Trigonometry',
    date: '2024-06-12',
    time: '9:00 AM',
    duration: 90,
    price: 75,
    level: 'Advanced',
    maxStudents: 1,
    currentStudents: 0,
  },
];

const subjects = ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'];
const tutors = ['Jane Smith', 'John Doe', 'Emily Johnson'];
const levels = ['Beginner', 'Intermediate', 'Advanced'];

const StudentSessions = () => {
  const [available, setAvailable] = useState(mockAvailableSessions);
  const [booked, setBooked] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    subject: '',
    tutor: '',
    level: '',
    date: null as Date | null,
  });
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const handleBook = (session: any) => {
    setBooked([...booked, { ...session, status: 'confirmed' }]);
    setAvailable(available.filter((s) => s.id !== session.id));
    setSelected(null);
  };

  const handleCancel = (session: any) => {
    setBooked(booked.filter((s) => s.id !== session.id));
    setAvailable([...available, { ...session, status: 'available' }]);
  };

  const handleFilterChange = (field: string, value: any) => {
    setFilters({ ...filters, [field]: value });
  };

  const filteredSessions = available.filter((session) => {
    return (
      (!filters.subject || session.subject === filters.subject) &&
      (!filters.tutor || session.tutor === filters.tutor) &&
      (!filters.level || session.level === filters.level) &&
      (!filters.date || session.date === format(filters.date, 'yyyy-MM-dd'))
    );
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Book a Session
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          <Button
            variant={view === 'list' ? 'contained' : 'outlined'}
            onClick={() => setView('list')}
          >
            List
          </Button>
          <Button
            variant={view === 'calendar' ? 'contained' : 'outlined'}
            onClick={() => setView('calendar')}
          >
            Calendar
          </Button>
        </Stack>
      </Box>

      {showFilters && (
        <Paper sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={filters.subject}
                  label="Subject"
                  onChange={(e) => handleFilterChange('subject', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {subjects.map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tutor</InputLabel>
                <Select
                  value={filters.tutor}
                  label="Tutor"
                  onChange={(e) => handleFilterChange('tutor', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {tutors.map((tutor) => (
                    <MenuItem key={tutor} value={tutor}>
                      {tutor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select
                  value={filters.level}
                  label="Level"
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {levels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateCalendar
                  value={filters.date}
                  onChange={(date) => handleFilterChange('date', date)}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Paper>
      )}

      {view === 'list' ? (
        <>
          <Typography variant="h6" mt={3} mb={2}>
            Available Sessions
          </Typography>
          <Grid container spacing={3} mb={4}>
            {filteredSessions.length === 0 && (
              <Grid item xs={12}>
                <Typography color="text.secondary">No available sessions match your filters.</Typography>
              </Grid>
            )}
            {filteredSessions.map((session) => (
              <Grid item xs={12} md={6} key={session.id}>
                <Paper elevation={2} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6">{session.subject}</Typography>
                    <Chip label={session.level} color="primary" size="small" />
                  </Box>
                  <Typography><b>Tutor:</b> {session.tutor}</Typography>
                  <Typography><b>Date:</b> {session.date}</Typography>
                  <Typography><b>Time:</b> {session.time}</Typography>
                  <Typography><b>Duration:</b> {session.duration} minutes</Typography>
                  <Typography><b>Price:</b> ${session.price}</Typography>
                  <Typography>
                    <b>Availability:</b> {session.currentStudents}/{session.maxStudents} students
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 1, alignSelf: 'flex-end' }}
                    onClick={() => setSelected(session)}
                    disabled={session.currentStudents >= session.maxStudents}
                  >
                    Book
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Paper sx={{ p: 2 }}>
            <DateCalendar
              value={filters.date}
              onChange={(date) => handleFilterChange('date', date)}
            />
          </Paper>
        </LocalizationProvider>
      )}

      <Typography variant="h6" mt={3} mb={2}>
        My Booked Sessions
      </Typography>
      <Grid container spacing={3}>
        {booked.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary">You have not booked any sessions yet.</Typography>
          </Grid>
        )}
        {booked.map((session) => (
          <Grid item xs={12} md={6} key={session.id}>
            <Paper elevation={1} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1, bgcolor: '#f5f5f5' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6">{session.subject}</Typography>
                <Chip label={session.status} color="success" size="small" />
              </Box>
              <Typography><b>Tutor:</b> {session.tutor}</Typography>
              <Typography><b>Date:</b> {session.date}</Typography>
              <Typography><b>Time:</b> {session.time}</Typography>
              <Typography><b>Duration:</b> {session.duration} minutes</Typography>
              <Typography><b>Price:</b> ${session.price}</Typography>
              <Button
                variant="outlined"
                color="error"
                sx={{ mt: 1, alignSelf: 'flex-end' }}
                onClick={() => handleCancel(session)}
              >
                Cancel Session
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Confirm Booking
          <IconButton
            aria-label="close"
            onClick={() => setSelected(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Session Details
            </Typography>
            <Typography><b>Subject:</b> {selected?.subject}</Typography>
            <Typography><b>Tutor:</b> {selected?.tutor}</Typography>
            <Typography><b>Date:</b> {selected?.date}</Typography>
            <Typography><b>Time:</b> {selected?.time}</Typography>
            <Typography><b>Duration:</b> {selected?.duration} minutes</Typography>
            <Typography><b>Level:</b> {selected?.level}</Typography>
            <Typography><b>Price:</b> ${selected?.price}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Cancel</Button>
          <Button variant="contained" onClick={() => handleBook(selected)}>
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentSessions; 