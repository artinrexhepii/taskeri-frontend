export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface ApiError {
  status_code: number;
  detail: string;
  message?: string;
}

export interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}