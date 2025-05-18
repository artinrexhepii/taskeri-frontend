import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateInvoice } from '../../services/invoice.service';
import { InvoiceUpdate, InvoiceResponse } from '../../../types/invoice.types';

export const useUpdateInvoice = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation<InvoiceResponse, Error, InvoiceUpdate>({
    mutationFn: (invoice) => updateInvoice(id, invoice),
    onSuccess: () => {
      // Invalidate specific invoice query
      queryClient.invalidateQueries({ queryKey: ['invoices', id] });
      
      // Invalidate all invoices query
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export default useUpdateInvoice;