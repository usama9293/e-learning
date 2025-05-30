import { useState } from 'react';
import { Container, Typography, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const mockUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'student' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'tutor' },
  { id: 3, name: 'Carol Lee', email: 'carol@example.com', role: 'admin' },
  { id: 4, name: 'David Kim', email: 'david@example.com', role: 'student' },
  { id: 5, name: 'Eva Green', email: 'eva@example.com', role: 'tutor' },
];

const initialCourses = [
  { id: 1, name: 'Algebra Basics', tutor: 'Bob Smith', schedule: '2024-06-10', time: '10:00' },
  { id: 2, name: 'Geometry Essentials', tutor: 'Eva Green', schedule: '2024-06-15', time: '14:00' },
];

const UserManagement = () => {
  const [tab, setTab] = useState(0);
  const [courses, setCourses] = useState(initialCourses);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [courseForm, setCourseForm] = useState({ name: '', tutor: '', schedule: '', time: '' });
  const roles = ['student', 'tutor', 'courses'];
  const filteredUsers = mockUsers.filter(u => u.role === roles[tab]);
  const tutors = mockUsers.filter(u => u.role === 'tutor');

  const handleAddCourse = () => {
    if (courseForm.name && courseForm.tutor && courseForm.schedule && courseForm.time) {
      setCourses([...courses, { id: Date.now(), ...courseForm }]);
      setCourseForm({ name: '', tutor: '', schedule: '', time: '' });
      setOpenCourseDialog(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>User Management</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Students" />
        <Tab label="Tutors" />
        <Tab label="Courses" />
      </Tabs>
      {tab < 2 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary"><EditIcon /></IconButton>
                      <IconButton color="error"><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <Box sx={{ mt: 2 }}>
            <Button variant="contained">Add New {roles[tab].charAt(0).toUpperCase() + roles[tab].slice(1)}</Button>
          </Box> */}
        </>
      ) : (
        <>
         <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => setOpenCourseDialog(true)}>Add Course</Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course Name</TableCell>
                  <TableCell>Assigned Tutor</TableCell>
                  <TableCell>Schedule</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.tutor}</TableCell>
                    <TableCell>{course.schedule}</TableCell>
                    <TableCell>{course.time}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary"><EditIcon /></IconButton>
                      <IconButton color="error"><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
         
          <Dialog open={openCourseDialog} onClose={() => setOpenCourseDialog(false)}>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogContent>
              <TextField
                label="Course Name"
                value={courseForm.name}
                onChange={e => setCourseForm({ ...courseForm, name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                select
                label="Assign Tutor"
                value={courseForm.tutor}
                onChange={e => setCourseForm({ ...courseForm, tutor: e.target.value })}
                fullWidth
                margin="normal"
              >
                {tutors.map(t => (
                  <MenuItem key={t.id} value={t.name}>{t.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Schedule Date"
                type="date"
                value={courseForm.schedule}
                onChange={e => setCourseForm({ ...courseForm, schedule: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Time"
                type="time"
                value={courseForm.time}
                onChange={e => setCourseForm({ ...courseForm, time: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCourseDialog(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleAddCourse}>Add Course</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default UserManagement; 