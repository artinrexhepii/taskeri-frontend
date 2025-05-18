import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCompanySettings } from '../../services/company-settings.service';
import { CompanySettingsUpdate, CompanySettingsResponse } from '../../../types/company.types';

export const useUpdateCompanySettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CompanySettingsResponse, Error, { id: number; settingsData: CompanySettingsUpdate }>({
    mutationFn: ({ id, settingsData }) => updateCompanySettings(id, settingsData),
    onSuccess: () => {
      // Invalidate company settings query
      queryClient.invalidateQueries({ queryKey: ['company-settings'] });
    },
  });
};