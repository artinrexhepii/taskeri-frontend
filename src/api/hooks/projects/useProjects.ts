import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../../services/project.service';
import { ProjectResponse } from '../../../types/project.types';

export const useProjects = () => {
  return useQuery<ProjectResponse[], Error>({
    queryKey: ['projects'],
    queryFn: getProjects,
  });
};