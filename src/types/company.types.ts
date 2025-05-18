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