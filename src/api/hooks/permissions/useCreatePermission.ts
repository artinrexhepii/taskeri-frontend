import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPermission } from '../../services/permission.service';
import { PermissionCreate, PermissionResponse } from '../../../types/role-permission.types';

export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation<PermissionResponse, Error, PermissionCreate>({
    mutationFn: (permission) => createPermission(permission),
    onSuccess: () => {
      // Invalidate permissions queries to refetch the data
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};

export default useCreatePermission;