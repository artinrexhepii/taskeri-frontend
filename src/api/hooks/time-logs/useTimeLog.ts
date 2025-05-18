import { useQuery } from '@tanstack/react-query';
import { getTimeLogById } from '../../services/time-log.service';
import { TimeLogResponse } from '../../../types/time-logging.types';

export const useTimeLog = (id: number, enabled = true) => {
  return useQuery<TimeLogResponse, Error>({
    queryKey: ['time-logs', id],
    queryFn: () => getTimeLogById(id),
    enabled: !!id && enabled,
  });
};

export default useTimeLog;