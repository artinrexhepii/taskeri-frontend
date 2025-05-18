import { TeamBasicInfo } from "./team.types";

export enum ProjectStatus {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  ON_HOLD = "On Hold"
}

export interface ProjectCreate {
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status?: ProjectStatus;
  assigned_user_ids?: number[];
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: ProjectStatus;
  assigned_user_ids?: number[];
}

export interface ProjectResponse {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status: ProjectStatus;
  created_at?: string;
}

export interface ProjectBasicInfo {
  id: number;
  name: string;
}

export interface ProjectStatistics {
  Not_Started: number;
  In_Progress: number;
  Completed: number;
  On_Hold: number;
}