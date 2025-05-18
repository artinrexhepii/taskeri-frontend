import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInvoice } from '../../services/invoice.service';
import { InvoiceCreate, InvoiceResponse } from '../../../types/invoice.types';

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation<InvoiceResponse, Error, InvoiceCreate>({
    mutationFn: (invoice) => createInvoice(invoice),
    onSuccess: () => {
      // Invalidate invoices query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
};

export default useCreateInvoice;