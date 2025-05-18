import { RoleResponse } from "./role-permission.types";
import { Role } from "./role.types";

export interface UserBase {
  email: string;
  first_name: string;
  last_name: string;
  department_id?: number;
  team_id?: number;
}

export interface UserCreate extends UserBase {
  password: string;
  role_id?: number;
}

export interface UserUpdate {
  email?: string;
  first_name?: string;
  last_name?: string;
  department_id?: number;
  team_id?: number;
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
  department_id?: number;
  team_id?: number;
  tenant_schema?: string;
  is_active?: boolean;
  roles?: RoleResponse[];
  permissions?: string[];
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

// Keeping these for backward compatibility if needed
export interface UserProfile {
  id: number;
  user_id: number;
  phone_number?: string;
  address?: string;
  bio?: string;
  preferences?: Record<string, any>;
}

export interface UserListResponse {
  items: User[];
  total: number;
  page: number;
  page_size: number;
}

export interface UserFilterParams {
  search?: string;
  role_id?: number;
  is_active?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface User extends UserBasicInfo {
  roles?: Role[];
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
  profile_image_url?: string;
}