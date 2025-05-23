import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  TaskCreate,
  TaskUpdate, 
  TaskResponse, 
  TaskDetailResponse,
  TaskFilterParams,
  TaskStatistics
} from '../../types/task.types';
import { PaginatedResponse } from '../../types/api.types';

export const getTasks = async (
  page = 1, 
  pageSize = 10, 
  filters?: TaskFilterParams
): Promise<PaginatedResponse<TaskDetailResponse>> => {
  
  return apiClient.get(API_ENDPOINTS.TASKS.BASE, {
    params: {
      page,
      page_size: pageSize,
      include: ['assigned_users_details'],
      ...filters
    }
  });
};

export const getTaskById = async (id: number): Promise<TaskResponse> => {
  return apiClient.get(API_ENDPOINTS.TASKS.DETAIL(id));
};

export const getTaskDetails = async (id: number): Promise<TaskDetailResponse> => {
  return apiClient.get(API_ENDPOINTS.TASKS.DETAILS(id));
};

export const createTask = async (task: TaskCreate): Promise<TaskResponse> => {
  return apiClient.post(API_ENDPOINTS.TASKS.BASE, task);
};

export const updateTask = async (id: number, task: TaskUpdate): Promise<TaskResponse> => {
  return apiClient.put(API_ENDPOINTS.TASKS.DETAIL(id), task);
};

export const deleteTask = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.TASKS.DETAIL(id));
};

export const getTasksByProject = async (projectId: number): Promise<TaskResponse[]> => {
  return apiClient.get(API_ENDPOINTS.TASKS.BY_PROJECT(projectId));
};

export const getTasksByUser = async (userId: number): Promise<TaskResponse[]> => {
  return apiClient.get(API_ENDPOINTS.TASKS.BY_USER(userId));
};

export const getTaskStatistics = async (): Promise<TaskStatistics> => {
  return apiClient.get(API_ENDPOINTS.TASKS.STATISTICS);
};