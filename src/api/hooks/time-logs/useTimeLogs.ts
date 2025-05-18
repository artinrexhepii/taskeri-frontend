import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeRoleFromUser } from '../../services/user-role.service';

export const useRemoveRoleFromUser = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, { userId: number; roleId: number }>({
    mutationFn: ({ userId, roleId }) => removeRoleFromUser(userId, roleId),
    onSuccess: (_, variables) => {
      // Invalidate user roles query
      queryClient.invalidateQueries({ 
        queryKey: ['user-roles', variables.userId] 
      });
    },
  });
};

export default useRemoveRoleFromUser;