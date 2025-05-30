import { useState,useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  CardMedia,
  TableRow,
   TextField, List, ListItem, IconButton, Stack } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import Badge from '@mui/material/Badge';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import api from '../../services/api';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import CourseCard from '../../components/CourseCard';

// const mockCourses = [
//   { id: 1, title: 'Introduction to React', enrolledStudents: 25, averageProgress: 65, students: ['Alice Johnson', 'Bob Smith'] },
//   { id: 2, title: 'Advanced JavaScript', enrolledStudents: 15, averageProgress: 45, students: ['Charlie Brown'] },
// ];

const Courses = () => {
  
  const [openUpload, setOpenUpload] = useState<number | null>(null);
  const [openChat, setOpenChat] = useState<number | null>(null);
  const [openStudents, setOpenStudents] = useState<number | null>(null);
  const [assignment, setAssignment] = useState('');
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState<{ courseId: number; sender: string; text: string; }[]>([]);
  const [openPrivateChat, setOpenPrivateChat] = useState<{ courseId: number; student: string } | null>(null);
  const [privateMsg, setPrivateMsg] = useState('');
  const [privateMessages, setPrivateMessages] = useState<{ courseId: number; student: string; sender: string; text: string }[]>([]);
  const [unreadPrivate, setUnreadPrivate] = useState<{ [key: string]: number }>({});
  const [openMaterials, setOpenMaterials] = useState<number | null>(null);
  const [materials, setMaterials] = useState<{ courseId: number; name: string }[]>([]);
  const [newMaterial, setNewMaterial] = useState<{ name: string; file: File | null }>({ name: '', file: null });
  const [openAssignments, setOpenAssignments] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<{ courseId: number; name: string }[]>([]);
  const [newAssignment, setNewAssignment] = useState<{ name: string; file: File | null }>({ name: '', file: null });
  const [courses, setCourses] = useState<any[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

const handleCardClick = (courseId) => {
  navigate(`/materials/${courseId}`);
};

  const fetchCourses = async () => {
    try {
      const res = await api.get('/tutor/courses', {
        params: {
          page: page ,
          per_page: perPage,
          search,
          
        },
      });
     console.log(res.data)
      setCourses(res.data.items);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };
  useEffect(() => {
  
    fetchCourses();
    
 
  }, []);
  const handleUpload = (courseId: number) => {
    // Simulate upload
    setOpenUpload(null);
    setAssignment('');
  };
  const handleSendMsg = (courseId: number) => {
    if (chatMsg.trim()) {
      setMessages([...messages, { courseId, sender: 'Tutor', text: chatMsg }]);
      setChatMsg('');
    }
  };
 

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom align="center">
        My Courses
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} md={6} key={course.id}>
           <CourseCard course={course} setOpenAssignments={setOpenAssignments} setOpenChat={setOpenChat} setOpenStudents={setOpenStudents} handleCardClick={handleCardClick} />
            {/* Chat Dialog */}
            <Dialog open={openChat === course.id} onClose={() => setOpenChat(null)} maxWidth="sm" fullWidth>
              <DialogTitle>Chat with Students - {course.name}</DialogTitle>
              <DialogContent>
                <List sx={{ minHeight: 120, maxHeight: 200, overflowY: 'auto' }}>
                  {messages.filter(m => m.courseId === course.id).map((m, i) => (
                    <ListItem key={i} sx={{ justifyContent: m.sender === 'Tutor' ? 'flex-end' : 'flex-start' }}>
                      <Box sx={{ bgcolor: m.sender === 'Tutor' ? 'primary.light' : 'grey.200', p: 1.5, borderRadius: 2 }}>
                        <Typography variant="body2"><b>{m.sender}:</b> {m.text}</Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={chatMsg}
                    onChange={e => setChatMsg(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSendMsg(course.id); }}
                  />
                  <Button variant="contained" onClick={() => handleSendMsg(course.id)}>Send</Button>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenChat(null)} >Close</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openStudents === course.id} onClose={() => setOpenStudents(null) }fullWidth
  maxWidth="md" >
            <DialogTitle>Enrolled Students - {course.title}</DialogTitle>
            <DialogContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {course.enrolled? (
                    course.students.map((student) => {
                      const key = `${course.id}-${student.id}`;
                      const unread = unreadPrivate[key] || 0;
                      return (
                        <TableRow key={student.id}>
                          <TableCell>{student.id}</TableCell>
                          <TableCell>{student.full_name}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              onClick={() => {
                                setOpenPrivateChat({ courseId: course.id, student });
                                setUnreadPrivate({ ...unreadPrivate, [key]: 0 });
                              }}
                            >
                              <Badge color="error" badgeContent={unread} invisible={unread === 0}>
                                <ChatIcon />
                              </Badge>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No students enrolled.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenStudents(null)}>Close</Button>
            </DialogActions>
          </Dialog>
            {/* 1-on-1 Private Chat Dialog */}
            <Dialog open={!!openPrivateChat} onClose={() => setOpenPrivateChat(null)} maxWidth="sm" fullWidth>
              <DialogTitle>Chat with {openPrivateChat?.student} - {courses.find(c => c.id === openPrivateChat?.courseId)?.title}</DialogTitle>
              <DialogContent>
                <List sx={{ minHeight: 120, maxHeight: 200, overflowY: 'auto' }}>
                  {privateMessages.filter(m => m.courseId === openPrivateChat?.courseId && m.student === openPrivateChat?.student).map((m, i) => (
                    <ListItem key={i} sx={{ justifyContent: m.sender === 'Tutor' ? 'flex-end' : 'flex-start' }}>
                      <Box sx={{ bgcolor: m.sender === 'Tutor' ? 'primary.light' : 'grey.200', p: 1.5, borderRadius: 2 }}>
                        <Typography variant="body2"><b>{m.sender}:</b> {m.text}</Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={privateMsg}
                    onChange={e => setPrivateMsg(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && openPrivateChat) {
                      setPrivateMessages([...privateMessages, { courseId: openPrivateChat.courseId, student: openPrivateChat.student, sender: 'Tutor', text: privateMsg }]);
                      setPrivateMsg('');
                    }}}
                  />
                  <Button variant="contained" onClick={() => {
                    if (openPrivateChat && privateMsg.trim()) {
                      setPrivateMessages([...privateMessages, { courseId: openPrivateChat.courseId, student: openPrivateChat.student, sender: 'Tutor', text: privateMsg }]);
                      setPrivateMsg('');
                    }
                  }}>Send</Button>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenPrivateChat(null)}>Close</Button>
              </DialogActions>
            </Dialog>
            {/* Materials Dialog */}
            <Dialog open={openMaterials === course.id} onClose={() => setOpenMaterials(null)} maxWidth="sm" fullWidth>
              <DialogTitle>Materials for {course.title}</DialogTitle>
              <DialogContent>
                <List>
                  {materials.filter(m => m.courseId === course.id).map((mat, i) => (
                    <ListItem key={i} secondaryAction={
                      <IconButton edge="end" color="error" onClick={() => setMaterials(materials.filter((m, idx) => !(idx === i && m.courseId === course.id)))}>
                        <DeleteIcon />
                      </IconButton>
                    }>
                      {mat.name}
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Material Name"
                    value={newMaterial.name}
                    onChange={e => setNewMaterial({ ...newMaterial, name: e.target.value })}
                    fullWidth
                    margin="normal"
                  />
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    sx={{ mb: 2 }}
                  >
                    {newMaterial.file ? newMaterial.file.name : 'Select File'}
                    <input
                      type="file"
                      hidden
                      onChange={e => setNewMaterial({ ...newMaterial, file: e.target.files ? e.target.files[0] : null })}
                    />
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (newMaterial.name && newMaterial.file) {
                        setMaterials([...materials, { courseId: course.id, name: newMaterial.name }]);
                        setNewMaterial({ name: '', file: null });
                      }
                    }}
                    sx={{ ml: 2 }}
                  >
                    Upload
                  </Button>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenMaterials(null)}>Close</Button>
              </DialogActions>
            </Dialog>
            {/* Assignments Dialog */}
            <Dialog open={openAssignments === course.id} onClose={() => setOpenAssignments(null)} maxWidth="md" fullWidth>
              <DialogTitle>Assignments for {course.title}</DialogTitle>
              <DialogContent>
                <List>
                  {assignments.filter(a => a.courseId === course.id).map((a, i) => (
                    <ListItem key={i} secondaryAction={
                      <IconButton edge="end" color="error" onClick={() => setAssignments(assignments.filter((m, idx) => !(idx === i && m.courseId === course.id)))}>
                        <DeleteIcon />
                      </IconButton>
                    }>
                      {a.name}
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Assignment Name"
                    value={newAssignment.name}
                    onChange={e => setNewAssignment({ ...newAssignment, name: e.target.value })}
                    fullWidth
                    margin="normal"
                  />
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    sx={{ mb: 2 }}
                  >
                    {newAssignment.file ? newAssignment.file.name : 'Select File'}
                    <input
                      type="file"
                      hidden
                      onChange={e => setNewAssignment({ ...newAssignment, file: e.target.files ? e.target.files[0] : null })}
                    />
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (newAssignment.name && newAssignment.file) {
                        setAssignments([...assignments, { courseId: course.id, name: newAssignment.name }]);
                        setNewAssignment({ name: '', file: null });
                      }
                    }}
                    sx={{ ml: 2 }}
                  >
                    Upload
                  </Button>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenAssignments(null)}>Close</Button>
              </DialogActions>
            </Dialog>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Courses; 