import { UserDetails } from "./user.types";

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