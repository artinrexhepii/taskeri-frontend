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
}

export interface TeamUpdate {
  name?: string;
  department_id?: number;
}

export interface TeamResponse {
  id: number;
  name: string;
  department_id?: number;
}

export interface TeamStatistics {
  stats: Record<number, number>; 
}
