import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { RoleResponse } from '../../types/role-permission.types';

/**
 * Get all roles
 */
export const getRoles = async (): Promise<RoleResponse[]> => {
  return apiClient.get(API_ENDPOINTS.ROLES.BASE);
};

/**
 * Get role by ID
 */
export const getRole = async (id: number): Promise<RoleResponse> => {
  return apiClient.get(API_ENDPOINTS.ROLES.DETAIL(id));
};

/**
 * Create a new role
 */
export const createRole = async (data: { name: string; description?: string }): Promise<RoleResponse> => {
  return apiClient.post(API_ENDPOINTS.ROLES.BASE, data);
};

/**
 * Update a role
 */
export const updateRole = async (id: number, data: { name?: string; description?: string }): Promise<RoleResponse> => {
  return apiClient.put(API_ENDPOINTS.ROLES.DETAIL(id), data);
};

/**
 * Delete a role
 */
export const deleteRole = async (id: number): Promise<void> => {
  return apiClient.delete(API_ENDPOINTS.ROLES.DETAIL(id));
};