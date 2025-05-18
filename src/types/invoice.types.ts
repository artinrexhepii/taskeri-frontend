export type InvoiceStatus = "Pending" | "Paid";

export interface InvoiceCreate {
  company_id: number;
  amount: number;
  status?: InvoiceStatus;
}

export interface InvoiceUpdate {
  amount?: number;
  status?: InvoiceStatus;
}

export interface InvoiceResponse {
  id: number;
  company_id: number;
  amount: number;
  issued_at: string;
  status: string;
}