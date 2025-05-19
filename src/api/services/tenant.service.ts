import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { TenantUserCreate, TenantUserUpdate, TenantUser, TenantUserListResponse } from '../../types/tenant.types';
import { TenantRegisterRequest, RegisterResponse } from '../../types/auth.types';

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
  const response = await apiClient.get<TenantUserListResponse>(
    `${API_ENDPOINTS.TENANTS.USERS(tenantId)}?page=${page}&page_size=${pageSize}`
  );
  return response;
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
 * Update a tenant user (role or active status)
 * @param tenantId - ID of the tenant
 * @param userId - ID of the user to update
 * @param data - Update data (role or active status)
 */
export const updateTenantUser = async (
  tenantId: number,
  userId: number,
  data: TenantUserUpdate
): Promise<TenantUser> => {
  return apiClient.put<TenantUser>(
    `${API_ENDPOINTS.TENANTS.USERS(tenantId)}/${userId}`,
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