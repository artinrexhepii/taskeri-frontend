import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '../../services/project.service';
import { ProjectCreate, ProjectResponse } from '../../../types/project.types';

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ProjectResponse, Error, ProjectCreate>({
    mutationFn: (projectData) => createProject(projectData),
    onSuccess: () => {
      // Invalidate projects list query
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      // Invalidate projects statistics
      queryClient.invalidateQueries({ queryKey: ['projects', 'statistics'] });
    },
  });
};