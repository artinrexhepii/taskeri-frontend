import { useQuery } from '@tanstack/react-query';
import { getDepartmentById } from '../../services/department.service';
import { DepartmentResponse } from '../../../types/department.types';

export const useDepartment = (departmentId: number) => {
  return useQuery<DepartmentResponse, Error>({
    queryKey: ['departments', departmentId],
    queryFn: () => getDepartmentById(departmentId),
    enabled: !!departmentId,
  });
};