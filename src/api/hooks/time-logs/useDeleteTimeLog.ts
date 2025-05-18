import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTimeLog } from '../../services/time-log.service';

export const useDeleteTimeLog = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; taskId?: number; userId?: number }>({
    mutationFn: ({ id }) => deleteTimeLog(id),
    onSuccess: (_, variables) => {
      // Invalidate specific time log query
      queryClient.invalidateQueries({ queryKey: ['time-logs', variables.id] });
      
      // Invalidate all time logs query
      queryClient.invalidateQueries({ queryKey: ['time-logs'] });
      
      // Invalidate task time logs if taskId is provided
      if (variables.taskId) {
        queryClient.invalidateQueries({ 
          queryKey: ['time-logs', 'task', variables.taskId] 
        });
      }
      
      // Invalidate user time logs if userId is provided
      if (variables.userId) {
        queryClient.invalidateQueries({ 
          queryKey: ['time-logs', 'user', variables.userId] 
        });
      }
    },
  });
};

export default useDeleteTimeLog;