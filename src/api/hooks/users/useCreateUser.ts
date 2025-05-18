import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../../services/user.service';
import { UserCreate, UserResponse } from '../../../types/user.types';

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<UserResponse, Error, UserCreate>({
    mutationFn: (userData) => createUser(userData),
    onSuccess: () => {
      // Invalidate the users list query to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};