import { AxiosInstance } from 'axios';
import { ApiError } from '../../types/api.types';

export const setupErrorInterceptor = (axiosInstance: AxiosInstance): void => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Standardize error format
      const apiError: ApiError = {
        status: error.response?.status || 500,
        message: error.response?.data?.detail || 'An unexpected error occurred',
        detail: error.response?.data?.detail,
        errors: error.response?.data?.errors
      };
      
      // You can add global error handling here (e.g., show toast notifications)
      console.error('API Error:', apiError);
      
      // You can also handle specific error codes
      if (apiError.status === 403) {
        // Handle forbidden
        // dispatch(showNotification('You do not have permission to perform this action'));
      }
      
      return Promise.reject(apiError);
    }
  );
};