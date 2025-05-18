import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLeaveStatus } from '../../services/leave-request.service';
import { LeaveRequestResponse, LeaveStatus } from '../../../types/leave-request.types';

export const useUpdateLeaveStatus = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<
    LeaveRequestResponse, 
    Error, 
    LeaveStatus
  >({
    mutationFn: (status) => updateLeaveStatus(id, status),
    onSuccess: (data) => {
      // Invalidate specific leave request
      queryClient.invalidateQueries({ queryKey: ['leave-requests', id] });
      
      // Invalidate user leave requests
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

export default useUpdateLeaveStatus;