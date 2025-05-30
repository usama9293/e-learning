import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Stack
} from '@mui/material';
import {
    fetchCourses,
    fetchMaterials,
    fetchAssignments,
    fetchStudents,
    fetchChats
  } from '../../api/tutor';
const TutorCourseDetail = () => {
  const { courseId } = useParams();
  const [tab, setTab] = useState(0);

  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  const [newMaterial, setNewMaterial] = useState('');
  const [newAssignment, setNewAssignment] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => setTab(newValue);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // const courseRes = await fetchCourses(courseId, { page: 1, per_page: 10, course_id: courseId });
        const materialsData = await fetchMaterials(Number(courseId), { page: 1, per_page: 10, course_id: Number(courseId) });
        const assignmentsData = await fetchAssignments(Number(courseId), { page: 1, per_page: 10, course_id: Number(courseId) });
        const studentsData = await fetchStudents(Number(courseId), { page: 1, per_page: 10, course_id: Number(courseId) });

        // setCourse(courseRes.data);
        setMaterials(materialsData.data);
        setAssignments(assignmentsData.data);
        setStudents(studentsData.data);
      } catch (err) {
        console.log(err);
        setError(err.detail || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);
      

  const handleAddMaterial = () => {
    if (!newMaterial) return;
    setMaterials(prev => [...prev, { id: Date.now(), title: newMaterial }]);
    setNewMaterial('');
    // Optionally POST to backend
  };

  const handleAddAssignment = () => {
    if (!newAssignment) return;
    setAssignments(prev => [...prev, { id: Date.now(), title: newAssignment }]);
    setNewAssignment('');
    // Optionally POST to backend
  };

  const handleSendMessage = () => {
    if (!messageText || !selectedStudent) return;
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      studentId: selectedStudent.id,
      content: messageText,
      from: 'tutor'
    }]);
    setMessageText('');
    // Optionally POST to backend
  };

  const renderMessagesForStudent = (studentId) => {
    return chatMessages
      .filter(m => m.studentId === studentId)
      .map(m => (
        <Box key={m.id} sx={{ mb: 1 }}>
          <Typography variant="body2" align={m.from === 'tutor' ? 'right' : 'left'}>
            <strong>{m.from === 'tutor' ? 'You' : selectedStudent.name}:</strong> {m.content}
          </Typography>
        </Box>
      ));
  };

  if (loading) return <Box p={3}><CircularProgress /></Box>;
  if (error) return <Box p={3}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>{course?.name || 'Course Details'}</Typography>

      <Tabs value={tab} onChange={handleTabChange} aria-label="course tabs">
        <Tab label="Materials" />
        <Tab label="Assignments" />
        <Tab label="Students & Chat" />
      </Tabs>

      <Box mt={3}>
        {tab === 0 && (
          <Box>
            <Typography variant="h6">📘 Materials</Typography>
            <List>
              {materials.map(m => (
                <ListItem key={m.id}><ListItemText primary={m.title} /></ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={2}>
              <TextField
                label="New Material Title"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddMaterial}>Add</Button>
            </Stack>
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Typography variant="h6">📝 Assignments</Typography>
            <List>
              {assignments.map(a => (
                <ListItem key={a.id}><ListItemText primary={a.title} /></ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={2}>
              <TextField
                label="New Assignment Title"
                value={newAssignment}
                onChange={(e) => setNewAssignment(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddAssignment}>Add</Button>
            </Stack>
          </Box>
        )}

        {tab === 2 && (
          <Box>
            <Typography variant="h6">👨‍🎓 Students</Typography>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Paper sx={{ width: '30%', maxHeight: 300, overflow: 'auto' }}>
                <List>
                  {students.map(s => (
                    <ListItem
                      key={s.id}
                      button
                      selected={selectedStudent?.id === s.id}
                      onClick={() => setSelectedStudent(s)}
                    >
                      <ListItemText primary={s.name} />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              <Paper sx={{ p: 2, flex: 1, minHeight: 300 }}>
                {selectedStudent ? (
                  <>
                    <Typography variant="subtitle1">Chat with {selectedStudent.name}</Typography>
                    <Box sx={{ mt: 2, maxHeight: 180, overflowY: 'auto', mb: 2 }}>
                      {renderMessagesForStudent(selectedStudent.id)}
                    </Box>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        fullWidth
                        placeholder="Type a message"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />
                      <Button variant="contained" onClick={handleSendMessage}>Send</Button>
                    </Stack>
                  </>
                ) : (
                  <Typography>Select a student to chat.</Typography>
                )}
              </Paper>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TutorCourseDetail;
