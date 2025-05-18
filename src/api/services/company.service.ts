import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  CompanyCreate, 
  CompanyUpdate, 
  CompanyResponse 
} from '../../types/company.types';

export const getCompanies = async (): Promise<CompanyResponse[]> => {
  return apiClient.get(API_ENDPOINTS.COMPANIES.BASE);
};

export const getCompanyById = async (id: number): Promise<CompanyResponse> => {
  return apiClient.get(API_ENDPOINTS.COMPANIES.DETAIL(id));
};

export const createCompany = async (company: CompanyCreate): Promise<CompanyResponse> => {
  return apiClient.post(API_ENDPOINTS.COMPANIES.BASE, company);
};

export const updateCompany = async (id: number, company: CompanyUpdate): Promise<CompanyResponse> => {
  return apiClient.put(API_ENDPOINTS.COMPANIES.DETAIL(id), company);
};

export const deleteCompany = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.COMPANIES.DETAIL(id));
};