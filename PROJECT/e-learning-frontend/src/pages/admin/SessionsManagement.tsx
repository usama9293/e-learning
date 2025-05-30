import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import api from '../../services/api';
import TableComponent from './TableComponent';
import SideBar from './SideBar';
import { useSnackbar } from 'notistack';
const drawerWidth = 240;

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];



const SessionsManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    course_id: '',
    tutor_info_id: '',
    date: null,
    days: [],
    timeRange: {
      start: null,
      end: null,
    },
    status: 'scheduled', 
  });

  useEffect(() => {
    fetchSessions();
    fetchCourses();
    fetchTutors();
  }, []);

  const fetchSessions = async () => {
    const res = await api.get('/admin/sessions');
    setSessions(res.data.items);
  };

  const fetchCourses = async () => {
    const res = await api.get('/admin/courses');
    
    setCourses(res.data.items);
  };

  const fetchTutors = async () => {
    const res = await api.get('/admin/users/tutors');
    setTutors(res.data.items);
  };

  const handleOpenDialog = (session = null) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        course_id: session.course_id,
        tutor_info_id: session.fullname,
        date: new Date(session.date),
        days: session.days || [],
        timeRange: {
          start: new Date(`1970-01-01T${session.start_time}`),
          end: new Date(`1970-01-01T${session.end_time}`),
        },
        status: session.status,
      });
    } else {
      setEditingSession(null);
      setFormData({ 
        course_id: '',
        tutor_info_id: '',
        date: null,
        days: [],
        timeRange: { start: null, end: null },
        status: 'scheduled',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSubmit = async () => {
    setLoading(true);
    let payload = {
        course_id: formData.course_id,
      tutor_info_id: formData.tutor_info_id,
      date: formData.date?.toISOString().split('T')[0],
      days: formData.days,
      start_time: formData.timeRange.start?.toISOString().substr(11, 5),
      end_time: formData.timeRange.end?.toISOString().substr(11, 5),
      status: formData.status,
    
  };
    

    try {
      if (editingSession) {
        const session_update={
            course_id: formData.course_id,
          tutor_info_id: formData.tutor_info_id,
          date: formData.date?.toISOString().split('T')[0],
          days: formData.days,
          start_time: formData.timeRange.start?.toISOString().substr(11, 5),
          end_time: formData.timeRange.end?.toISOString().substr(11, 5),
          status: formData.status,
        
      };
        // payload.session_id=editingSession.id;
        console.log(session_update)
        await api.put(`/sessions/${editingSession.id}`,session_update);
      } else {
        await api.post('/sessions', payload);
      }

    handleCloseDialog();
    fetchSessions();
  } catch (error) {
    const res = error.response;
    enqueueSnackbar(res.data.detail, { variant: 'error' });
  } finally {
    setLoading(false);
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
    <Box p={2}>
      <Button variant="contained" onClick={() => handleOpenDialog()}>Add Session</Button>

      <TableComponent
        data={sessions}
        onEdit={handleOpenDialog}
        onDelete={async (id) => {
          await api.delete(`/sessions/${id}`);
          fetchSessions();
        }}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSession ? 'Edit Session' : 'Add Session'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Course</InputLabel>
                <Select
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                >
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>{course.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tutor</InputLabel>
                <Select
                  value={formData.tutor_info_id}
                  onChange={(e) => setFormData({ ...formData, tutor_info_id: e.target.value })}
                >
                  {tutors.map((tutor) => (
                    <MenuItem key={tutor.id} value={tutor.id}>{tutor.full_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={(newValue) => setFormData({ ...formData, date: newValue })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Days</InputLabel>
                <Select
                  multiple
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {daysOfWeek.map((day) => (
                    <MenuItem key={day} value={day}>{day}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Time Range
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TimePicker
                      label="Start"
                      value={formData.timeRange.start}
                      onChange={(val) => setFormData({ ...formData, timeRange: { ...formData.timeRange, start: val } })}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TimePicker
                      label="End"
                      value={formData.timeRange.end}
                      onChange={(val) => setFormData({ ...formData, timeRange: { ...formData.timeRange, end: val } })}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingSession ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </Box>
    </Box>
  );
};

export default SessionsManagement;
