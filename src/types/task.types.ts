import { CommentResponse } from "./comment.types";
import { FileAttachmentResponse } from "./file.types";
import { ProjectBasicInfo } from "./project.types";
import { UserBasicInfo } from "./user.types";

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High"
}

export enum TaskStatus {
  TODO = "To Do",
  IN_PROGRESS = "In Progress",
  TECHNICAL_REVIEW = "Technical Review",
  DONE = "Done"
}

export interface TaskBase {
  name: string;
  project_id: number;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string;
}

export interface TaskCreate extends TaskBase {
  assigned_user_ids?: number[];
}

export interface TaskUpdate {
  name?: string;
  project_id?: number;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  due_date?: string;
  assigned_user_ids?: number[];
}

export interface TaskResponse extends TaskBase {
  id: number;
  created_at: string;
  updated_at: string;
  assigned_users?: number[];
}

export interface TaskDetailResponse extends TaskResponse {
  comments?: CommentResponse[];
  file_attachments?: FileAttachmentResponse[];
  assigned_users_details?: UserBasicInfo[];
  project?: ProjectBasicInfo;
}

export interface TaskFilterParams {
  status?: TaskStatus[];
  priority?: TaskPriority[];
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

// For backward compatibility
export type StatusEnum = TaskStatus;
export type PriorityEnum = TaskPriority;
export type Task = TaskResponse;
export type TaskDetail = TaskDetailResponse;