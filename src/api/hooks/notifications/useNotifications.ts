import { useQuery } from '@tanstack/react-query';
import { getMyNotifications } from '../../services/notification.service';
import { NotificationResponse } from '../../../types/notification.types';

export const useNotifications = (
  unreadOnly = false,
  enabled = true
) => {
  return useQuery<NotificationResponse[], Error>({
    queryKey: ['notifications', unreadOnly],
    queryFn: () => getMyNotifications(unreadOnly),
    enabled,
  });
};

export default useNotifications;