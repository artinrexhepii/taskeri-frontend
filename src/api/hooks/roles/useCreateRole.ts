import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRole } from '../../services/role.service';
import { RoleCreate, RoleResponse } from '../../../types/role-permission.types';

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<RoleResponse, Error, RoleCreate>({
    mutationFn: (role) => createRole(role),
    onSuccess: () => {
      // Invalidate roles queries to refetch the data
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export default useCreateRole;