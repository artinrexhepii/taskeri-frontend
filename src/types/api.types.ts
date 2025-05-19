export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ApiError {
  detail: string;
  status_code: number;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}