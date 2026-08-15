import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization token to requests if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hope_somalia_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized error interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      // Clear token and redirect to login if unauthenticated on admin routes
      if (!window.location.pathname.endsWith('/login')) {
        localStorage.removeItem('hope_somalia_token');
        localStorage.removeItem('hope_somalia_user');
        window.location.href = '/admin/login';
      }
    }
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
