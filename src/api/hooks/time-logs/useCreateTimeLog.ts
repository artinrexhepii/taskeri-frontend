import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTimeLog } from '../../services/time-log.service';
import { TimeLogCreate, TimeLogResponse } from '../../../types/time-logging.types';

export const useCreateTimeLog = () => {
  const queryClient = useQueryClient();

  return useMutation<TimeLogResponse, Error, TimeLogCreate>({
    mutationFn: (timeLog) => createTimeLog(timeLog),
    onSuccess: (data) => {
      // Invalidate time logs queries
      queryClient.invalidateQueries({ queryKey: ['time-logs'] });
      
      // Invalidate task time logs if task_id is available
      if (data.task_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['time-logs', 'task', data.task_id] 
        });
      }
      
      // Invalidate user time logs
      queryClient.invalidateQueries({ 
        queryKey: ['time-logs', 'user', data.user_id] 
      });
    },
  });
};

export default useCreateTimeLog;