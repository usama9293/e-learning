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
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PaymentIcon from '@mui/icons-material/Payment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MessageIcon from '@mui/icons-material/Message';
import BookIcon from '@mui/icons-material/Book';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SendIcon from '@mui/icons-material/Send';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import api from '../../services/api'

import SessionTable from './SessionTable';
import truncateToWords from '../../utils/functs'
import {enrollInCourse} from '../../api/courses'

interface Course {
  id: number;
  name: string;
  description: string;
  image: string; 
  price: number;
  sessions: any[];
}

interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  name: string;
}

const steps = ['Course Details', 'Payment', 'Confirmation'];

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selected, setSelected] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });
  const navigate = useNavigate();

  const allCourses = async () => {
    try {
      const res = await api.get('/students/courses', {
        params: {
          all_courses: true
        }
      });
      setCourses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    allCourses();
  }, []);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEnrollSession = async (id: number) => {
    try {
      // First process payment
      const paymentResponse = await api.post('/payments/process', {
        courseId: id,
        amount: selected?.price || 0,
        paymentDetails
      });

      if (paymentResponse.data.success) {
        // If payment successful, proceed with enrollment
        const res = await enrollInCourse(id);
        console.log('enrolled');
        allCourses();
        setSelected(null);
        setActiveStep(0);
        setPaymentDetails({
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          name: '',
        });
      }
    } catch(error) {
      console.log(error);
    }
  };

  const handleEnrollClick = async (id) => {
    try{
      const res = await enrollInCourse(id);
      console.log('enrolled')
      allCourses()
      setSelected(null)
      enqueueSnackbar("Successfully Enrolled", { variant: 'success' });
    }catch(error){
      console.log(error);
    }
 
  };

  const renderPaymentStep = () => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Card Number"
          name="cardNumber"
          value={paymentDetails.cardNumber}
          onChange={handlePaymentChange}
          placeholder="1234 5678 9012 3456"
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Expiry Date"
            name="expiryDate"
            value={paymentDetails.expiryDate}
            onChange={handlePaymentChange}
            placeholder="MM/YY"
          />
          <TextField
            fullWidth
            label="CVV"
            name="cvv"
            value={paymentDetails.cvv}
            onChange={handlePaymentChange}
            placeholder="123"
          />
        </Box>
        <TextField
          fullWidth
          label="Name on Card"
          name="name"
          value={paymentDetails.name}
          onChange={handlePaymentChange}
          placeholder="John Doe"
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Total Amount:</Typography>
          <Typography variant="h6" color="primary">${selected?.price || 0}</Typography>
        </Box>
      </Stack>
    </Box>
  );

  const renderConfirmationStep = () => (
    <Box sx={{ mt: 2, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Confirm Enrollment
      </Typography>
      <Typography variant="body1" gutterBottom>
        You are about to enroll in {selected?.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Total Amount: ${selected?.price || 0}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Available Courses
          </Typography>
          
        </Box>

        {courses.length === 0 ? (
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
            {courses.map((course) => (
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
                    alt={course.name}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {course.name}
                      </Typography>
                      
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {truncateToWords(course.description, 20)}
                    </Typography>
                    
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary">
                        ${course.price || 0}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      <Dialog
        open={!!selected}
        onClose={() => {
          setSelected(null);
          setActiveStep(0);
          setPaymentDetails({
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            name: '',
          });
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { minHeight: '80vh' } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <img
              src={selected?.image ?? ""}
              alt={selected?.name ?? ""}
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
              }}
            />
            <Box>
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                {selected?.name ?? ""}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Description: {truncateToWords(selected?.description ?? "", 30)}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <SessionTable 
              sessions={selected?.sessions ?? []} 
              handleEnrollSession={() => handleNext()} 
            />
          )}
          
          {activeStep === 1 && renderPaymentStep()}
          
          {activeStep === 2 && renderConfirmationStep()}
        </DialogContent>
        <DialogActions>
          {activeStep > 0 && (
            <Button onClick={handleBack}>Back</Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button 
              variant="contained" 
              onClick={() => selected && handleEnrollClick(selected.id)}
              startIcon={<PaymentIcon />}
            >
              Complete Payment & Enroll
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleNext}
              disabled={activeStep === 1 && !paymentDetails.cardNumber}
            >
              {activeStep === 0 ? 'Proceed to Payment' : 'Review & Confirm'}
            </Button>
          )}
          <Button onClick={() => {
            setSelected(null);
            setActiveStep(0);
            setPaymentDetails({
              cardNumber: '',
              expiryDate: '',
              cvv: '',
              name: '',
            });
          }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Courses; 