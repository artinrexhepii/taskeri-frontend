import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removePermissionFromRole } from '../../services/role-permission.service';

export const useRemovePermissionFromRole = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { roleId: number; permissionId: number }>({
    mutationFn: ({ roleId, permissionId }) => removePermissionFromRole(roleId, permissionId),
    onSuccess: (_, variables) => {
      // Invalidate role permissions query
      queryClient.invalidateQueries({
        queryKey: ['role-permissions', variables.roleId]
      });
    },
  });
};

export default useRemovePermissionFromRole;