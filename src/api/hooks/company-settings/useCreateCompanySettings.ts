import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCompanySettings } from '../../services/company-settings.service';
import { CompanySettingsCreate, CompanySettingsResponse } from '../../../types/company.types';

export const useCreateCompanySettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CompanySettingsResponse, Error, CompanySettingsCreate>({
    mutationFn: (settingsData) => createCompanySettings(settingsData),
    onSuccess: () => {
      // Invalidate company settings query
      queryClient.invalidateQueries({ queryKey: ['company-settings'] });
    },
  });
};