import { AUTH_ENDPOINTS, apiRequest } from '../config/api';
import { UserRegistration, LoginCredentials, AuthResponse } from '../types/auth';

export const authService = {
  register: async (payload: UserRegistration): Promise<AuthResponse> => {
    try {
      console.log('Attempting registration with:', payload);

      const response = await fetch(AUTH_ENDPOINTS.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  login: async (payload: LoginCredentials): Promise<AuthResponse> => {
    try {
      const formData = new FormData();
      formData.append('username', payload.username);
      formData.append('password', payload.password);

      const response = await apiRequest(AUTH_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('role', response.role);
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  adminLogin: async (payload: LoginCredentials): Promise<AuthResponse> => {
    try {
      const formData = new FormData();
      formData.append('username', payload.username);
      formData.append('password', payload.password);

      const response = await apiRequest(AUTH_ENDPOINTS.adminLogin, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('role', response.role);
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  },
};
