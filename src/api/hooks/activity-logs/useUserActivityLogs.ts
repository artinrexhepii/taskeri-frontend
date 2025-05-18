import { useQuery } from '@tanstack/react-query';
import { getUserActivityLogs } from '../../services/activity-log.service';
import { ActivityLogResponse } from '../../../types/activity-log.types';
import { PaginatedResponse } from '../../../types/api.types';

export const useUserActivityLogs = (
  userId: number,
  page = 1,
  pageSize = 20,
  enabled = true
) => {
  return useQuery<PaginatedResponse<ActivityLogResponse>, Error>({
    queryKey: ['activity-logs', 'user', userId, page, pageSize],
    queryFn: () => getUserActivityLogs(userId, page, pageSize),
    enabled: !!userId && enabled,
  });
};

export default useUserActivityLogs;