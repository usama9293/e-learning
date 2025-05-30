import { Link as RouterLink } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box, Stack, Button } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const CourseCard = ({ course, setOpenAssignments, setOpenChat, setOpenStudents, handleCardClick }) => {
  return (
    <Card
      component={RouterLink}
      to={`/tutor/courses/${course.id}`}
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        position: 'relative',
        '&:hover': { boxShadow: 6 },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={course.image || 'https://via.placeholder.com/300x140?text=Course+Image'}
        alt={course.name}
        sx={{ objectFit: 'fill' }}
      />
      <CardContent>
        <Typography variant="h6">{course.name}</Typography>
        <Box sx={{ mt: 2 }}>
          <Typography color="textSecondary">
            Enrolled Students: {course.enrolled}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button
            component="div"
            startIcon={<AssignmentIcon />}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenAssignments(course.id); }}
            variant="outlined"
            size="small"
          >
            Assignments
          </Button>
          <Button
            component="div"
            startIcon={<ChatIcon />}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenChat(course.id); }}
            variant="outlined"
            size="small"
          >
            Chat
          </Button>
          <Button
            component="div"
            startIcon={<GroupIcon />}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenStudents(course.id); }}
            variant="outlined"
            size="small"
          >
            View Students
          </Button>
          <Button
            component="div"
            startIcon={<UploadFileIcon />}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCardClick(course.id); }}
            variant="outlined"
            size="small"
          >
            Materials
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
