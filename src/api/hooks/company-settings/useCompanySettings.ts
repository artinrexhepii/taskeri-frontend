import { useQuery } from '@tanstack/react-query';
import { getCompanySettings } from '../../services/company-settings.service';
import { CompanySettingsResponse } from '../../../types/company.types';

export const useCompanySettings = (companyId: number) => {
  return useQuery<CompanySettingsResponse, Error>({
    queryKey: ['company-settings', companyId],
    queryFn: () => getCompanySettings(companyId),
  });
};