import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProject } from '../../services/project.service';
import { ProjectUpdate, ProjectResponse } from '../../../types/project.types';

interface UpdateProjectVariables {
  id: number;
  projectData: ProjectUpdate;
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ProjectResponse, Error, UpdateProjectVariables>({
    mutationFn: ({ id, projectData }) => updateProject(id, projectData),
    onSuccess: (data, variables) => {
      // Invalidate specific project query
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
      
      // Invalidate projects list query
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      // Invalidate projects statistics if status changed
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: ['projects', 'statistics'] });
      }
    },
  });
};