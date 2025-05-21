import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  NotificationResponse,
  NotificationUpdate
} from '../../types/notification.types';
import { PaginatedResponse } from '../../types/api.types';

export const getNotifications = async (
  page = 1,
  pageSize = 20,
  unreadOnly = false
): Promise<PaginatedResponse<NotificationResponse>> => {
  return apiClient.get(API_ENDPOINTS.NOTIFICATIONS.BASE, {
    params: {
      page,
      page_size: pageSize,
      unread_only: unreadOnly,
    }
  });
};

export const markNotificationAsRead = async (id: number): Promise<NotificationResponse> => {
  return apiClient.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id), { is_read: true });
};

export const markAllNotificationsAsRead = async (): Promise<{ message: string }> => {
  return apiClient.put(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/mark-all-read`);
};

export const getNotificationsForUser = async (
  userId: number,
  unreadOnly = false
): Promise<NotificationResponse[]> => {
  return apiClient.get(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/user/${userId}`, {
    params: {
      unread_only: unreadOnly,
    },
  });
};

export const getNotificationById = async (
  notificationId: number
): Promise<NotificationResponse> => {
  return apiClient.get(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${notificationId}`);
};

export const deleteNotification = async (
  notificationId: number
): Promise<{ message: string }> => {
  return apiClient.delete(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${notificationId}`);
};

export const getMyNotifications = async (
  unreadOnly = false
): Promise<NotificationResponse[]> => {
  return apiClient.get(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/get/me`, {
    params: {
      unread_only: unreadOnly,
    },
  });
};