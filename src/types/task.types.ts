import { CommentResponse } from "./comment.types";
import { FileAttachmentResponse } from "./file.types";
import { ProjectBasicInfo } from "./project.types";
import { UserBasicInfo } from "./user.types";

export type StatusEnum = 'To Do' | 'In Progress' | 'Technical Review' | 'Done';
export type PriorityEnum = 'Low' | 'Medium' | 'High';

export interface TaskBase {
  name: string;
  project_id: number;
  description?: string;
  priority: PriorityEnum;
  status: StatusEnum;
  due_date?: string; // ISO date string
}

export interface Task extends TaskBase {
  id: number;
  created_at: string;
  updated_at: string;
  assigned_users?: number[];
}

export interface TaskCreate extends TaskBase {
  assigned_user_ids?: number[];
}

export interface TaskUpdate {
  name?: string;
  project_id?: number;
  description?: string;
  priority?: PriorityEnum;
  status?: StatusEnum;
  due_date?: string;
  assigned_user_ids?: number[];
}

export interface TaskDetail extends Task {
  assigned_users_details?: UserBasicInfo[];
  comments?: CommentResponse[];
  attachments?: FileAttachmentResponse[];
  project?: ProjectBasicInfo;
}

export interface TaskListResponse {
  items: Task[];
  total: number;
  page: number;
  page_size: number;
}

export interface TaskFilterParams {
  status?: StatusEnum[];
  priority?: PriorityEnum[];
  due_date_from?: string;
  due_date_to?: string;
  assigned_to_user_id?: number;
  project_id?: number;
  search_term?: string;
}

export interface TaskStatistics {
  total_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  tasks_by_status: Record<string, number>;
  tasks_by_priority: Record<string, number>;
}