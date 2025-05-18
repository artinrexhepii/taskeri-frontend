import api from './index';
import { 
  Role, 
  RoleCreate, 
  RoleUpdate,
  RoleListResponse,
  UserRoleAssignment,
  Permission
} from '../types/role.types';

const RoleService = {
  /**
   * Get paginated list of roles
   */
  getRoles: async (page = 1, pageSize = 20): Promise<RoleListResponse> => {
    return api.get<RoleListResponse>('/roles', { 
      page, 
      page_size: pageSize 
    });
  },
  
  /**
   * Get a specific role by ID
   */
  getRole: async (roleId: number): Promise<Role> => {
    return api.get<Role>(`/roles/${roleId}`);
  },
  
  /**
   * Create a new role
   */
  createRole: async (data: RoleCreate): Promise<Role> => {
    return api.post<Role>('/roles', data);
  },
  
  /**
   * Update an existing role
   */
  updateRole: async (roleId: number, data: RoleUpdate): Promise<Role> => {
    return api.put<Role>(`/roles/${roleId}`, data);
  },
  
  /**
   * Delete a role
   */
  deleteRole: async (roleId: number): Promise<{ message: string }> => {
    return api.del<{ message: string }>(`/roles/${roleId}`);
  },
  
  /**
   * Get permissions for a role
   */
  getRolePermissions: async (roleId: number): Promise<Permission[]> => {
    return api.get<Permission[]>(`/roles/${roleId}/permissions`);
  },
  
  /**
   * Assign permissions to a role
   */
  assignPermissionsToRole: async (roleId: number, permissionIds: number[]): Promise<Role> => {
    return api.post<Role>(`/roles/${roleId}/permissions`, { permission_ids: permissionIds });
  },
  
  /**
   * Get users with a specific role
   */
  getUsersWithRole: async (roleId: number): Promise<UserRoleAssignment[]> => {
    return api.get<UserRoleAssignment[]>(`/roles/${roleId}/users`);
  },
  
  /**
   * Get all permissions
   */
  getAllPermissions: async (): Promise<Permission[]> => {
    return api.get<Permission[]>('/permissions');
  }
};

export default RoleService;