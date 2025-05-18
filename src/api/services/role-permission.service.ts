import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  RolePermissionCreate,
  RolePermissionResponse,
  PermissionResponse
} from '../../types/role-permission.types';

export const getRolePermissions = async (roleId: number): Promise<PermissionResponse[]> => {
  return apiClient.get(API_ENDPOINTS.ROLE_PERMISSIONS.ROLE_PERMISSIONS(roleId));
};

export const addPermissionToRole = async (roleId: number, permissionId: number): Promise<RolePermissionResponse> => {
  return apiClient.post(API_ENDPOINTS.ROLE_PERMISSIONS.ADD_PERMISSION(roleId, permissionId), {});
};

export const removePermissionFromRole = async (roleId: number, permissionId: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ROLE_PERMISSIONS.ADD_PERMISSION(roleId, permissionId));
};