import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  RoleCreate, 
  RoleUpdate, 
  RoleResponse 
} from '../../types/role-permission.types';

export const getRoles = async (): Promise<RoleResponse[]> => {
  return apiClient.get(API_ENDPOINTS.ROLES.BASE);
};

export const getRoleById = async (id: number): Promise<RoleResponse> => {
  return apiClient.get(API_ENDPOINTS.ROLES.DETAIL(id));
};

export const createRole = async (role: RoleCreate): Promise<RoleResponse> => {
  return apiClient.post(API_ENDPOINTS.ROLES.BASE, role);
};

export const updateRole = async (id: number, role: RoleUpdate): Promise<RoleResponse> => {
  return apiClient.put(API_ENDPOINTS.ROLES.DETAIL(id), role);
};

export const deleteRole = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ROLES.DETAIL(id));
};