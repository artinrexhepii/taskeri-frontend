import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';


// Read from environment variables
const API_BASE_URL = 'http://127.0.0.1:10000';
//const API_BASE_URL = 'https://taskeri-production.up.railway.app';


// Create instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json',
  },
  timeout: 15000, // 15 seconds
  withCredentials: true, // Enable sending cookies in cross-origin requests
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    console.log('Making request to:', config.url);
    console.log('Request method:', config.method);
    console.log('Request headers before auth:', config.headers);
    
    if (token) {
      // Log the raw token for comparison
      console.log('Raw token from localStorage:', token);
      
      // Ensure the token is properly formatted with 'Bearer' prefix
      // Remove any existing Authorization header to prevent duplicates
      delete config.headers.Authorization;
      const authHeader = `Bearer ${token}`;
      config.headers.Authorization = authHeader;
      
      // Log the exact header we're sending
      console.log('Authorization header being sent:', authHeader);
      
      // Compare with the working Swagger token
      const swaggerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidGVuYW50X2lkIjoxLCJ0ZW5hbnRfbmFtZSI6IlRhc2tlcmkiLCJleHAiOjE3NDc3NTc1NjN9.ipdUFKNCFjRzj86lI5UVN9stYBzXblMErQETuz9hJ9U';
      console.log('Token comparison:', {
        ourToken: token,
        swaggerToken: swaggerToken,
        match: token === swaggerToken
      });
    } else {
      console.warn('No access token found in localStorage');
    }

    // Ensure the URL is properly formatted
    if (config.url && !config.url.startsWith('http')) {
      // Remove any double slashes except after the protocol
      config.url = config.url.replace(/([^:]\/)\/+/g, '$1');
      console.log('Normalized URL:', config.url);
    }
    
    // Don't add Authorization header for OPTIONS requests
    if (config.method?.toLowerCase() === 'options') {
      delete config.headers.Authorization;
    }
    
    console.log('Final request headers:', config.headers);
    console.log('Full request URL:', `${config.baseURL}${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  (error: AxiosError) => {
    console.error('Response error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      data: error.response?.data
    });

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.error('401 Unauthorized - Clearing auth data');
      // Clear authentication data
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden (Permission issues)
    if (error.response?.status === 403) {
      console.error('403 Forbidden - Permission denied:', error.response.data);
    }

    // Handle CORS errors
    if (error.message === 'Network Error') {
      console.error('CORS Error: Unable to access the API. Please check if the API server is running and CORS is properly configured.');
      // Log additional details for debugging
      if (error.config) {
        console.error('Failed request details:', {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers,
          baseURL: error.config.baseURL,
          fullURL: `${error.config.baseURL}${error.config.url}`
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;