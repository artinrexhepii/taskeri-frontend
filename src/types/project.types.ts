import { Task } from "./task.types";
import { TeamBasicInfo } from "./team.types";

export interface ProjectBasicInfo {
  id: number;
  name: string;
}

export interface Project extends ProjectBasicInfo {
  description?: string;
  created_at: string;
  updated_at: string;
  start_date?: string;
  end_date?: string;
  status: string;
  team_id?: number;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  team_id?: number;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  team_id?: number;
}

export interface ProjectListResponse {
  items: Project[];
  total: number;
  page: number;
  page_size: number;
}

export interface ProjectFilterParams {
  status?: string[];
  team_id?: number;
  search?: string;
}

export interface ProjectDetailResponse extends Project {
  tasks?: Task[];
  team?: TeamBasicInfo;
}