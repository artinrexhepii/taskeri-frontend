import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../../services/user.service';
import { UserUpdate, UserResponse } from '../../../types/user.types';

interface UpdateUserVariables {
  id: number;
  userData: UserUpdate;
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<UserResponse, Error, UpdateUserVariables>({
    mutationFn: ({ id, userData }) => updateUser(id, userData),
    onSuccess: (data, variables) => {
      // Update the cache for the specific user
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};