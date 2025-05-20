import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import {
  LeaveRequestCreate,
  LeaveRequestResponse,
  LeaveStatus,
  LeaveRequestListResponse
} from '../../types/leave-request.types';

export const getLeaveRequestById = async (id: number): Promise<LeaveRequestResponse> => {
  return apiClient.get(API_ENDPOINTS.LEAVE_REQUESTS.DETAIL(id));
};

export const getLeaveRequestsByUser = async (userId: number): Promise<LeaveRequestResponse[]> => {
  return apiClient.get(API_ENDPOINTS.LEAVE_REQUESTS.BY_USER(userId));
};

export const createLeaveRequest = async (leaveRequest: LeaveRequestCreate): Promise<LeaveRequestResponse> => {
  return apiClient.post(API_ENDPOINTS.LEAVE_REQUESTS.BASE, leaveRequest);
};

export const updateLeaveStatus = async (id: number, status: LeaveStatus): Promise<LeaveRequestResponse> => {
  return apiClient.patch(`${API_ENDPOINTS.LEAVE_REQUESTS.DETAIL(id)}/status`, null, {
    params: { status }
  });
};

export const deleteLeaveRequest = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.LEAVE_REQUESTS.DETAIL(id));
};

export const getLeaveRequests = async (
  page = 1,
  pageSize = 20,
  filters?: {
    status?: LeaveStatus[];
    start_date_from?: string;
    start_date_to?: string;
    leave_type?: string;
  }
): Promise<LeaveRequestListResponse> => {
  return apiClient.get(API_ENDPOINTS.LEAVE_REQUESTS.BASE, {
    params: {
      page,
      page_size: pageSize,
      ...filters
    }
  });
};