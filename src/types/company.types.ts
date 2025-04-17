export interface Company {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyCreate {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
}

export interface CompanyUpdate {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
}

export interface CompanyListResponse {
  items: Company[];
  total: number;
  page: number;
  page_size: number;
}