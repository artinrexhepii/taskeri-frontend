import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRole } from '../../services/role.service';

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => deleteRole(id),
    onSuccess: (_, id) => {
      // Invalidate specific role query
      queryClient.invalidateQueries({ queryKey: ['roles', id] });
      
      // Invalidate all roles query
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      
      // Invalidate role-permissions queries since they might be affected
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
    },
  });
};

export default useDeleteRole;