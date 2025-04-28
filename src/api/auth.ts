import api from './index';
import {
  LoginRequest, 
  LoginResponse, 
  TokenRefreshRequest, 
  TokenRefreshResponse 
} from '../types/auth.types';
import { User } from '../types/user.types';

const AuthService = {
  /**
   * Log in a user with email and password
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // Convert to form data since backend expects OAuth2 form
    const formData = new FormData();
    formData.append('username', data.email);
    formData.append('password', data.password);
    if (data.remember_me) {
      formData.append('remember_me', String(data.remember_me));
    }
    
    const response = await api.post<LoginResponse>('/token', formData);
    
    // Store tokens in localStorage
    if (response.access_token) {
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },
  
  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (data: TokenRefreshRequest): Promise<TokenRefreshResponse> => {
    const response = await api.post<TokenRefreshResponse>('/token/refresh', data);
    
    if (response.access_token) {
      localStorage.setItem('accessToken', response.access_token);
    }
    
    return response;
  },
  
  /**
   * Log out the current user
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tenantId');
    // API call to server to invalidate token
    return api.post('/auth/logout', {});
  },
  
  /**
   * Check if user is currently authenticated
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  },
  
  /**
   * Get the current user from localStorage
   */
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  },
  
  /**
   * Get fresh user data from the server
   */
  fetchCurrentUser: async (): Promise<User> => {
    return api.get<User>('/auth/me');
  }
};

export default AuthService;