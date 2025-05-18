import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignUserToProject } from '../../services/user-project.service';

export const useAssignUserToProject = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { projectId: number; userId: number }>({
    mutationFn: ({ projectId, userId }) => assignUserToProject(projectId, userId),
    onSuccess: (_, variables) => {
      // Invalidate project users query
      queryClient.invalidateQueries({ 
        queryKey: ['project-users', variables.projectId] 
      });
      
      // Invalidate user projects query
      queryClient.invalidateQueries({ 
        queryKey: ['user-projects', variables.userId] 
      });
    },
  });
};

export default useAssignUserToProject;