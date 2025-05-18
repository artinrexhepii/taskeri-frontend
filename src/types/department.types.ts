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
