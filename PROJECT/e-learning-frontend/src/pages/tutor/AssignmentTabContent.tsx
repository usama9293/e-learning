import { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Stack,
  Typography,
  Button,
  CardContent,
  Card
} from '@mui/material';
import EditMaterialDialog from './EditMaterialDialog.tsx';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import AddIcon from '@mui/icons-material/Add';
import api from '../../services/api';

const AssignmentTabContent = ({ selectedCourse }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [materialFile, setMaterialFile] = useState(null);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const handleOpenUploadDialog = () => setOpenUploadDialog(true);
  const [editMaterial, setEditMaterial] = useState(null);
const [openEditDialog, setOpenEditDialog] = useState(false);

const handleEdit = (item) => {
  setEditMaterial(item);
  setOpenEditDialog(true);
};

const handleEditSave = () => {
  // fetchMaterials(); // or update state
};
const handleCloseUploadDialog = () => {
  setOpenUploadDialog(false);
  setMaterialName('');
  setMaterialFile(null);
};
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
const fetchAssignments = async () => {
  if (!selectedCourse || !selectedCourse.id) return;

  setLoading(true);
  try {
    const res = await api.get(`/assignments/${selectedCourse.id}`);
    setMaterials(res.data);
    setError('');
  } catch (err) {
    setError('Failed to load materials');
  } finally {
    setLoading(false);
  }
};


const handleFileChange = (event) => {
  setMaterialFile(event.target.files[0]);
};

const handleSubmit = async () => {
  if (!title || !materialFile || !selectedCourse) return;
  
  const formData = new FormData();
  formData.append('name', title);
  formData.append('file', materialFile);
  formData.append('description',description)
  formData.append('session_id', selectedCourse.id);

  try {
   
    await api.post('/materials/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    fetchAssignments(); // refresh material list
    handleCloseUploadDialog();
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/assignments/${selectedCourse}`);
        setMaterials(response.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    if (selectedCourse) {
      fetchData();
    }
  }, [selectedCourse]);

  const handleUpload = async () => {
    if (!materialName || !materialFile || !selectedCourse?.id) return;

    const formData = new FormData();
    formData.append('name', materialName);
    formData.append('file', materialFile);
    formData.append('course_id', selectedCourse.id);

    try {
      await api.post('/materials/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMaterialName('');
      setMaterialFile(null);
      const res = await api.get(`/materials/${selectedCourse.id}`);
      setMaterials(res.data);
    } catch (err) {
      setError('Upload failed');
    }
  };
 
  
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      try {
        await api.delete(`/assignments/${id}`);
        // refresh list
        fetchAssignments(); // or filter it out from state
      } catch (err) {
        console.error(err);
        alert("Failed to delete assignment.");
      }
    }
  };
  

  

  return (
    <div className="space-y-4">
      {loading && <p>Loading materials...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {materials.length === 0 ? (
        <Stack><p>No materials found for this course.</p>
        <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenUploadDialog}
        disabled={!selectedCourse}
      >
        Add
      </Button>
      </Stack>
      ) : (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={2} sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h4" fontWeight={700}>
                Course Assignments
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
            <EditMaterialDialog
            open={openEditDialog}
            handleClose={() => setOpenEditDialog(false)}
            material={editMaterial}
            onSave={handleEditSave}
          />
            <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} fullWidth maxWidth="sm">
  <DialogTitle>
    Add Assignment for {selectedCourse.course.name }
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
      label="Material Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      margin="normal"
    />
    <TextField
      fullWidth
      label="Material Description"
      value={description}
      multiline
      rows={4}
      onChange={handleDescriptionChange}
      error={Boolean(descriptionError)}
      helperText={descriptionError}
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
          {materials.map((item) => (
              <Card key={item.id} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {item.title}
                </Typography>
            
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.description || 'No description provided.'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Points: {item.total_points}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Due Date: {new Date(item.due_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                </Typography>
            
                {/* Optional: Preview File Link */}
                {item.file_path && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                      View File
                    </a>
                  </Typography>
                )}
            
                {/* Buttons */}
                <Stack direction="row" spacing={2}>
                  {/* <Button
                    variant="outlined"
                    color="primary"
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    Download
                  </Button>
             */}
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleEdit(item)}
                  >
                    Update
                  </Button>
            
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
            
            ))}
          </Paper>
        </Container>
      )}
    </div>
  );
};

export default AssignmentTabContent;
