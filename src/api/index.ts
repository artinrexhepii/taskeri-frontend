import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { setupAuthInterceptor } from './interceptors/auth.interceptor';
import { setupErrorInterceptor } from './interceptors/error.interceptor';
import { setupTenantInterceptor } from './interceptors/tenant.interceptor';

// Base API configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000';

// Create a base axios instance that all services will use
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set up interceptors
setupAuthInterceptor(apiClient);
setupErrorInterceptor(apiClient);
setupTenantInterceptor(apiClient);

// Reusable request function with generics for type safety
export const apiRequest = async <T = any, R = AxiosResponse<T>>(
  config: AxiosRequestConfig
): Promise<R> => {
  try {
    return await apiClient(config) as R;
  } catch (error) {
    return Promise.reject(error);
  }
};

// Helper functions for common HTTP methods
export const get = <T>(url: string, params?: any): Promise<T> => 
  apiRequest<T>({ method: 'GET', url, params }).then(res => res.data);

export const post = <T>(url: string, data?: any): Promise<T> => 
  apiRequest<T>({ method: 'POST', url, data }).then(res => res.data);

export const put = <T>(url: string, data?: any): Promise<T> => 
  apiRequest<T>({ method: 'PUT', url, data }).then(res => res.data);

export const patch = <T>(url: string, data?: any): Promise<T> => 
  apiRequest<T>({ method: 'PATCH', url, data }).then(res => res.data);

export const del = <T>(url: string, data?: any): Promise<T> => 
  apiRequest<T>({ method: 'DELETE', url, data: data }).then(res => res.data);

export default { get, post, put, patch, del };