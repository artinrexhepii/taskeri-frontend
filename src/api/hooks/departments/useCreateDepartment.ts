import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDepartment } from '../../services/department.service';
import { DepartmentCreate, DepartmentResponse } from '../../../types/department.types';

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation<DepartmentResponse, Error, DepartmentCreate>({
    mutationFn: (departmentData) => createDepartment(departmentData),
    onSuccess: () => {
      // Invalidate departments list
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};