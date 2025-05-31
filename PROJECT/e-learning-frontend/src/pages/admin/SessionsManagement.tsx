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

interface FormData {
  course: string;
  tutor_info_id: string;
  date: Date | null;
  days: string[];
  start_time: Date | null;
  end_time: Date | null;
  status: string;
}

const SessionsManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    course: '',
    tutor_info_id: '',
    date: null,
    days: [],
    start_time: null,
    end_time: null,
    status: 'scheduled'
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
      handleEdit(session);
    } else {
      handleCloseDialog();
    }
    setOpenDialog(true);
  };

  const handleEdit = (session: any) => {
    setEditingSession(session);
    setFormData({
      course: session.course_id,
      tutor_info_id: session.tutor_info_id || '',
      date: session.date ? new Date(session.date) : null,
      days: session.days || [],
      start_time: session.start_time ? new Date(`1970-01-01T${session.start_time}`) : null,
      end_time: session.end_time ? new Date(`1970-01-01T${session.end_time}`) : null,
      status: session.status || 'scheduled'
    });
  };

  const handleCloseDialog = () => {
    setEditingSession(null);
    setFormData({
      course: '',
      tutor_info_id: '',
      date: null,
      days: [],
      start_time: null,
      end_time: null,
      status: 'scheduled'
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    let payload = {
      course_id: formData.course,
      tutor_info_id: formData.tutor_info_id,
      date: formData.date?.toISOString().split('T')[0],
      days: formData.days,
      start_time: formData.start_time?.toISOString().substr(11, 5),
      end_time: formData.end_time?.toISOString().substr(11, 5),
      status: formData.status,
    };
    

    try {
      if (editingSession) {
        const session_update = {
          course_id: formData.course,
          tutor_info_id: formData.tutor_info_id,
          date: formData.date?.toISOString().split('T')[0],
          days: formData.days,
          start_time: formData.start_time?.toISOString().substr(11, 5),
          end_time: formData.end_time?.toISOString().substr(11, 5),
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
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, days: Array.isArray(e.target.value) ? e.target.value : [e.target.value] })}
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
                      value={formData.start_time}
                      onChange={(val) => setFormData({ ...formData, start_time: val })}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TimePicker
                      label="End"
                      value={formData.end_time}
                      onChange={(val) => setFormData({ ...formData, end_time: val })}
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
