// src/api/hooks/company-settings/useCompanySettings.ts
import { useQuery } from '@tanstack/react-query';
import { getCompanySettings } from '../../services/company-settings.service';
import { CompanySettingsResponse } from '../../../types/company.types';

export const useCompanySettings = (companyId: number | null) => {
  return useQuery<CompanySettingsResponse, Error>({
    queryKey: ['company-settings', companyId],
    queryFn: () => getCompanySettings(companyId!),
    enabled: !!companyId,
  });
};
