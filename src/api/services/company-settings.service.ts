import apiClient from '../apiClient';
import { 
  CompanySettingsCreate, 
  CompanySettingsUpdate, 
  CompanySettingsResponse 
} from '../../types/company.types';

export const getCompanySettings = async (companyId: number): Promise<CompanySettingsResponse> => {
  return apiClient.get(`/company-settings/${companyId}`);
};

export const createCompanySettings = async (settings: CompanySettingsCreate): Promise<CompanySettingsResponse> => {
  return apiClient.post('/company-settings', settings);
};

export const updateCompanySettings = async (companyId: number, settings: CompanySettingsUpdate): Promise<CompanySettingsResponse> => {
  return apiClient.put(`/company-settings/${companyId}`, settings);
};

export const deleteCompanySettings = async (companyId: number): Promise<void> => {
  await apiClient.delete(`/company-settings/${companyId}`);
};