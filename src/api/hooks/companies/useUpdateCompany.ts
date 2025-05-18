import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCompany } from '../../services/company.service';
import { CompanyUpdate, CompanyResponse } from '../../../types/company.types';

interface UpdateCompanyVariables {
  id: number;
  companyData: CompanyUpdate;
}

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CompanyResponse, Error, UpdateCompanyVariables>({
    mutationFn: ({ id, companyData }) => updateCompany(id, companyData),
    onSuccess: () => {
      // Invalidate company query
      queryClient.invalidateQueries({ queryKey: ['company'] });
    },
  });
};