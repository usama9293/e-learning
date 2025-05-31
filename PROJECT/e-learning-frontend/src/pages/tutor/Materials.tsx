import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Typography, Paper, Box,
  List, ListItem, ListItemText, Link,
  CircularProgress, FormControl, InputLabel, Select, MenuItem,
  Button, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../../services/api';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Materials = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerpage] = useState(10);
  const [search, setSearch] = useState("");
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [materialName, setMaterialName] = useState('');
  const [materialFile, setMaterialFile] = useState(null);

  const handleOpenUploadDialog = () => setOpenUploadDialog(true);
const handleCloseUploadDialog = () => {
  setOpenUploadDialog(false);
  setMaterialName('');
  setMaterialFile(null);
};

const handleFileChange = (event) => {
  setMaterialFile(event.target.files[0]);
};

const handleSubmit = async () => {
  if (!materialName || !materialFile || !selectedCourse) return;

  const formData = new FormData();
  formData.append('name', materialName);
  formData.append('file', materialFile);
  formData.append('course_id', selectedCourse);

  try {
    console.log(formData)
    await api.post('/materials/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    fetchMaterials(selectedCourse); // refresh material list
    handleCloseUploadDialog();
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

  const fetchCourses = async () => {
    try {
      const res = await api.get('/tutor/courses', {
        params: { page, per_page: perPage, search },
      });
      const courseList = res.data.items;
      setCourses(courseList);

      // Auto-select first course if available
      if (courseList.length > 0) {
        setSelectedCourse(courseList[0].id);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchMaterials = async (courseId) => {
    setLoading(true);
    try {
      const res = await api.get(`/materials/${courseId}`, {
        params: { page, per_page: perPage, search },
      });
      setMaterials(res.data);
    } catch (err) {
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };
  const { courseId } = useParams();

useEffect(() => {
  fetchCourses();
}, []);

useEffect(() => {
  if (courseId) {
    setSelectedCourse(courseId.toString());
  }
}, [courseId]);

useEffect(() => {
  if (selectedCourse) {
    fetchMaterials(selectedCourse);
  } else {
    setMaterials([]);
  }
}, [selectedCourse]);


 

  useEffect(() => {
    if (selectedCourse) {
      fetchMaterials(selectedCourse);
    } else {
      setMaterials([]);
    }
  }, [selectedCourse]);

  const handleAddMaterial = () => {
    if (!selectedCourse) return;
    // Your logic to add material (e.g., open a dialog or navigate to a form)
    console.log('Add material for course:', selectedCourse);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight={700}>
            My Materials
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenUploadDialog}
            disabled={!selectedCourse}
          >
            Add
          </Button>
        </Stack>
        <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} fullWidth maxWidth="sm">
  <DialogTitle>
    Materials for {selectedCourse ? courses.find(c => c.id === selectedCourse)?.name : ''}
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
      label="Material Name"
      value={materialName}
      onChange={(e) => setMaterialName(e.target.value)}
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
    <Button variant="contained" onClick={handleSubmit} disabled={!materialName || !materialFile}>
      Upload
    </Button>
  </DialogActions>
</Dialog>


        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Select Course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            label="Select Course"
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : selectedCourse && materials.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 3 }}>
            No materials found for this course.
          </Typography>
        ) : (
          <List sx={{ mt: 3 }}>
            {materials.map((material) => (
              <ListItem key={material.id} divider>
                <ListItemText
                  primary={material.name}
                  secondary={`Course ID: ${material.course_id}`}
                />
                <Link href={material.file_path} target="_blank" rel="noopener" download>
                  Download
                </Link>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Materials;
