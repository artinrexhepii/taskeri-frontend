import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  RolePermissionCreate,
  RolePermissionResponse,
  PermissionResponse
} from '../../types/role-permission.types';

export const getRolePermissions = async (): Promise<RolePermissionResponse[]> => {
  return apiClient.get('/role-permissions/');
};

export const addPermissionToRole = async (roleId: number, permissionId: number): Promise<RolePermissionResponse> => {
  return apiClient.post(API_ENDPOINTS.ROLE_PERMISSIONS.ADD_PERMISSION(roleId, permissionId), {});
};

export const removePermissionFromRole = async (roleId: number, permissionId: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ROLE_PERMISSIONS.ADD_PERMISSION(roleId, permissionId));
};