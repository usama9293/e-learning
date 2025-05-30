export interface UserRegistration {
  email: string;
  password: string;
  role: string;
  full_name: string;
  dob?: string;
  gender?: string;
  contact_number?: string;
  address?: string;
  grade_level?: string;
  emergency_contact?: string;
  parent_guardian?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    role: string;
  };
}

export type UserRole = 'student' | 'tutor' | 'admin';
