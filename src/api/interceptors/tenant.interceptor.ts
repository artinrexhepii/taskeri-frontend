import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export const setupTenantInterceptor = (axiosInstance: AxiosInstance): void => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const tenantId = localStorage.getItem('tenantId');
      
      // Add tenant ID to headers for multi-tenant functionality
      if (tenantId && config.headers) {
        config.headers['X-Tenant-ID'] = tenantId;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};