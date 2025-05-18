import { Role } from "./role.types";

export interface UserBasicInfo {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface User extends UserBasicInfo {
  roles?: Role[];
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
  profile_image_url?: string;
}

export interface UserCreate {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  roles?: number[];
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
  profile_image_url?: string;
}

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