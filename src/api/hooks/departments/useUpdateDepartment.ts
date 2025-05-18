import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDepartment } from '../../services/department.service';
import { DepartmentUpdate, DepartmentResponse } from '../../../types/department.types';

interface UpdateDepartmentVariables {
  id: number;
  departmentData: DepartmentUpdate;
}

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation<DepartmentResponse, Error, UpdateDepartmentVariables>({
    mutationFn: ({ id, departmentData }) => updateDepartment(id, departmentData),
    onSuccess: (data, variables) => {
      // Invalidate department query
      queryClient.invalidateQueries({ queryKey: ['departments', variables.id] });
      // Invalidate departments list
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};