import * as yup from 'yup';

export const studentRegistrationSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  dateOfBirth: yup
    .string()
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      'Date must be in YYYY-MM-DD format'
    )
    .required('Date of birth is required'),
  gender: yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
  contactNumber: yup.string().required('Contact number is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  homeAddress: yup.string().required('Home address is required'),
  gradeLevel: yup.string().required('Grade level is required'),
  emergencyContact: yup.object({
    name: yup.string().required('Emergency contact name is required'),
    relationship: yup.string().required('Relationship is required'),
    phone: yup.string().required('Emergency contact phone is required'),
  }),
  parentGuardian: yup.object({
    name: yup.string().required('Parent/Guardian name is required'),
    relationship: yup.string().required('Relationship is required'),
    phone: yup.string().required('Parent/Guardian phone is required'),
    email: yup.string().email('Enter a valid email').required('Parent/Guardian email is required'),
  }),
}); 