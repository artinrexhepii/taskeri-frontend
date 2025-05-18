import { RoleResponse, PermissionResponse } from "./role-permission.types";

export interface Permission extends PermissionResponse {
  description?: string;
}

export interface Role extends RoleResponse {
  description?: string;
  permissions?: Permission[];
}
