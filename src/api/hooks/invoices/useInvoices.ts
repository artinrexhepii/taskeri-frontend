import { useQuery } from '@tanstack/react-query';
import { getInvoices } from '../../services/invoice.service';
import { InvoiceResponse } from '../../../types/invoice.types';

export const useInvoices = (enabled = true) => {
  return useQuery<InvoiceResponse[], Error>({
    queryKey: ['invoices'],
    queryFn: getInvoices,
    enabled,
  });
};

export default useInvoices;