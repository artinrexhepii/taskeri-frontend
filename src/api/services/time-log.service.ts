import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  TimeLogCreate, 
  TimeLogUpdate, 
  TimeLogResponse 
} from '../../types/time-logging.types';
import { PaginatedResponse } from '../../types/api.types';

// Get time log by ID
export const getTimeLogById = async (id: number): Promise<TimeLogResponse> => {
  return apiClient.get(API_ENDPOINTS.TIME_LOGS.DETAIL(id));
};

// Get all time logs by task
export const getTimeLogsByTask = async (taskId: number): Promise<TimeLogResponse[]> => {
  return apiClient.get(API_ENDPOINTS.TIME_LOGS.BY_TASK(taskId));
};

// Get all time logs by user
export const getTimeLogsByUser = async (userId: number): Promise<TimeLogResponse[]> => {
  return apiClient.get(API_ENDPOINTS.TIME_LOGS.BY_USER(userId));
};

// Get my time logs (current user)
export const getMyTimeLogs = async (): Promise<TimeLogResponse[]> => {
  return apiClient.get(`${API_ENDPOINTS.TIME_LOGS.BASE}/my`);
};

// Get time logs by user and time range
export const getUserLogsByTimeRange = async (
  userId: number, 
  startDate: Date, 
  endDate: Date
): Promise<TimeLogResponse[]> => {
  return apiClient.get(`${API_ENDPOINTS.TIME_LOGS.BY_USER(userId)}/by-time`, {
    params: {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    }
  });
};

// Create a new time log
export const createTimeLog = async (timeLog: TimeLogCreate): Promise<TimeLogResponse> => {
  return apiClient.post(API_ENDPOINTS.TIME_LOGS.BASE, timeLog);
};

// Update an existing time log
export const updateTimeLog = async (id: number, timeLog: TimeLogUpdate): Promise<TimeLogResponse> => {
  return apiClient.put(API_ENDPOINTS.TIME_LOGS.DETAIL(id), timeLog);
};

// Delete a time log
export const deleteTimeLog = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.TIME_LOGS.DETAIL(id));
};

export const getTaskTimeLogs = async (taskId: number): Promise<TimeLogResponse[]> => {
    return apiClient.get(API_ENDPOINTS.TIME_LOGS.BY_TASK(taskId));
  };
  
  export const getUserTimeLogs = async (userId: number): Promise<TimeLogResponse[]> => {
    return apiClient.get(API_ENDPOINTS.TIME_LOGS.BY_USER(userId));
  };