import axios from 'axios';

// Robust base URL resolver: Handles trailing slashes and ensures /api path is present for remote hosts
const getBaseUrl = () => {
  let url = (import.meta.env.VITE_API_URL || '/api').trim();
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  if (/^https?:\/\//i.test(url) && !url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
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

    let message = error.message || 'An error occurred';

    if (error.response?.data) {
      if (typeof error.response.data === 'object' && error.response.data.message) {
        message = error.response.data.message;
      } else if (typeof error.response.data === 'object' && error.response.data.error) {
        message = error.response.data.error;
      } else if (typeof error.response.data === 'string' && !error.response.data.includes('<!DOCTYPE')) {
        message = error.response.data;
      } else if (error.response.status === 404) {
        message = 'The requested API endpoint was not found. Please ensure the backend server is running.';
      } else if (error.response.status === 405) {
        message = 'Method Not Allowed (405): Please redeploy with the updated API configuration.';
      } else if (error.response.status === 500) {
        message = 'Server Error (500): An error occurred on the server. Please try again or check server logs.';
      }
    } else if (error.message === 'Network Error') {
      message = 'Network error: Cannot reach the backend API server. Please check your connection or start the server.';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
