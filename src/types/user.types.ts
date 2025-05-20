import { RoleResponse } from "./role-permission.types";

export interface UserBase {
  email: string;
  first_name: string;
  last_name: string;
  department_id: number | null;
  team_id: number | null;
}

export interface UserCreate extends UserBase {
  password: string;
  role_id?: number;
}

export interface UserUpdate {
  email?: string;
  first_name?: string;
  last_name?: string;
  department_id?: number | null;
  team_id?: number | null;
}

export interface UserResponse extends UserBase {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface UserDetails {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  department_id: number | null;
  team_id: number | null;
  role_id: number;
  tenant_schema?: string;
  tenant_id?: number;
  roles?: RoleResponse[];
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface TenantUserCreate {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  tenant_schema: string;
}

export interface TenantUserResponse {
  id: number;
  email: string;
  tenant_schema: string;
  created_at: string;
}

export interface UserBasicInfo {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

