import { Role } from "./role.types";
import { UserBasicInfo } from "./user.types";

export interface TenantUser {
  id: number;
  user_id: number;
  tenant_id: number;
  team_id?: number ;
  department_id?: number;
  role_id?: number;
  created_at: string;
  updated_at: string;
  user?: UserBasicInfo;
  role?: Role;
}

export interface TenantUserCreate {
  user_id: number;
  role_id?: number;
}

export interface TenantUserUpdate {
  role_id?: number;
}

export interface TenantUserListResponse {
  items: TenantUser[];
  total: number;
  page: number;
  page_size: number;
}