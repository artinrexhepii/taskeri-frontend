import { useQuery } from '@tanstack/react-query';
import { getUserLeaveRequests } from '../../services/leave-request.service';
import { LeaveRequestResponse } from '../../../types/leave-request.types';

export const useUserLeaveRequests = (userId: number, enabled = true) => {
  return useQuery<LeaveRequestResponse[], Error>({
    queryKey: ['leave-requests', 'user', userId],
    queryFn: () => getUserLeaveRequests(userId),
    enabled: !!userId && enabled,
  });
};

export default useUserLeaveRequests;