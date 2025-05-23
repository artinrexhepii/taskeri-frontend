import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCompany } from '../../services/company.service';

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (companyId) => deleteCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company'] });
    },
  });
};
