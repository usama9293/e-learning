import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Box, Button, Card, CardContent, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, List, ListItem, Paper, TextField, Typography } from '@mui/material';
import api from '../../services/api';

const allCourses = [
  {
    id: 'algebra',
    title: 'Algebra Fundamentals',
    tutor: 'Jane Smith',
    description: 'Master the basics of algebra, including equations, inequalities, and graphing.',
  },
  {
    id: 'geometry',
    title: 'Geometry Essentials',
    tutor: 'John Doe',
    description: 'Explore the world of shapes, theorems, and geometric proofs.',
  },
  {
    id: 'trigonometry',
    title: 'Trigonometry Basics',
    tutor: 'Emily Johnson',
    description: 'Learn about angles, sine, cosine, tangent, and their applications.',
  },
  {
    id: 'calculus',
    title: 'Introduction to Calculus',
    tutor: 'Michael Lee',
    description: 'Start your journey into limits, derivatives, and integrals.',
  },
];

const mockAssignments = [
  { title: 'Assignment 1: Linear Equations', instructions: 'Solve the attached set of linear equations and upload your solutions as a PDF.', submitted: false, submission: null },
  { title: 'Assignment 2: Quadratic Functions', instructions: 'Complete the worksheet on quadratic functions. You may submit a link or upload your file.', submitted: true, submission: 'worksheet.pdf' },
];
const mockMaterials = [
  { name: 'Lecture Notes Week 1.pdf', url: '#' },
  { name: 'Practice Problems Set 1.pdf', url: '#' },
  { name: 'Video: Introduction to Algebra.mp4', url: '#' },
];
const mockChats = [
  { from: 'tutor', text: 'Welcome to the course!' },
  { from: 'student', text: 'Thank you!' },
  { from: 'tutor', text: 'Let me know if you have any questions.' },
];

const CourseDetails = () => {
  const { id } = useParams();
  const course = allCourses.find((c) => c.id === id);
  const [assignments, setAssignments] = useState(mockAssignments);
  const [chats, setChats] = useState(mockChats);
  const [chatInput, setChatInput] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<null | number>(null);
  const [submission, setSubmission] = useState('');
  const [file, setFile] = useState<File | null>(null);

  if (!course) return <Container><Typography>Course not found.</Typography></Container>;

  const handleOpenAssignment = (idx: number) => {
    setSelectedAssignment(idx);
    setSubmission('');
    setFile(null);
  };
  const handleCloseAssignment = () => setSelectedAssignment(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  const handleSubmitAssignment = async () => {
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      formData.append('content', submission);
      
      const response = await api.post(`/assignments/${selectedAssignment}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAssignments((prev) => prev.map((a, i) =>
        i === selectedAssignment ? { ...a, submitted: true, submission: file ? file.name : submission } : a
      ));
      setSelectedAssignment(null);
      setFile(null);
      setSubmission('');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      // You might want to show an error message to the user here
    }
  };
  const handleSendChat = () => {
    if (chatInput.trim()) {
      setChats((prev) => [...prev, { from: 'student', text: chatInput }]);
      setChatInput('');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {course.title}
      </Typography>
      <Typography variant="subtitle1" color="primary" gutterBottom>
        Tutor: {course.tutor}
      </Typography>
      <Typography variant="body1" mb={3}>{course.description}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Assignments</Typography>
            <List>
              {assignments.map((a, i) => (
                <ListItem key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleOpenAssignment(i)}>
                  <span>{a.title}</span>
                  {a.submitted ? (
                    <Button size="small" variant="contained" color="success" disabled>Submitted</Button>
                  ) : (
                    <Button size="small" variant="outlined">View</Button>
                  )}
                </ListItem>
              ))}
            </List>
          </Paper>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Materials</Typography>
            <List>
              {mockMaterials.map((m, i) => (
                <ListItem key={i}>
                  <a href={m.url} download>{m.name}</a>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Chat with Tutor</Typography>
            <Box sx={{ flex: 1, mb: 2, maxHeight: 250, overflowY: 'auto', bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
              {chats.map((c, i) => (
                <Box key={i} sx={{ textAlign: c.from === 'student' ? 'right' : 'left', mb: 1 }}>
                  <Typography variant="body2" sx={{ display: 'inline-block', bgcolor: c.from === 'student' ? '#1976d2' : '#e0e0e0', color: c.from === 'student' ? 'white' : 'black', px: 2, py: 1, borderRadius: 2 }}>
                    {c.text}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type a message..."
                size="small"
                fullWidth
              />
              <Button variant="contained" onClick={handleSendChat} disabled={!chatInput.trim()}>
                Send
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={selectedAssignment !== null} onClose={handleCloseAssignment} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedAssignment !== null ? assignments[selectedAssignment].title : ''}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Instructions
          </Typography>
          <Typography variant="body2" mb={2}>
            {selectedAssignment !== null ? assignments[selectedAssignment].instructions : ''}
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Submit your work
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" component="label">
              Upload File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {file && <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>{file.name}</Typography>}
          </Box>
          <TextField
            label="Or paste a link or text"
            value={submission}
            onChange={e => setSubmission(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignment}>Cancel</Button>
          <Button onClick={handleSubmitAssignment} variant="contained" disabled={!(file || submission.trim())}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseDetails; 