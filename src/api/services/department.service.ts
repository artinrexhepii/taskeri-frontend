import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  DepartmentCreate, 
  DepartmentUpdate, 
  DepartmentResponse 
} from '../../types/department.types';

export const getDepartments = async (): Promise<DepartmentResponse[]> => {
  return apiClient.get(API_ENDPOINTS.DEPARTMENTS.BASE);
};

export const getDepartmentById = async (id: number): Promise<DepartmentResponse> => {
  return apiClient.get(API_ENDPOINTS.DEPARTMENTS.DETAIL(id));
};

export const createDepartment = async (department: DepartmentCreate): Promise<DepartmentResponse> => {
  return apiClient.post(API_ENDPOINTS.DEPARTMENTS.BASE, department);
};

export const updateDepartment = async (id: number, department: DepartmentUpdate): Promise<DepartmentResponse> => {
  return apiClient.put(API_ENDPOINTS.DEPARTMENTS.DETAIL(id), department);
};

export const deleteDepartment = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.DEPARTMENTS.DETAIL(id));
};