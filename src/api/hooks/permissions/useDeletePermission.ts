import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePermission } from '../../services/permission.service';

export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => deletePermission(id),
    onSuccess: (_, id) => {
      // Invalidate specific permission query
      queryClient.invalidateQueries({ queryKey: ['permissions', id] });
      
      // Invalidate all permissions query
      queryClient.invalidateQueries({ queryKey: ['permissions'] });

      // You might also want to invalidate role permissions queries since they may have used this permission
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
    },
  });
};

export default useDeletePermission;