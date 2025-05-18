import { RoleResponse, PermissionResponse } from "./role-permission.types";

export interface Permission extends PermissionResponse {
  description?: string;
}

export interface Role extends RoleResponse {
  description?: string;
  permissions?: Permission[];
}

// For backward compatibility
export interface RoleCreate {
  name: string;
  description?: string;
  permission_ids?: number[];
}

export interface RoleUpdate {
  name?: string;
  description?: string;
  permission_ids?: number[];
}

export interface RoleListResponse {
  items: Role[];
  total: number;
  page: number;
  page_size: number;
}

export interface UserRoleAssignment {
  user_id: number;
  role_id: number;
}