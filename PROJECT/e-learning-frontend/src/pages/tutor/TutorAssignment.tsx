import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, FormControl,
  InputLabel, Select, MenuItem, CircularProgress,
  List, ListItem, ListItemText, Link, Box, Button,
  DialogContent,
  DialogActions,
  Dialog,
  DialogTitle,
  IconButton,
 TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../services/api'; // adjust path as needed

const TutorAssignment = () => {
  const [sessions, setSessions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSession, setselectedSession] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [loading, setLoading] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [materialFile, setMaterialFile] = useState(null);
  const [due_date, setDueDate] = useState(null);
  const [points, setPoints] = useState<number>(0);
  const [descriptionError, setDescriptionError] = useState('');

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

    setDescription(value);
    if (wordCount < 10) {
      setDescriptionError('Description must be at least 10 words.');
    } else {
      setDescriptionError('');
    }
  };
   
  const handleOpenUploadDialog = () => setOpenUploadDialog(true);
const handleCloseUploadDialog = () => {
  setOpenUploadDialog(false);
  setMaterialFile(null);
};
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    setMaterialFile(e.target.files[0]);
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('due_date', due_date);
  formData.append('total_points', points.toString());
  if (materialFile) {
    formData.append('file', materialFile);
  }
  formData.append('session_id', selectedSession);

  try {
    console.log(formData)
    try {
      const res = await api.post('/assignments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  
    // fetchAssignments(selectedSession); // refresh material list
    handleCloseUploadDialog();
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
  // Fetch tutor's courses on mount
  useEffect(() => {
    console.log('called')
    const fetchSessions = async () => {
      console.log('enetered')
      try {
        console.log('trying')
        const res = await api.get('/tutor/sessions');
        
        const items = res.data.items || [];
        console.log(items)
        setSessions(items);

        // Auto-select first course if available
        if (items.length > 0) {
          setselectedSession(items[0].id);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchSessions();
  }, []);

  // Fetch assignments + students when course changes
  useEffect(() => {
    if (!selectedSession) return;

    const fetchAssignments = async () => {
      try {
        const res = await api.get(`/assignments/${selectedSession}`);
        const data = res.data || [];
        setAssignments(data);

        // Optional: auto-select first assignment
        if (data.length > 0) {
          setSelectedAssignment(data[0].id);
        } else {
          setSelectedAssignment('');
        }
      } catch (err) {
        console.error('Error fetching assignments:', err);
      }
    };

    const fetchStudents = async () => {
      try {
        const res = await api.get(`/courses/${selectedSession}/students`);
        setStudents(res.data || []);
      } catch (err) {
        console.error('Error fetching students:', err);
      }
    };

    fetchAssignments();
    fetchStudents();
  }, [selectedSession]);

  // Fetch submissions for selected assignment
  useEffect(() => {
    if (!selectedAssignment) return;

    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/assignments/${selectedAssignment}/submissions`);
        setSubmissions(res.data || []);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [selectedAssignment]);

  const getStudentSubmission = (studentId) => {
    return submissions.find((s) => s.student_id === studentId);
  };

  const handleAddMaterial = () => {
    // Redirect to material upload form or open modal
    alert('Add Material functionality goes here.');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={600}>
            Assignment Submissions
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenUploadDialog}
            disabled={!selectedSession}
          >
            Add Assignment
          </Button>
        </Box>

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Select Course</InputLabel>
          <Select
            value={selectedSession}
            label="Select Course"
            onChange={(e) => {
              setselectedSession(e.target.value);
              setSelectedAssignment('');
              setSubmissions([]);
            }}
          >
            {sessions.map((session) => (
              <MenuItem key={session.id} value={session.id}>
                {session.course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedSession && (
          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Select Assignment</InputLabel>
            <Select
              value={selectedAssignment}
              label="Select Assignment"
              onChange={(e) => setSelectedAssignment(e.target.value)}
            >
              {assignments.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (students.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">
              Student Submissions {selectedAssignment ? '' : '(No assignment selected)'}
            </Typography>
            <List>
              {students.map((student) => {
                const submission = selectedAssignment ? getStudentSubmission(student.id) : null;
                return (
                  <ListItem key={student.id} divider>
                    <ListItemText
                      primary={student.name}
                      secondary={
                        selectedAssignment
                          ? submission
                            ? `Submitted on ${new Date(submission.submitted_at).toLocaleString()}`
                            : 'No submission'
                          : 'Waiting for assignment...'
                      }
                    />
                    {submission && (
                      <Link
                        href={submission.file_url}
                        target="_blank"
                        rel="noopener"
                        download
                      >
                        View File
                      </Link>
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))
        }
      </Paper>
      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} fullWidth maxWidth="sm">
  <DialogTitle>
    Assignment for {selectedSession ? sessions.find(c => c.id === selectedSession)?.course.name : ''}
    <IconButton
      aria-label="close"
      onClick={handleCloseUploadDialog}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: (theme) => theme.palette.grey[500],
      }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent dividers>
    
    <TextField
      fullWidth
      label="Assignment Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      margin="normal"
    />
    <TextField
      fullWidth
      label="Assignment Description"
      value={description}
      multiline
      rows={4}
      onChange={handleDescriptionChange}
      error={Boolean(descriptionError)}
      helperText={descriptionError}
      margin="normal"
    />
    <TextField
      fullWidth
      label="Assignment Due Date"
      value={due_date}
      type="date"
      onChange={(e) => setDueDate(e.target.value)}
      margin="normal"
    />
    <TextField
      label="Points"
      type="number"
      value={points}
      onChange={(e) => setPoints(Number(e.target.value))}
      fullWidth
      margin="normal"
    />
    <Button
      variant="outlined"
      component="label"
      sx={{ mr: 2 }}
      startIcon={<AddIcon />}
    >
      Select File
      <input type="file" hidden onChange={handleFileChange} />
    </Button>
    {materialFile && <span>{materialFile.name}</span>}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseUploadDialog}>Close</Button>
    <Button variant="contained" onClick={handleSubmit} disabled={!title || !materialFile}>
      Upload
    </Button>
  </DialogActions>
  </Dialog>
    </Container>
  );
};

export default TutorAssignment;
