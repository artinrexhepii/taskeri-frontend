import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../../services/task.service';
import { TaskUpdate, TaskResponse } from '../../../types/task.types';

interface UpdateTaskVariables {
  id: number;
  taskData: TaskUpdate;
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation<TaskResponse, Error, UpdateTaskVariables>({
    mutationFn: ({ id, taskData }) => updateTask(id, taskData),
    onSuccess: (data, variables) => {
      // Invalidate specific task query
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id, 'details'] });
      
      // Invalidate tasks list queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      // If project_id was updated, invalidate related queries
      if (data.project_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['tasks', 'project', data.project_id] 
        });
      }
    },
  });
};