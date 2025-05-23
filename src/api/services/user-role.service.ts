import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { RoleResponse } from '../../types/role-permission.types';

export const getUserRoles = async (userId: number): Promise<RoleResponse[]> => {
  return apiClient.get(API_ENDPOINTS.USER_ROLES.USER_ROLES(userId));
};

export const assignRoleToUser = async (userId: number, roleId: number): Promise<{message: string}> => {
  return apiClient.put(API_ENDPOINTS.USER_ROLES.ASSIGN_ROLE(userId, roleId), {});
};

export const removeRoleFromUser = async (userId: number, roleId: number): Promise<{message: string}> => {
  return apiClient.delete(API_ENDPOINTS.USER_ROLES.ASSIGN_ROLE(userId, roleId));
};