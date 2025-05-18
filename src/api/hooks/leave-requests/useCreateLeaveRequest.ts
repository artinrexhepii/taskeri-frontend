import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLeaveRequest } from '../../services/leave-request.service';
import { LeaveRequestCreate, LeaveRequestResponse } from '../../../types/leave-request.types';

export const useCreateLeaveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<LeaveRequestResponse, Error, LeaveRequestCreate>({
    mutationFn: (leaveRequest) => createLeaveRequest(leaveRequest),
    onSuccess: (data) => {
      // Invalidate user leave requests queries
      if (data.user_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['leave-requests', 'user', data.user_id] 
        });
      }
      
      // Invalidate all leave requests
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
    },
  });
};

export default useCreateLeaveRequest;