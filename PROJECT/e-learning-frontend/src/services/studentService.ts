import api from './api';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface ParentGuardian {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface StudentRegistration {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  email: string;
  homeAddress: string;
  gradeLevel: string;
  emergencyContact: EmergencyContact;
  parentGuardian: ParentGuardian;
}

export const studentService = {
  register: async (data: StudentRegistration) => {
    const response = await api.post('/students/register', {
      full_name: data.fullName,
      date_of_birth: data.dateOfBirth,
      gender: data.gender,
      contact_number: data.contactNumber,
      email: data.email,
      home_address: data.homeAddress,
      grade_level: data.gradeLevel,
      emergency_contact: {
        name: data.emergencyContact.name,
        relationship: data.emergencyContact.relationship,
        phone: data.emergencyContact.phone,
      },
      parent_guardian: {
        name: data.parentGuardian.name,
        relationship: data.parentGuardian.relationship,
        phone: data.parentGuardian.phone,
        email: data.parentGuardian.email,
      },
    });
    return response.data;
  },
}; 