import { useMutation } from '@tanstack/react-query';
import { login } from '../../services/auth.service';
import { LoginRequest, AuthResponse } from '../../../types/auth.types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export const useLogin = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: async (credentials) => {
      const response = await login(credentials);
      if (!response.access_token) {
        throw new Error('Invalid response from server');
      }
      return response;
    },
    onSuccess: async (data) => {
      try {
        // Update auth context with the response data
        const success = await authLogin({
          email: data.user.email,
          password: '', // We don't need to store the password
          user: data.user // Pass the user object to the auth context
        });

        if (success) {
          // Only navigate if login was successful
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Failed to complete login:', error);
        // Clean up on error
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};