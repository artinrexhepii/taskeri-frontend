import { DepartmentBasicInfo } from "./department.types";
import { ProjectBasicInfo } from "./project.types";
import { UserBasicInfo } from "./user.types";

export interface TeamBasicInfo {
  id: number;
  name: string;
}

export interface TeamCreate {
  name: string;
  department_id: number;
  description?: string;
  member_ids?: number[];
}

export interface TeamUpdate {
  name?: string;
  department_id?: number;
  description?: string;
  member_ids?: number[];
}

export interface TeamResponse {
  id: number;
  name: string;
  department_id?: number;
}

export interface TeamStatistics {
  stats: Record<number, number>; // department_id -> number of teams
}

// For backward compatibility
export interface Team extends TeamBasicInfo {
  description?: string;
  department_id?: number;
  created_at: string;
  updated_at: string;
}

export interface TeamDetailResponse extends Team {
  members?: UserBasicInfo[];
  department?: DepartmentBasicInfo;
  projects?: ProjectBasicInfo[];
}

export interface TeamListResponse {
  items: Team[];
  total: number;
  page: number;
  page_size: number;
}

export interface TeamMember {
  team_id: number;
  user_id: number;
  role?: string;
}