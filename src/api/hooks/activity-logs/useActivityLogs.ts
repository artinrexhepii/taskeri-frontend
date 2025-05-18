import { useQuery } from '@tanstack/react-query';
import { getActivityLogs } from '../../services/activity-log.service';
import { ActivityLogFilterParams, ActivityLogResponse } from '../../../types/activity-log.types';
import { PaginatedResponse } from '../../../types/api.types';

export const useActivityLogs = (
  page = 1,
  pageSize = 20,
  filters?: ActivityLogFilterParams,
  enabled = true
) => {
  return useQuery<PaginatedResponse<ActivityLogResponse>, Error>({
    queryKey: ['activity-logs', page, pageSize, filters],
    queryFn: () => getActivityLogs(page, pageSize, filters),
    enabled,
  });
};

export default useActivityLogs;