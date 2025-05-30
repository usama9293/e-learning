import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  Paper,
  Typography,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Stack,
  LinearProgress,
  Divider,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MessageIcon from '@mui/icons-material/Message';
import BookIcon from '@mui/icons-material/Book';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SendIcon from '@mui/icons-material/Send';

interface Course {
  id: string;
  title: string;
  image: string;
  tutor: string;
  progress: number;
  lastAccessed: string;
  description: string;
  level: string;
  duration: string;
  modules: Module[];
}

interface Module {
  id: string;
  title: string;
  type: 'video' | 'document' | 'assignment' | 'quiz';
  status: 'not_started' | 'in_progress' | 'completed';
  dueDate?: string;
  grade?: number;
}

const allCourses: Course[] = [
  {
    id: 'algebra',
    title: 'Algebra Fundamentals',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    tutor: 'Jane Smith',
    progress: 65,
    lastAccessed: '2024-03-15',
    description: 'Master the fundamentals of algebra including equations, functions, and graphs.',
    level: 'Intermediate',
    duration: '12 weeks',
    modules: [
      { id: 'm1', title: 'Introduction to Algebra', type: 'video', status: 'completed' },
      { id: 'm2', title: 'Linear Equations', type: 'document', status: 'completed' },
      { id: 'm3', title: 'Assignment 1: Basic Equations', type: 'assignment', status: 'in_progress', dueDate: '2024-03-20' },
      { id: 'm4', title: 'Quiz 1: Linear Functions', type: 'quiz', status: 'not_started', dueDate: '2024-03-25' },
    ],
  },
  {
    id: 'geometry',
    title: 'Geometry Essentials',
    image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80',
    tutor: 'John Doe',
    progress: 30,
    lastAccessed: '2024-03-14',
    description: 'Explore geometric concepts, proofs, and problem-solving techniques.',
    level: 'Beginner',
    duration: '10 weeks',
    modules: [
      { id: 'm1', title: 'Basic Geometric Shapes', type: 'video', status: 'completed' },
      { id: 'm2', title: 'Angles and Lines', type: 'document', status: 'in_progress' },
      { id: 'm3', title: 'Assignment 1: Shape Properties', type: 'assignment', status: 'not_started', dueDate: '2024-03-22' },
    ],
  },
];

const mockMessages = [
  { id: 1, sender: 'Jane Smith', content: 'Welcome to the course! Please check the syllabus.', timestamp: '2024-03-10 09:00' },
  { id: 2, sender: 'Jane Smith', content: 'Don\'t forget to submit Assignment 1 by Friday.', timestamp: '2024-03-12 14:30' },
  { id: 3, sender: 'You', content: 'I have a question about the quadratic equations.', timestamp: '2024-03-13 11:15' },
];

const LearningPlatform = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [selected, setSelected] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('enrolledCourses');
    if (stored) {
      const ids = JSON.parse(stored);
      setEnrolledCourses(allCourses.filter((c) => ids.includes(c.id)));
    } else {
      setEnrolledCourses([]);
    }
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send to the backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const getModuleIcon = (type: Module['type']) => {
    switch (type) {
      case 'video':
        return <VideoLibraryIcon />;
      case 'document':
        return <BookIcon />;
      case 'assignment':
        return <AssignmentIcon />;
      case 'quiz':
        return <AssignmentIcon />;
    }
  };

  const getStatusColor = (status: Module['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'not_started':
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Learning Management System
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/student/courses')}
          >
            Browse Courses
          </Button>
        </Box>

        {enrolledCourses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary" gutterBottom>
              You are not enrolled in any courses yet.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/student/courses')}
              sx={{ mt: 2 }}
            >
              Find Courses
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {enrolledCourses.map((course) => (
              <Grid item xs={12} md={6} key={course.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' },
                  }}
                  onClick={() => setSelected(course)}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={course.image}
                    alt={course.title}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {course.title}
                      </Typography>
                      <Chip label={course.level} size="small" color="primary" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {course.description}
                    </Typography>
                    <Typography variant="body2" color="primary" gutterBottom>
                      Tutor: {course.tutor}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Progress
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {course.progress}% Complete
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(course);
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/student/courses/${course.id}`);
                      }}
                    >
                      Continue Learning
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { minHeight: '80vh' } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={700}>
              {selected?.title}
            </Typography>
            <Chip label={selected?.level} color="primary" />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
          >
            <Tab label="Modules" />
            <Tab label="Messages" />
            <Tab label="Materials" />
          </Tabs>

          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Course Modules
              </Typography>
              <List>
                {selected?.modules.map((module) => (
                  <ListItem
                    key={module.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      mb: 1,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                    }}
                  >
                    {getModuleIcon(module.type)}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1">{module.title}</Typography>
                      {module.dueDate && (
                        <Typography variant="body2" color="text.secondary">
                          Due: {module.dueDate}
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      label={module.status.replace('_', ' ')}
                      color={getStatusColor(module.status)}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Messages
              </Typography>
              <List sx={{ mb: 2 }}>
                {mockMessages.map((message) => (
                  <ListItem
                    key={message.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: message.sender === 'You' ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        maxWidth: '80%',
                        bgcolor: message.sender === 'You' ? 'primary.light' : 'background.default',
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        {message.sender} • {message.timestamp}
                      </Typography>
                      <Typography>{message.content}</Typography>
                    </Paper>
                  </ListItem>
                ))}
              </List>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <IconButton color="primary" onClick={handleSendMessage}>
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Course Materials
              </Typography>
              <List>
                {selected?.modules.map((module) => (
                  <ListItem
                    key={module.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      mb: 1,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                    }}
                  >
                    {getModuleIcon(module.type)}
                    <Typography sx={{ flex: 1 }}>{module.title}</Typography>
                    <IconButton color="primary">
                      <DownloadIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setSelected(null);
              navigate(`/student/courses/${selected?.id}`);
            }}
          >
            Go to Course
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LearningPlatform; 