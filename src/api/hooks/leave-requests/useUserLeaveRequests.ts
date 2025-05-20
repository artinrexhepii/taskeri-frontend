import { useQuery } from '@tanstack/react-query';
import { getLeaveRequestsByUser } from '../../services/leave-request.service';
import { LeaveRequestResponse } from '../../../types/leave-request.types';

export const useUserLeaveRequests = (userId: number, enabled = true) => {
  return useQuery<LeaveRequestResponse[], Error>({
    queryKey: ['leave-requests', 'user', userId],
    queryFn: () => getLeaveRequestsByUser(userId), // return data directly, no `.data`
    enabled: !!userId && enabled,
  });
};

export default useUserLeaveRequests;
