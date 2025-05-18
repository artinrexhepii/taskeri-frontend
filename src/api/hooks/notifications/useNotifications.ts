import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../../services/notification.service';
import { NotificationResponse } from '../../../types/notification.types';
import { PaginatedResponse } from '../../../types/api.types';

export const useNotifications = (
  page = 1,
  pageSize = 20,
  unreadOnly = false,
  enabled = true
) => {
  return useQuery<PaginatedResponse<NotificationResponse>, Error>({
    queryKey: ['notifications', page, pageSize, unreadOnly],
    queryFn: () => getNotifications(page, pageSize, unreadOnly),
    enabled,
  });
};

export default useNotifications;