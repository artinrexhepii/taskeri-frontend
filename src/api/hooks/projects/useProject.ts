import { useQuery } from '@tanstack/react-query';
import { getProjectById } from '../../services/project.service';
import { ProjectResponse } from '../../../types/project.types';

export const useProject = (projectId: number) => {
  return useQuery<ProjectResponse, Error>({
    queryKey: ['projects', projectId],
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId,
  });
};