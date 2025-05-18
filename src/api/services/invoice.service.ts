import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  InvoiceCreate, 
  InvoiceUpdate, 
  InvoiceResponse 
} from '../../types/invoice.types';

export const getInvoices = async (): Promise<InvoiceResponse[]> => {
  return apiClient.get(API_ENDPOINTS.INVOICES.BASE);
};

export const getInvoiceById = async (id: number): Promise<InvoiceResponse> => {
  return apiClient.get(API_ENDPOINTS.INVOICES.DETAIL(id));
};

export const createInvoice = async (invoice: InvoiceCreate): Promise<InvoiceResponse> => {
  return apiClient.post(API_ENDPOINTS.INVOICES.BASE, invoice);
};

export const updateInvoice = async (id: number, invoice: InvoiceUpdate): Promise<InvoiceResponse> => {
  return apiClient.put(API_ENDPOINTS.INVOICES.DETAIL(id), invoice);
};

export const deleteInvoice = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.INVOICES.DETAIL(id));
};