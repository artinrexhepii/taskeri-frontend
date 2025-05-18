import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteInvoice } from '../../services/invoice.service';

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => deleteInvoice(id),
    onSuccess: (_, id) => {
      // Invalidate specific invoice query
      queryClient.invalidateQueries({ queryKey: ['invoices', id] });
      
      // Invalidate all invoices query
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export default useDeleteInvoice;