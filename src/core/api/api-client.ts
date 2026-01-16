/**
 * API Client
 *
 * Centralized HTTP client with:
 * - Axios-based implementation
 * - Request/Response interceptors
 * - Token management
 * - Error handling
 * - Retry logic
 * - Request cancellation
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { environmentConfig } from '../config/environment';
import { getTenantConfig } from '../tenant/tenant.config';
import { Logger } from '../logging/logger';

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: string[];
}

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    const tenant = getTenantConfig();

    this.client = axios.create({
      baseURL: tenant.api.baseUrl,
      timeout: tenant.api.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }

        const tenant = getTenantConfig();
        config.headers['X-Tenant-ID'] = tenant.id;

        if (environmentConfig.enableLogging) {
          Logger.debug('API Request', {
            method: config.method,
            url: config.url,
            data: config.data,
          });
        }

        return config;
      },
      (error: AxiosError) => {
        Logger.error('API Request Error', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (environmentConfig.enableLogging) {
          Logger.debug('API Response', {
            status: response.status,
            url: response.config.url,
            data: response.data,
          });
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            if (newToken) {
              this.setAccessToken(newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            Logger.error('Token refresh failed', refreshError);
            this.clearTokens();
            return Promise.reject(refreshError);
          }
        }

        const apiError: ApiError = {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          errors: error.response?.data?.errors || [error.message],
        };

        Logger.error('API Response Error', apiError);

        return Promise.reject(apiError);
      }
    );
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) {
      return null;
    }

    try {
      const response = await axios.post(`${getTenantConfig().api.baseUrl}/auth/refresh`, {
        refreshToken: this.refreshToken,
      });

      return response.data.accessToken || null;
    } catch (error) {
      return null;
    }
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  setRefreshToken(token: string): void {
    this.refreshToken = token;
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<T>(url, config);
      return {
        data: response.data as T,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return {
        data: response.data as T,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return {
        data: response.data as T,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return {
        data: response.data as T,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<T>(url, config);
      return {
        data: response.data as T,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data?.message || error.message,
        code: error.code,
        status: error.response?.status,
        errors: error.response?.data?.errors || [error.message],
      };
    }

    return {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export const apiClient = new ApiClient();

