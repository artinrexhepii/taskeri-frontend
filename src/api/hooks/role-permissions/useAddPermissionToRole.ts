import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addPermissionToRole } from '../../services/role-permission.service';
import { RolePermissionResponse } from '../../../types/role-permission.types';

export const useAddPermissionToRole = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RolePermissionResponse,
    Error,
    { roleId: number; permissionId: number }
  >({
    mutationFn: ({ roleId, permissionId }) => addPermissionToRole(roleId, permissionId),
    onSuccess: (_, variables) => {
      // Invalidate role permissions query
      queryClient.invalidateQueries({
        queryKey: ['role-permissions', variables.roleId]
      });
    },
  });
};

export default useAddPermissionToRole;