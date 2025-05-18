import { UserBasicInfo } from "./user.types";

export interface ActivityLogCreate {
  user_id: number;
  action: string;
  entity_type: string;
  entity_id: number;
  details?: string;
}

export interface ActivityLogResponse {
  id: number;
  user_id: number;
  user?: UserBasicInfo;
  action: string;
  entity_type: string;
  entity_id: number;
  details?: string;
  created_at: string;
}