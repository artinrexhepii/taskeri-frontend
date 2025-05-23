import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { LoginRequest, AuthResponse } from '../../types/auth.types';

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  // Transform to form data format for OAuth2 compatibility
  const formData = new URLSearchParams();
  formData.append('grant_type', 'password');
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);
  formData.append('scope', '');
  formData.append('client_id', 'string');
  formData.append('client_secret', 'string');
  
  const response = await apiClient.post<AuthResponse>(
    API_ENDPOINTS.AUTH.LOGIN, 
    formData.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json',
      },
    }
  );
  
  // Store the token and user data
  if (response.access_token) {
    // Log the token we're about to store
    console.log('Storing token from login response:', response.access_token);
    
    // Store the raw token without any prefix
    localStorage.setItem('access_token', response.access_token);
    
    // Store the complete user object including role_id
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    // Verify the token was stored correctly
    const storedToken = localStorage.getItem('access_token');
    console.log('Verified stored token:', storedToken);
    console.log('Token storage verification:', {
      original: response.access_token,
      stored: storedToken,
      match: response.access_token === storedToken
    });
  } else {
    console.error('No access_token in login response:', response);
  }
  
  return response;
};

export const logout = async () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  Promise.resolve(); // Assuming logout doesn't require an API call
};

export const getCurrentUser = async (): Promise<any> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  // You may need to implement a specific endpoint for this
  return apiClient.get(API_ENDPOINTS.USERS.DETAIL('me'));
};