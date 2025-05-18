import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProject } from '../../services/project.service';

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, number>({
    mutationFn: (projectId) => deleteProject(projectId),
    onSuccess: (_, projectId) => {
      // Invalidate projects list query
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      // Remove the specific project from cache
      queryClient.removeQueries({ queryKey: ['projects', projectId] });
      
      // Invalidate tasks by project since they will be affected
      queryClient.invalidateQueries({ queryKey: ['tasks', 'project', projectId] });
      
      // Invalidate project statistics
      queryClient.invalidateQueries({ queryKey: ['projects', 'statistics'] });
    },
  });
};