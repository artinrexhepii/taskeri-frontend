import { useQuery } from '@tanstack/react-query';
import { getLeaveRequests } from '../../services/leave-request.service';
import { LeaveRequestResponse, LeaveStatus } from '../../../types/leave-request.types';
import { PaginatedResponse } from '../../../types/api.types';

export const useLeaveRequests = (
  page = 1,
  pageSize = 20,
  filters?: {
    status?: LeaveStatus[];
    start_date_from?: string;
    start_date_to?: string;
    leave_type?: string;
  },
  enabled = true
) => {
  return useQuery<PaginatedResponse<LeaveRequestResponse>, Error>({
    queryKey: ['leave-requests', page, pageSize, filters],
    queryFn: () => getLeaveRequests(page, pageSize, filters),
    enabled,
  });
};

export default useLeaveRequests;