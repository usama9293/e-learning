import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const cardTypes = ['Visa', 'MasterCard', 'American Express', 'Discover'];

const Payment = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    cardType: '',
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ cardType: '', cardHolder: '', cardNumber: '', expiry: '', cvv: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = Object.values(form).every((v) => v.trim() !== '');

  const handleAdd = () => {
    // TODO: Save payment method
    alert('Payment method added! (Demo only)');
    handleClose();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={500}>Payment Methods</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
              Add Payment Method
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={500}>Payment History</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>Add Payment Method</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              select
              label="Card Type"
              name="cardType"
              value={form.cardType}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {cardTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Card Holder Name"
              name="cardHolder"
              value={form.cardHolder}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Card Number"
              name="cardNumber"
              value={form.cardNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Expiry Date"
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  placeholder="MM/YY"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="CVV"
                  name="cvv"
                  value={form.cvv}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={!isFormValid}>
            Add Payment Method
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Payment; 