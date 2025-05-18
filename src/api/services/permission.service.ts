import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  PermissionCreate, 
  PermissionUpdate, 
  PermissionResponse 
} from '../../types/role-permission.types';

export const getPermissions = async (): Promise<PermissionResponse[]> => {
  return apiClient.get(API_ENDPOINTS.PERMISSIONS.BASE);
};

export const getPermissionById = async (id: number): Promise<PermissionResponse> => {
  return apiClient.get(API_ENDPOINTS.PERMISSIONS.DETAIL(id));
};

export const createPermission = async (permission: PermissionCreate): Promise<PermissionResponse> => {
  return apiClient.post(API_ENDPOINTS.PERMISSIONS.BASE, permission);
};

export const updatePermission = async (id: number, permission: PermissionUpdate): Promise<PermissionResponse> => {
  return apiClient.put(API_ENDPOINTS.PERMISSIONS.DETAIL(id), permission);
};

export const deletePermission = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.PERMISSIONS.DETAIL(id));
};