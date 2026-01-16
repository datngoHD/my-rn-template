/**
 * Auth Domain Types
 * 
 * Domain layer types for authentication feature.
 * These represent business logic concepts, not API responses.
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  tenantId: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  tenantId?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}





