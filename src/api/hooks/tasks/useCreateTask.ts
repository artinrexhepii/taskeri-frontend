import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../../services/task.service';
import { TaskCreate, TaskResponse } from '../../../types/task.types';

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation<TaskResponse, Error, TaskCreate>({
    mutationFn: (taskData) => createTask(taskData),
    onSuccess: (data) => {
      // Invalidate tasks queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // Invalidate project tasks if project_id is available
      if (data.project_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['tasks', 'project', data.project_id] 
        });
      }
    },
  });
};