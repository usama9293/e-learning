import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack
} from "@mui/material";

const EditMaterialDialog = ({ open, handleClose, material, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (material) {
      setTitle(material.name || "");
      setDescription(material.description || "");
      setFile(null);
    }
  }, [material]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", title);
    formData.append("description", description);
    formData.append("session_id", material.session_id); // or other session ID
    if (file) formData.append("file", file);

    try {
      await fetch(`/api/materials/${material.id}`, {
        method: "PUT", // or POST if needed
        body: formData,
      });
      onSave(); // Refresh parent
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update material");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Material</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.zip,.rar,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMaterialDialog;
