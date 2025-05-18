import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignRoleToUser } from '../../services/user-role.service';
import { RoleResponse } from '../../../types/role-permission.types';

export const useAssignRoleToUser = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, { userId: number; roleId: number }>({
    mutationFn: ({ userId, roleId }) => assignRoleToUser(userId, roleId),
    onSuccess: (_, variables) => {
      // Invalidate user roles query
      queryClient.invalidateQueries({ 
        queryKey: ['user-roles', variables.userId] 
      });
    },
  });
};

export default useAssignRoleToUser;