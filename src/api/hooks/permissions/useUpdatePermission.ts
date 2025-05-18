import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePermission } from '../../services/permission.service';
import { PermissionUpdate, PermissionResponse } from '../../../types/role-permission.types';

export const useUpdatePermission = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<PermissionResponse, Error, PermissionUpdate>({
    mutationFn: (permission) => updatePermission(id, permission),
    onSuccess: () => {
      // Invalidate specific permission query
      queryClient.invalidateQueries({ queryKey: ['permissions', id] });
      
      // Invalidate all permissions query
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};

export default useUpdatePermission;