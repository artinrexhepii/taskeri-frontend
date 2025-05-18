import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { LoginRequest, AuthResponse } from '../../types/auth.types';

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  // Transform to form data format for OAuth2 compatibility
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);
  
  if (credentials.tenant_id) {
    formData.append('tenant_id', credentials.tenant_id);
  }
  
  const response = await apiClient.post<AuthResponse>(
    API_ENDPOINTS.AUTH.LOGIN, 
    formData.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  
  // Store token and user data
  localStorage.setItem('access_token', response.access_token);
  if (credentials.tenant_id) {
    localStorage.setItem('tenant_id', credentials.tenant_id);
  }
  
  return response;
};

export const logout = async () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('tenant_id');
  Promise.resolve(); // Assuming logout doesn't require an API call
  // Clear any other stored user data
};

export const getCurrentUser = async (): Promise<any> => {
  // Assuming there's an endpoint to get current user info
  // If not, you might decode the JWT token to get basic user info
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  // You may need to implement a specific endpoint for this
  return apiClient.get(API_ENDPOINTS.USERS.DETAIL('me'));
};