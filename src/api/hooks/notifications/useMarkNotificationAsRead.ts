import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markNotificationAsRead } from '../../services/notification.service';
import { NotificationResponse } from '../../../types/notification.types';

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<NotificationResponse, Error, number>({
    mutationFn: (id) => markNotificationAsRead(id),
    onSuccess: () => {
      // Invalidate notifications queries to refetch the data
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export default useMarkNotificationAsRead;