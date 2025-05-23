// src/api/hooks/companies/useCompany.ts
import { useQuery } from '@tanstack/react-query';
import { getCompanyById } from '../../services/company.service';
import { CompanyResponse } from '../../../types/company.types';

export const useCompanyById = (id: number) => {
  return useQuery<CompanyResponse, Error>({
    queryKey: ['company', id],
    queryFn: () => getCompanyById(id),
    enabled: !!id,
  });
};
