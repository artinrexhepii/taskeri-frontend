import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { TenantUserCreate, TenantUser, TenantUserListResponse } from '../../types/tenant.types';
import { TenantRegisterRequest, RegisterResponse } from '../../types/auth.types';
import { UserUpdate } from '../../types/user.types';

/**
 * Register a new tenant (company) with an admin user
 * @param data - Registration data including company and admin user details
 */
export const registerTenant = async (data: TenantRegisterRequest): Promise<RegisterResponse> => {
  return apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER_TENANT, data);
};

/**
 * Get all users for a specific tenant
 * @param tenantId - ID of the tenant
 * @param page - Page number for pagination
 * @param pageSize - Number of items per page
 */
export const getTenantUsers = async (
  tenantId: number,
  page = 1,
  pageSize = 10
): Promise<TenantUserListResponse> => {
  const response = await apiClient.get<any[]>(`/users`);
  return {
    items: response.map(user => ({
      id: user.id,
      user_id: user.id,
      tenant_id: tenantId,
      role_id: user.role_id,
      department_id: user.department_id,
      team_id: user.team_id, 
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      }
    })),
    total: response.length,
    page: page,
    page_size: pageSize
  };
};

/**
 * Add a new user to a tenant
 * @param tenantId - ID of the tenant
 * @param userData - User data including email, name, password, and role
 */
export const addUserToTenant = async (
  tenantId: number,
  userData: any
): Promise<TenantUser> => {
  return apiClient.post<TenantUser>(API_ENDPOINTS.TENANTS.ADD_USER(tenantId), userData);
};

/**
 * Update a tenant user's information
 * @param tenantId - ID of the tenant
 * @param userId - ID of the user to update
 * @param data - User update data (email, first_name, last_name, department_id, team_id)
 */
export const updateTenantUser = async (
  tenantId: number,
  userId: number,
  data: UserUpdate
): Promise<TenantUser> => {
  return apiClient.put<TenantUser>(
    API_ENDPOINTS.USERS.DETAIL(userId),
    data
  );
};

/**
 * Remove a user from a tenant
 * @param tenantId - ID of the tenant
 * @param userId - ID of the user to remove
 */
export const removeUserFromTenant = async (
  tenantId: number,
  userId: number
): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.TENANTS.USERS(tenantId)}/${userId}`);
};

/**
 * Get tenant details
 * @param tenantId - ID of the tenant
 */
export const getTenantDetails = async (tenantId: number): Promise<any> => {
  const response = await apiClient.get(API_ENDPOINTS.TENANTS.DETAIL(tenantId));
  return response;
};