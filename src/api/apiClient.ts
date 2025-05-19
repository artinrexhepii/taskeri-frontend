import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosInstance from './axios';
import { ApiError } from '../types/api.types';

class ApiClient {
  private instance: AxiosInstance;

  constructor(instance: AxiosInstance = axiosInstance) {
    this.instance = instance;
  }

  /**
   * Make a GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.get(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Make a POST request
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.post(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Make a PUT request
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.put(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.delete(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.patch(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): never {
    if (axios.isAxiosError(error) && error.response) {
      // Extract API error details
      const errorData = error.response.data as ApiError;
      console.error(`API Error (${error.response.status}):`, errorData);
      
      // Log the request details for debugging
      if (error.config) {
        console.error('Request URL:', error.config.url);
        console.error('Request Method:', error.config.method);
        console.error('Request Headers:', error.config.headers);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

export const apiClient = new ApiClient();
export default apiClient;