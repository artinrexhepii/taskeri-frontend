import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRole } from '../../services/role.service';
import { RoleUpdate, RoleResponse } from '../../../types/role-permission.types';

export const useUpdateRole = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<RoleResponse, Error, RoleUpdate>({
    mutationFn: (role) => updateRole(id, role),
    onSuccess: () => {
      // Invalidate specific role query
      queryClient.invalidateQueries({ queryKey: ['roles', id] });
      
      // Invalidate all roles query
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export default useUpdateRole;