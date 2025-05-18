import { useQuery } from '@tanstack/react-query';
import { getUserTimeLogs } from '../../services/time-log.service';
import { TimeLogResponse } from '../../../types/time-logging.types';

export const useUserTimeLogs = (userId: number, enabled = true) => {
  return useQuery<TimeLogResponse[], Error>({
    queryKey: ['time-logs', 'user', userId],
    queryFn: () => getUserTimeLogs(userId),
    enabled: !!userId && enabled,
  });
};

export default useUserTimeLogs;