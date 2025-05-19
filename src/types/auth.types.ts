import { UserDetails } from "./user.types";

export interface LoginRequest {
  email: string;
  password: string;
  user?: {
    email: string;
    first_name: string;
    last_name: string;
    department_id: number | null;
    team_id: number | null;
    id: number;
    created_at: string;
    updated_at: string;
  };
}

export interface TenantRegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  company_name: string;
  tenant_schema: string;
}

export interface RegisterResponse {
  message: string;
  user_id: number;
  tenant_id: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    email: string;
    first_name: string;
    last_name: string;
    department_id: number | null;
    team_id: number | null;
    id: number;
    created_at: string;
    updated_at: string;
  };
}