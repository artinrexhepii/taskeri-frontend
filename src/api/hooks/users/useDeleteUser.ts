import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '../../services/user.service';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, number>({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => {
      // Invalidate the users list query to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};