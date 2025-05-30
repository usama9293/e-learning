import { useState } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem } from '@mui/material';
import SideBar from './SideBar';

const drawerWidth = 240; 
const mockLogs = [
  { id: 1, timestamp: '2024-05-10 09:00', action: 'User login', user: 'Alice Johnson' },
  { id: 2, timestamp: '2024-05-10 09:05', action: 'Course created', user: 'Bob Smith' },
  { id: 3, timestamp: '2024-05-10 09:10', action: 'Payment processed', user: 'Carol Lee' },
];

const initialEvents = [
  { id: 1, title: 'Algebra Bootcamp', date: '2024-06-01', description: 'Intensive algebra workshop.' },
];

const PlatformLogsReports = () => {
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [events, setEvents] = useState(initialEvents);
  const [eventForm, setEventForm] = useState({ title: '', date: '', description: '' });

  const handleAddEvent = () => {
    if (eventForm.title && eventForm.date && eventForm.description) {
      setEvents([...events, { id: Date.now(), ...eventForm }]);
      setEventForm({ title: '', date: '', description: '' });
      setOpenEventDialog(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      
      <SideBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>Platform Logs & Reports</Typography>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Events</Typography>
        <Button variant="contained" onClick={() => setOpenEventDialog(true)}>Add Event</Button>
      </Box>
      <List sx={{ mb: 4 }}>
        {events.map((event) => (
          <ListItem key={event.id}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>{event.title} ({event.date})</Typography>
              <Typography variant="body2" color="text.secondary">{event.description}</Typography>
            </Box>
          </ListItem>
        ))}
      </List>
      <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={eventForm.title}
            onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date"
            type="date"
            value={eventForm.date}
            onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Description"
            value={eventForm.description}
            onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEventDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddEvent}>Add Event</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Recent Platform Logs</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom>Analytics & Reports</Typography>
        <Paper sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
          Analytics and reports will be displayed here. (Feature coming soon)
        </Paper>
      </Box>
    </Container>
    </Box>
    </Box>
  );
};

export default PlatformLogsReports; 