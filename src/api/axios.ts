import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Read from environment variables
const API_BASE_URL = 'http://localhost:8000';

// Create instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    const tenantId = localStorage.getItem('tenant_id');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear authentication data
      localStorage.removeItem('access_token');
      localStorage.removeItem('tenant_id');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden (Permission issues)
    if (error.response?.status === 403) {
      console.error('Permission denied:', error.response.data);
      // Could dispatch notification or event
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;