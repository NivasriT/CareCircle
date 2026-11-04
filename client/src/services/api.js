import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('carecircle_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global errors (e.g. 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login check failure, but clear invalid token
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        // Token expired
        localStorage.removeItem('carecircle_token');
        localStorage.removeItem('carecircle_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
