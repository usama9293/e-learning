import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CardMedia,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { fetchCourses } from '../../api/courses';
import { useSnackbar } from 'notistack';
import api from '../../services/api';

interface Course {
  id: number;
  name: string;
  description: string;
  enrolledStudents: number;
  averageProgress: number;
  created_at: string;
  created_by: number;
  image: string;
  title: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  progress: number;
  lastActive: string;
}

interface Session {
  id: number;
  course: {
    id: number;
    name: string;
  };
  days: string;
  start_time: string;
  end_time: string;
  students: string[];
  created_at: string;
  created_by: number;
}

interface Material {
  id: number;
  course: string;
  fileName: string;
  created_at: string;
  created_by: number;
}

const TutorDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [todaysessions, setTodaySessions] = useState<Session[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [openSessionDialog, setOpenSessionDialog] = useState(false);
  const [sessionForm, setSessionForm] = useState<Partial<Session>>({});
  const [editSessionId, setEditSessionId] = useState<number | null>(null);
  const [openMaterialDialog, setOpenMaterialDialog] = useState(false);
  const [materialForm, setMaterialForm] = useState<{ course: string; file: File | null }>({ course: '', file: null });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
 
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tutor/courses', {
        params: {
          page: page ,
          per_page: 5,
          search,
          
        },
      });
      console.log(response.data.items)
      setCourses(response.data.items)
    
     
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Failed to fetch sessions', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tutor/sessions', {
        params: {
          page: 1,
          per_page: 5,
          search,
          start_date: startOfDay,
          end_date: endOfDay,
        },
      });

      setSessions(response.data.items);
     
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Failed to fetch sessions', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
 
    fetchSessions();
    fetchCourses();
    
 
  }, []);
 
  // Tab change
  const handleTabChange = (_: any, newValue: number) => setActiveTab(newValue);

  // Session management
  const handleOpenSessionDialog = (session?: Session) => {
    if (session) {
      setSessionForm({
        course: session.course,
        days: session.days,
        start_time: session.start_time,
        end_time: session.end_time,
      });
      setEditSessionId(session.id);
    } else {
      setSessionForm({});
      setEditSessionId(null);
    }
    setOpenSessionDialog(true);
  };
  const handleCloseSessionDialog = () => {
    setOpenSessionDialog(false);
    setSessionForm({});
    setEditSessionId(null);
  };
  const handleSessionFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'course') {
      const selected = courses.find(c => c.id === Number(value));
      setSessionForm({
        ...sessionForm,
        course: selected ? { id: selected.id, name: selected.name } : { id: 0, name: '' }
      });
    } else {
      setSessionForm({ ...sessionForm, [name]: value });
    }
  };
  const handleSaveSession = () => {
    if (!sessionForm.course || !sessionForm.days || !sessionForm.start_time || !sessionForm.end_time) {
      setSnackbar({ open: true, message: 'Please fill all fields.', severity: 'error' });
      return;
    }
    if (editSessionId) {
      setSessions(sessions.map(s => s.id === editSessionId ? { ...s, ...sessionForm, students: s.students } as Session : s));
      setSnackbar({ open: true, message: 'Session updated.', severity: 'success' });
    } else {
      setSessions([...sessions, { id: Date.now(), course: sessionForm.course as { id: number; name: string }, days: sessionForm.days as string, start_time: sessionForm.start_time as string, end_time: sessionForm.end_time as string, students: [], created_at: '', created_by: 0 }]);
      setSnackbar({ open: true, message: 'Session created.', severity: 'success' });
    }
    handleCloseSessionDialog();
  };
  const handleDeleteSession = (id: number) => {
    setSessions(sessions.filter(s => s.id !== id));
    setSnackbar({ open: true, message: 'Session deleted.', severity: 'success' });
  };

  // Material upload
  const handleMaterialFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'file' && e.target.files) {
      setMaterialForm({ ...materialForm, file: e.target.files[0] });
    } else {
      setMaterialForm({ ...materialForm, [e.target.name]: e.target.value });
    }
  };
  const handleUploadMaterial = () => {
    if (!materialForm.course || !materialForm.file) {
      setSnackbar({ open: true, message: 'Please select a course and file.', severity: 'error' });
      return;
    }
    const newMaterial: Material = {
      id: Date.now(),
      course: materialForm.course,
      fileName: materialForm.file.name,
      created_at: new Date().toISOString(),
      created_by: 0 // Replace with actual user ID if available
    };
    setMaterials([...materials, newMaterial]);
    setSnackbar({ open: true, message: 'Material uploaded.', severity: 'success' });
    setMaterialForm({ course: '', file: null });
    setOpenMaterialDialog(false);
  };

  // Calculate summary stats
  const totalCourses = courses.length;
  const totalStudents = Array.isArray(courses)
  ? courses.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0)
  : 0;
  const upcomingSessions = sessions.length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* <Typography variant="h4" fontWeight={700} gutterBottom align="center">
        Tutor dashboard
      </Typography>
      <Box sx={{ bgcolor: '#234', color: 'white', p: 2, borderRadius: 1, mb: 3, textAlign: 'center' }}>
        Welcome back! Manage your sessions and material below.
      </Box> */}
      
      {/* Dashboard Tab */}
      {activeTab === 0 && (
        <Box>
          
          <Box sx={{ display: 'flex', gap: 3, mb: 4, justifyContent: 'center' }}>
            <Card sx={{ minWidth: 200, bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Typography variant="h6" color="primary">Courses</Typography>
                <Typography variant="h4" fontWeight={700}>{totalCourses}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 200, bgcolor: '#e8f5e9' }}>
              <CardContent>
                <Typography variant="h6" color="success.main">Total Students</Typography>
                <Typography variant="h4" fontWeight={700}>{totalStudents || 0}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 200, bgcolor: '#fff3e0' }}>
              <CardContent>
                <Typography variant="h6" color="warning.main">Todays Sessions</Typography>
                <Typography variant="h4" fontWeight={700}>{upcomingSessions}</Typography>
              </CardContent>
            </Card>
          </Box>
          {/* Upcoming Sessions Table */}
          <Typography variant="h6" gutterBottom>Todays Session Schedules</Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  {/* <TableCell>Students</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.course.name}</TableCell>
                    <TableCell>{session.days}</TableCell>
                    <TableCell>{session.start_time} - {session.end_time}</TableCell>
                    {/* <TableCell>{session.students.join(', ')}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      {/* My Sessions Tab */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Session Schedule</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenSessionDialog()}>Add Session</Button>
          </Box>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course</TableCell>
                  <TableCell>Days</TableCell>
                  <TableCell>Time</TableCell>
                  {/* <TableCell>Students</TableCell> */}
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.course.name}</TableCell>
                    <TableCell>{session.days}</TableCell>
                    <TableCell>{session.start_time} - {session.end_time}</TableCell>
                    {/* <TableCell>{session.students.join(', ')}</TableCell> */}
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenSessionDialog(session)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDeleteSession(session.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Session Dialog */}
          <Dialog open={openSessionDialog} onClose={handleCloseSessionDialog}>
            <DialogTitle>{editSessionId ? 'Edit Session' : 'Add Session'}</DialogTitle>
            <DialogContent>
              <TextField
                select
                label="Course"
                name="course"
                value={sessionForm.course ? (typeof sessionForm.course === 'object' ? sessionForm.course.id : sessionForm.course) : ''}
                onChange={handleSessionFormChange}
                fullWidth
                margin="normal"
              >
                {courses.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Days"
                name="days"
                value={sessionForm.days || ''}
                onChange={handleSessionFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Start Time"
                name="start_time"
                type="time"
                value={sessionForm.start_time || ''}
                onChange={handleSessionFormChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Time"
                name="end_time"
                type="time"
                value={sessionForm.end_time || ''}
                onChange={handleSessionFormChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSessionDialog}>Cancel</Button>
              <Button variant="contained" onClick={handleSaveSession}>{editSessionId ? 'Save' : 'Add'}</Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
      {/* Upload Material Tab */}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>Upload Learning Material</Typography>
          <Box component="form" sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, mb: 3 }}>
            <TextField
              select
              label="Course Name"
              name="course"
              value={materialForm.course}
              onChange={handleMaterialFormChange}
              fullWidth
              margin="normal"
            >
              {courses.map((c) => (
                <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
              ))}
            </TextField>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{ mb: 2 }}
            >
              {materialForm.file ? materialForm.file.name : 'Select File'}
              <input
                type="file"
                name="file"
                hidden
                onChange={handleMaterialFormChange}
              />
            </Button>
            <Button variant="contained" onClick={handleUploadMaterial} sx={{ ml: 2 }}>
              Upload
            </Button>
          </Box>
          <Typography variant="subtitle1" gutterBottom>Uploaded Materials</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course</TableCell>
                  <TableCell>File Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materials.map((mat) => (
                  <TableRow key={mat.id}>
                    <TableCell>{mat.course}</TableCell>
                    <TableCell>{mat.fileName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <Typography variant="h5" gutterBottom>All Courses</Typography>
      {loading ? (
        <Typography>Loading courses...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3} mb={4}>
  {courses.map((course) => (
    <Grid item xs={12} md={4} key={course.id}>
      <Card elevation={2} sx={{ minHeight: 250 }}>
        {/* Image */}
        <CardMedia
          component="img"
          height="140"
          image={course.image || 'https://via.placeholder.com/300x140?text=Course+Image'}
          alt={course.name}
        />
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SchoolIcon color="primary" fontSize="large" />
          <Typography variant="h6" mt={2} mb={1} align="center">
            {course.name}
          </Typography>
          <Typography color="text.secondary" align="center" mb={1}>
            Number of Students: {course.enrolledStudents}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TutorDashboard; 