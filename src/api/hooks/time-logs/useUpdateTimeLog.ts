import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTimeLog } from '../../services/time-log.service';
import { TimeLogUpdate, TimeLogResponse } from '../../../types/time-logging.types';

export const useUpdateTimeLog = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<TimeLogResponse, Error, TimeLogUpdate>({
    mutationFn: (timeLog) => updateTimeLog(id, timeLog),
    onSuccess: (data) => {
      // Invalidate specific time log query
      queryClient.invalidateQueries({ queryKey: ['time-logs', id] });
      
      // Invalidate all time logs query
      queryClient.invalidateQueries({ queryKey: ['time-logs'] });
      
      // Invalidate task time logs
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

export default useUpdateTimeLog;