import { useQuery } from '@tanstack/react-query';
import { getMyRecentActivityLogs } from '../../services/activity-log.service';
import { ActivityLogResponse } from '../../../types/activity-log.types';

export const useMyRecentActivityLogs = (limit = 10, enabled = true) => {
  return useQuery<ActivityLogResponse[], Error>({
    queryKey: ['activity-logs', 'my-recent', limit],
    queryFn: () => getMyRecentActivityLogs(limit),
    enabled,
  });
};

export default useMyRecentActivityLogs;