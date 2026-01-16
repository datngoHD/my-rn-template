/**
 * Auth Repository
 * 
 * Data layer for authentication.
 * Handles API calls and data transformation.
 */

import { apiClient, ApiResponse } from '../../../core/api/api-client';
import { LoginCredentials, SignUpData, AuthTokens, User } from '../domain/auth.types';

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface SignUpResponse {
  user: User;
  tokens: AuthTokens;
}

class AuthRepository {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response: ApiResponse<LoginResponse> = await apiClient.post('/auth/login', credentials);
    
    if (!response.success || !response.data) {
      throw new Error('Login failed');
    }

    return response.data;
  }

  async signUp(data: SignUpData): Promise<SignUpResponse> {
    const response: ApiResponse<SignUpResponse> = await apiClient.post('/auth/signup', data);
    
    if (!response.success || !response.data) {
      throw new Error('Sign up failed');
    }

    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response: ApiResponse<AuthTokens> = await apiClient.post('/auth/refresh', {
      refreshToken,
    });
    
    if (!response.success || !response.data) {
      throw new Error('Token refresh failed');
    }

    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response: ApiResponse<User> = await apiClient.get('/auth/me');
    
    if (!response.success || !response.data) {
      throw new Error('Failed to get current user');
    }

    return response.data;
  }
}

export const authRepository = new AuthRepository();




