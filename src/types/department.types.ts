import { TeamBasicInfo } from "./team.types";

export interface DepartmentCreate {
  name: string;
  company_id: number;
}

export interface DepartmentUpdate {
  name?: string;
  company_id?: number;
}

export interface DepartmentResponse {
  id: number;
  name: string;
  company_id: number;
}

export interface DepartmentBasicInfo {
  id: number;
  name: string;
}

// For backward compatibility
export interface Department extends DepartmentBasicInfo {
  description?: string;
  parent_department_id?: number;
  company_id: number;
  created_at: string;
  updated_at: string;
}

export interface DepartmentDetailResponse extends Department {
  teams?: TeamBasicInfo[];
  parent_department?: DepartmentBasicInfo;
  sub_departments?: DepartmentBasicInfo[];
}

export interface DepartmentListResponse {
  items: Department[];
  total: number;
  page: number;
  page_size: number;
}