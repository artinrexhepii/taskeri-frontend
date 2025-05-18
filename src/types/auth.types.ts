import { UserBasicInfo, UserDetails } from "./user.types";

export interface LoginRequest {
  email: string;
  password: string;
  tenant_id?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserDetails;
}

// Keeping this for backward compatibility if needed
export interface LoginResponse extends AuthResponse {}

export interface TokenRefreshRequest {
  refresh_token: string;
}

export interface TokenRefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}