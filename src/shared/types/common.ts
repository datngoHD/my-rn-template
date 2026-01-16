/**
 * Common Types
 * 
 * Shared types used across the application.
 */

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: string[];
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}





