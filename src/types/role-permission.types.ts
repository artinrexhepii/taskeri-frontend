export interface RoleCreate {
  name: string;
}

export interface RoleUpdate {
  name: string;
}

export interface RoleResponse {
  id: number;
  name: string;
}

export interface PermissionCreate {
  name: string;
}

export interface PermissionUpdate {
  name: string;
}

export interface PermissionResponse {
  id: number;
  name: string;
}

export interface RolePermissionBase {
  role_id: number;
  permission_id: number;
}

export interface RolePermissionCreate extends RolePermissionBase {}

export interface RolePermissionResponse extends RolePermissionBase {}