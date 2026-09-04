/**
 * API Types — synced FE/BE
 * Standard REST envelope
 */

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  framework?: string;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StatsResponse {
  totalStandards: number;
  activeMcps: number;
  templatesUsed: number;
  avgFeatures: number;
  trends?: {
    standards: string;
    mcps: string;
    templates: string;
  };
}
