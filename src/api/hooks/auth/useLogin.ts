import { useMutation } from '@tanstack/react-query';
import { login } from '../../services/auth.service';
import { LoginRequest, AuthResponse } from '../../../types/auth.types';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();
  
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (credentials) => login(credentials),
    onSuccess: (data) => {
      // Optional: store additional data or trigger side effects
      // For example, update global auth state
      navigate('/dashboard');
    },
    onError: (error) => {
      // Handle login error
      console.error('Login failed:', error);
    },
  });
};