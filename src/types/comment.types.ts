import { UserBasicInfo } from "./user.types";

export interface CommentBase {
  content: string;
}

export interface CommentCreate extends CommentBase {
  task_id: number;
  user_id: number;
}

export interface CommentUpdate extends CommentBase {}

export interface CommentResponse {
  id: number;
  content: string;
  user_id: number;
  task_id: number;  
  created_at: string;
  user?: UserBasicInfo;
}