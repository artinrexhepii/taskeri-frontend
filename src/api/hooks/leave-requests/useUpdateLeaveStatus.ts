import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLeaveStatus } from '../../services/leave-request.service';
import { LeaveRequestResponse, LeaveStatus } from '../../../types/leave-request.types';

export const useUpdateLeaveStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    LeaveRequestResponse,
    Error,
    { id: number; status: LeaveStatus }
  >({
    mutationFn: ({ id, status }) => updateLeaveStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests', data.id] });

      if (data.user_id) {
        queryClient.invalidateQueries({
          queryKey: ['leave-requests', 'user', data.user_id],
        });
      }

      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
    },
  });
};

export default useUpdateLeaveStatus;
