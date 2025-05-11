import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

// Add a request interceptor to include the token
apiClient.interceptors.request.use(
  (config) => {
    // Check if running in browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

