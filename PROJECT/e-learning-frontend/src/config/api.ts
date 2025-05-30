// API Configuration
export const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Auth endpoints
export const AUTH_ENDPOINTS = {
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
  adminLogin: `${API_BASE_URL}/auth/adminlogin`,
};

// Student endpoints
export const STUDENT_ENDPOINTS = {
  profile: `${API_BASE_URL}/student/profile`,
  courses: `${API_BASE_URL}/student/courses`,
  sessions: `${API_BASE_URL}/student/sessions`,
  materials: `${API_BASE_URL}/student/materials`,
  payments: `${API_BASE_URL}/student/payments`,
};

// Admin endpoints
export const ADMIN_ENDPOINTS = {
  dashboard: `${API_BASE_URL}/admin/dashboard`,
  users: `${API_BASE_URL}/admin/users`,
  courses: `${API_BASE_URL}/admin/courses`,
  sessions: `${API_BASE_URL}/admin/sessions`,
  payments: `${API_BASE_URL}/admin/payments`,
  logs: `${API_BASE_URL}/admin/logs`,
};

// Tutor endpoints
export const TUTOR_ENDPOINTS = {
  profile: `${API_BASE_URL}/tutor/profile`,
  courses: `${API_BASE_URL}/tutor/courses`,
  sessions: `${API_BASE_URL}/tutor/sessions`,
  materials: `${API_BASE_URL}/tutor/materials`,
};

// API request helper
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  try {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
      mode: 'cors',
    };

    // Log request details
    console.log('API Request:', {
      url,
      method: requestOptions.method || 'GET',
      headers: requestOptions.headers,
      body: requestOptions.body,
    });

    console.log('Making API request:', {
      url,
      method: requestOptions.method,
      headers: requestOptions.headers,
    });

    const response = await fetch(url, requestOptions);



    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      let errorMessage = 'API request failed';
      if (typeof data === 'object' && data.detail) {
        errorMessage = data.detail;
      } else if (typeof data === 'string' && data.length > 0) {
        errorMessage = data;
      }
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    console.error('API request error:', error);
    console.error('API request error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
};
