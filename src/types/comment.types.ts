import { UserBasicInfo } from "./user.types";

export interface CommentBase {
  content: string;
}

export interface CommentCreate extends CommentBase {
  task_id: number;
  user_id: number;
}

export interface CommentUpdate extends CommentBase {
}

export interface CommentResponse {
  id: number;
  content: string;
  user_id: number;
  created_at: string;
  user?: UserBasicInfo;
}

export interface CommentListResponse {
  items: CommentResponse[];
  total: number;
  page: number;
  page_size: number;
}

export interface CommentFilter {
  taskId?: string;
  createdBy?: string;
  startDate?: string;
  endDate?: string;
}