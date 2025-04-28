import api from './index';
import { 
  Company, 
  CompanyCreate, 
  CompanyUpdate,
  CompanyListResponse
} from '../types/company.types';

const CompanyService = {
  /**
   * Get paginated list of companies
   */
  getCompanies: async (page = 1, pageSize = 20): Promise<CompanyListResponse> => {
    return api.get<CompanyListResponse>('/companies', { 
      page, 
      page_size: pageSize 
    });
  },
  
  /**
   * Get a specific company by ID
   */
  getCompany: async (companyId: number): Promise<Company> => {
    return api.get<Company>(`/companies/${companyId}`);
  },
  
  /**
   * Create a new company
   */
  createCompany: async (data: CompanyCreate): Promise<Company> => {
    return api.post<Company>('/companies', data);
  },
  
  /**
   * Update an existing company
   */
  updateCompany: async (companyId: number, data: CompanyUpdate): Promise<Company> => {
    return api.put<Company>(`/companies/${companyId}`, data);
  },
  
  /**
   * Delete a company
   */
  deleteCompany: async (companyId: number): Promise<{ message: string }> => {
    return api.del<{ message: string }>(`/companies/${companyId}`);
  },
  
  /**
   * Upload company logo
   */
  uploadCompanyLogo: async (companyId: number, file: File): Promise<Company> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post<Company>(`/companies/${companyId}/logo`, formData);
  }
};

export default CompanyService;