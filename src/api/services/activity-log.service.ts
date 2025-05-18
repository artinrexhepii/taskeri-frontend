import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  ActivityLogResponse,
  ActivityLogFilterParams
} from '../../types/activity-log.types';
import { PaginatedResponse } from '../../types/api.types';

/**
 * Get paginated activity logs with optional filtering
 */
export const getActivityLogs = async (
  page = 1, 
  pageSize = 20, 
  filters?: ActivityLogFilterParams
): Promise<PaginatedResponse<ActivityLogResponse>> => {
  return apiClient.get(API_ENDPOINTS.ACTIVITY_LOGS.BASE, {
    params: {
      page,
      page_size: pageSize,
      ...filters,
    }
  });
};

/**
 * Get activity logs for a specific user
 */
export const getUserActivityLogs = async (
  userId: number,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<ActivityLogResponse>> => {
  return apiClient.get(API_ENDPOINTS.ACTIVITY_LOGS.BY_USER(userId), {
    params: {
      page,
      page_size: pageSize,
    }
  });
};

/**
 * Get recent activity logs for the current user
 */
export const getMyRecentActivityLogs = async (limit = 10): Promise<ActivityLogResponse[]> => {
  return apiClient.get(API_ENDPOINTS.ACTIVITY_LOGS.MY_RECENT, {
    params: { limit }
  });
};