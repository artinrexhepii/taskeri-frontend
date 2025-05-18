import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '../../services/task.service';

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, number>({
    mutationFn: (taskId) => deleteTask(taskId),
    onSuccess: (_, taskId) => {
      // Invalidate tasks list queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      // Remove the specific task from cache
      queryClient.removeQueries({ queryKey: ['tasks', taskId] });
      queryClient.removeQueries({ queryKey: ['tasks', taskId, 'details'] });
    },
  });
};