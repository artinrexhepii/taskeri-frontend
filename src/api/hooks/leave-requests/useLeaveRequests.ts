import { useQuery } from '@tanstack/react-query';
import { getLeaveRequests } from '../../services/leave-request.service';
import { LeaveRequestListResponse } from '../../../types/leave-request.types';

export const useLeaveRequests = (
  page = 1,
  pageSize = 20,
  enabled = true
) => {
  return useQuery<LeaveRequestListResponse, Error>({
    queryKey: ['leave-requests', page, pageSize],
    queryFn: () => getLeaveRequests(page, pageSize),
    enabled,
  });
};

export default useLeaveRequests;
