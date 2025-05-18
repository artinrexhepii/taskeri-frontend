import { useQuery } from '@tanstack/react-query';
import { getDepartments } from '../../services/department.service';
import { DepartmentResponse } from '../../../types/department.types';

export const useDepartments = () => {
  return useQuery<DepartmentResponse[], Error>({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });
};