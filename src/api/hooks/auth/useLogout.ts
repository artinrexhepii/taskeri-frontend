import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear all query cache when logging out
      queryClient.clear();
      navigate('/login');
    },
  });
};