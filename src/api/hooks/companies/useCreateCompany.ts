import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCompany } from '../../services/company.service';
import { CompanyCreate, CompanyResponse } from '../../../types/company.types';

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CompanyResponse, Error, CompanyCreate>({
    mutationFn: (companyData) => createCompany(companyData),
    onSuccess: () => {
      // Invalidate company query
      queryClient.invalidateQueries({ queryKey: ['company'] });
    },
  });
};