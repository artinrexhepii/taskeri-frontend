import { useQuery } from '@tanstack/react-query';
import { getLeaveRequestById } from '../../services/leave-request.service';
import { LeaveRequestResponse } from '../../../types/leave-request.types';

export const useLeaveRequest = (id: number, enabled = true) => {
  return useQuery<LeaveRequestResponse, Error>({
    queryKey: ['leave-requests', id],
    queryFn: () => getLeaveRequestById(id),
    enabled: !!id && enabled,
  });
};

export default useLeaveRequest;