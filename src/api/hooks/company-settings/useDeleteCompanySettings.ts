import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCompanySettings } from '../../services/company-settings.service';

export const useDeleteCompanySettings = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (companyId) => deleteCompanySettings(companyId),
    onSuccess: (_, companyId) => {
      queryClient.invalidateQueries({ queryKey: ['company-settings', companyId] });
    },
  });
};
