// src/api/hooks/company-settings/useCompanySettings.ts
import { useQuery } from '@tanstack/react-query';
import { getCompanySettings } from '../../services/company-settings.service';
import { CompanySettingsResponse } from '../../../types/company.types';

export const useCompanySettings = (companyId: number | null) => {
  return useQuery<CompanySettingsResponse, Error>({
    queryKey: ['company-settings', companyId],
    queryFn: () => getCompanySettings(companyId!), // `!` because it's guarded by `enabled`
    enabled: !!companyId, // ✅ prevents call when companyId is 0 or null
  });
};
