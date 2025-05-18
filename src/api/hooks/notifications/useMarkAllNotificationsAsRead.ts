import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAllNotificationsAsRead } from '../../services/notification.service';

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error>({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      // Invalidate notifications queries to refetch the data
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export default useMarkAllNotificationsAsRead;