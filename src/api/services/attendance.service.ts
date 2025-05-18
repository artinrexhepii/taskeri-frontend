import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { AttendanceResponse } from '../../types/time-logging.types';

export const checkIn = async (): Promise<AttendanceResponse> => {
  return apiClient.post(API_ENDPOINTS.ATTENDANCE.CHECK_IN, {});
};

export const checkOut = async (): Promise<AttendanceResponse> => {
  return apiClient.put(API_ENDPOINTS.ATTENDANCE.CHECK_OUT, {});
};

export const getMyAttendance = async (): Promise<AttendanceResponse[]> => {
  return apiClient.get(`${API_ENDPOINTS.ATTENDANCE.BASE}/my`);
};

export const getUserAttendance = async (userId: number): Promise<AttendanceResponse[]> => {
  return apiClient.get(`${API_ENDPOINTS.ATTENDANCE.BASE}/user/${userId}`);
};