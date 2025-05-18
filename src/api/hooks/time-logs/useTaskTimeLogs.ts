import { useQuery } from '@tanstack/react-query';
import { getTaskTimeLogs } from '../../services/time-log.service';
import { TimeLogResponse } from '../../../types/time-logging.types';

export const useTaskTimeLogs = (taskId: number, enabled = true) => {
  return useQuery<TimeLogResponse[], Error>({
    queryKey: ['time-logs', 'task', taskId],
    queryFn: () => getTaskTimeLogs(taskId),
    enabled: !!taskId && enabled,
  });
};

export default useTaskTimeLogs;