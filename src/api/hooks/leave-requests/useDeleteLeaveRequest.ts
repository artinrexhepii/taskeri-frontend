import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLeaveRequest } from '../../services/leave-request.service';

export const useDeleteLeaveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; userId?: number }>({
    mutationFn: ({ id }) => deleteLeaveRequest(id),
    onSuccess: (_, variables) => {
      // Invalidate specific leave request query
      queryClient.invalidateQueries({ queryKey: ['leave-requests', variables.id] });
      
      // Invalidate user leave requests if userId is provided
      if (variables.userId) {
        queryClient.invalidateQueries({ 
          queryKey: ['leave-requests', 'user', variables.userId] 
        });
      }
      
      // Invalidate all leave requests
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
    },
  });
};

export default useDeleteLeaveRequest;