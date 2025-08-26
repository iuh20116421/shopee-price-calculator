// Base API Response Types
export interface BaseApiResponse {
  success: boolean;
  message: string;
}

export interface ApiError extends BaseApiResponse {
  success: false;
  error?: string;
}

export interface ApiSuccess<T = any> extends BaseApiResponse {
  success: true;
  data?: T;
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// User Types
export interface User {
  id: string;
  name: string;
  phone: string;
  shopLink?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  phone: string;
  password: string;
  shopLink?: string;
  role?: 'user' | 'admin';
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface AuthResponse {
  success: true;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    phone: string;
    shopLink?: string;
    role: 'user' | 'admin';
  };
}

export interface UserProfileResponse {
  success: true;
  user: User;
}

// Local Storage Types
export interface StoredAuthData {
  token: string;
  user: User;
  expiresAt: number;
}

// Request Config Types
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}
