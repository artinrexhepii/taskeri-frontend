export interface ApiError {
  status: number;
  message: string;
  detail?: string;
  errors?: Record<string, string[]>;
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

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}