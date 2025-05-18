import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDepartment } from '../../services/department.service';

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, number>({
    mutationFn: (departmentId) => deleteDepartment(departmentId),
    onSuccess: (_, departmentId) => {
      // Invalidate departments list
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      // Remove department from cache
      queryClient.removeQueries({ queryKey: ['departments', departmentId] });
      // Teams might be affected
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};