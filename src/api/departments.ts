import api from './index';
import { 
  Department, 
  DepartmentCreate, 
  DepartmentUpdate,
  DepartmentDetailResponse,
  DepartmentListResponse
} from '../types/department.types';

const DepartmentService = {
  /**
   * Get paginated list of departments
   */
  getDepartments: async (page = 1, pageSize = 20): Promise<DepartmentListResponse> => {
    return api.get<DepartmentListResponse>('/departments', { 
      page, 
      page_size: pageSize 
    });
  },
  
  /**
   * Get a specific department by ID
   */
  getDepartment: async (departmentId: number): Promise<DepartmentDetailResponse> => {
    return api.get<DepartmentDetailResponse>(`/departments/${departmentId}`);
  },
  
  /**
   * Create a new department
   */
  createDepartment: async (data: DepartmentCreate): Promise<Department> => {
    return api.post<Department>('/departments', data);
  },
  
  /**
   * Update an existing department
   */
  updateDepartment: async (departmentId: number, data: DepartmentUpdate): Promise<Department> => {
    return api.put<Department>(`/departments/${departmentId}`, data);
  },
  
  /**
   * Delete a department
   */
  deleteDepartment: async (departmentId: number): Promise<{ message: string }> => {
    return api.del<{ message: string }>(`/departments/${departmentId}`);
  },
  
  /**
   * Get sub-departments
   */
  getSubDepartments: async (departmentId: number): Promise<Department[]> => {
    return api.get<Department[]>(`/departments/${departmentId}/sub-departments`);
  },
  
  /**
   * Get departments by company
   */
  getDepartmentsByCompany: async (companyId: number): Promise<Department[]> => {
    return api.get<Department[]>(`/companies/${companyId}/departments`);
  }
};

export default DepartmentService;