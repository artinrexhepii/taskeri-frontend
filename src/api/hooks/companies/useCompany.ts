import { useQuery } from '@tanstack/react-query';
import { getCompanies } from '../../services/company.service';
import { CompanyResponse } from '../../../types/company.types';

export const useCompany = () => {
  return useQuery<CompanyResponse[], Error>({
    queryKey: ['company'],
    queryFn: getCompanies,
  });
};