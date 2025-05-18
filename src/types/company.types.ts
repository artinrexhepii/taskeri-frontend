export interface CompanyCreate {
  name: string;
  industry?: string;
  country?: string;
}

export interface CompanyUpdate {
  name?: string;
  industry?: string;
  country?: string;
}

export interface CompanyResponse {
  id: number;
  name: string;
  industry?: string;
  country?: string;
  created_at: string;
}

export interface CompanySettingsBase {
  timezone: string;
  work_hours_per_day: number;
}

export interface CompanySettingsCreate extends CompanySettingsBase {
  company_id: number;
}

export interface CompanySettingsUpdate {
  timezone?: string;
  work_hours_per_day?: number;
}

export interface CompanySettingsResponse extends CompanySettingsBase {
  company_id: number;
}

// For backward compatibility
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

export interface CompanyListResponse {
  items: Company[];
  total: number;
  page: number;
  page_size: number;
}