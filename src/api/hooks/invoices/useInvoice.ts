import { useQuery } from '@tanstack/react-query';
import { getInvoiceById } from '../../services/invoice.service';
import { InvoiceResponse } from '../../../types/invoice.types';

export const useInvoice = (id: number, enabled = true) => {
  return useQuery<InvoiceResponse, Error>({
    queryKey: ['invoices', id],
    queryFn: () => getInvoiceById(id),
    enabled: !!id && enabled,
  });
};

export default useInvoice;