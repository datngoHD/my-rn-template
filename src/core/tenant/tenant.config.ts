/**
 * Tenant Configuration
 * 
 * Defines tenant-specific runtime configurations.
 * These are RUNTIME configurations that can be loaded dynamically.
 * 
 * Runtime decisions:
 * - API endpoints (can vary per tenant)
 * - Feature flags (tenant-specific feature availability)
 * - Permissions and access control
 * - Custom business rules
 * - Tenant-specific branding overrides (optional)
 * 
 * Build-time vs Runtime:
 * - Build-time: App structure, core features, brand assets
 * - Runtime: API URLs, feature toggles, tenant-specific data
 */

export type TenantId = 'tenant-1' | 'tenant-2' | 'tenant-3' | 'default';

export interface TenantFeatureFlags {
  enablePushNotifications: boolean;
  enableBiometricAuth: boolean;
  enableDarkMode: boolean;
  enableOfflineMode: boolean;
  enableAnalytics: boolean;
  enableChatSupport: boolean;
  enablePaymentGateway: boolean;
  maxFileUploadSize: number;
  allowedFileTypes: string[];
}

export interface TenantPermissions {
  canCreateContent: boolean;
  canDeleteContent: boolean;
  canShareContent: boolean;
  canExportData: boolean;
  canInviteUsers: boolean;
  maxUsers: number;
}

export interface TenantApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  enableCaching: boolean;
  cacheTimeout: number;
}

export interface TenantConfig {
  id: TenantId;
  name: string;
  displayName: string;
  api: TenantApiConfig;
  featureFlags: TenantFeatureFlags;
  permissions: TenantPermissions;
  customSettings?: Record<string, unknown>;
}

const tenantConfigs: Record<TenantId, TenantConfig> = {
  'default': {
    id: 'default',
    name: 'default',
    displayName: 'Default Tenant',
    api: {
      baseUrl: process.env.EXPO_PUBLIC_API_URL_DEV || 'https://api-dev.example.com',
      timeout: 30000,
      retryAttempts: 3,
      enableCaching: true,
      cacheTimeout: 300000,
    },
    featureFlags: {
      enablePushNotifications: true,
      enableBiometricAuth: true,
      enableDarkMode: true,
      enableOfflineMode: true,
      enableAnalytics: true,
      enableChatSupport: true,
      enablePaymentGateway: true,
      maxFileUploadSize: 10485760,
      allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    },
    permissions: {
      canCreateContent: true,
      canDeleteContent: true,
      canShareContent: true,
      canExportData: true,
      canInviteUsers: true,
      maxUsers: 100,
    },
  },
  'tenant-1': {
    id: 'tenant-1',
    name: 'tenant-1',
    displayName: 'Tenant One',
    api: {
      baseUrl: 'https://api-tenant1.example.com',
      timeout: 30000,
      retryAttempts: 3,
      enableCaching: true,
      cacheTimeout: 300000,
    },
    featureFlags: {
      enablePushNotifications: true,
      enableBiometricAuth: false,
      enableDarkMode: true,
      enableOfflineMode: false,
      enableAnalytics: true,
      enableChatSupport: false,
      enablePaymentGateway: true,
      maxFileUploadSize: 5242880,
      allowedFileTypes: ['image/jpeg', 'image/png'],
    },
    permissions: {
      canCreateContent: true,
      canDeleteContent: false,
      canShareContent: true,
      canExportData: false,
      canInviteUsers: false,
      maxUsers: 50,
    },
  },
  'tenant-2': {
    id: 'tenant-2',
    name: 'tenant-2',
    displayName: 'Tenant Two',
    api: {
      baseUrl: 'https://api-tenant2.example.com',
      timeout: 30000,
      retryAttempts: 5,
      enableCaching: true,
      cacheTimeout: 600000,
    },
    featureFlags: {
      enablePushNotifications: true,
      enableBiometricAuth: true,
      enableDarkMode: true,
      enableOfflineMode: true,
      enableAnalytics: true,
      enableChatSupport: true,
      enablePaymentGateway: false,
      maxFileUploadSize: 20971520,
      allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'],
    },
    permissions: {
      canCreateContent: true,
      canDeleteContent: true,
      canShareContent: true,
      canExportData: true,
      canInviteUsers: true,
      maxUsers: 500,
    },
  },
  'tenant-3': {
    id: 'tenant-3',
    name: 'tenant-3',
    displayName: 'Tenant Three',
    api: {
      baseUrl: 'https://api-tenant3.example.com',
      timeout: 20000,
      retryAttempts: 2,
      enableCaching: false,
      cacheTimeout: 0,
    },
    featureFlags: {
      enablePushNotifications: false,
      enableBiometricAuth: false,
      enableDarkMode: false,
      enableOfflineMode: false,
      enableAnalytics: false,
      enableChatSupport: false,
      enablePaymentGateway: false,
      maxFileUploadSize: 1048576,
      allowedFileTypes: ['image/jpeg'],
    },
    permissions: {
      canCreateContent: false,
      canDeleteContent: false,
      canShareContent: false,
      canExportData: false,
      canInviteUsers: false,
      maxUsers: 10,
    },
  },
};

/**
 * Runtime tenant loader
 * 
 * In a real app, tenant selection can happen via:
 * 1. Deep link parameter: app://tenant-1
 * 2. User login (tenant from user profile)
 * 3. App initialization (stored preference)
 * 4. Server-side configuration fetch
 */
export class TenantLoader {
  private static currentTenant: TenantConfig | null = null;

  /**
   * Load tenant configuration
   * Can fetch from API or use local config
   */
  static async loadTenant(tenantId?: TenantId): Promise<TenantConfig> {
    if (tenantId && tenantConfigs[tenantId]) {
      this.currentTenant = tenantConfigs[tenantId];
      return this.currentTenant;
    }

    const defaultTenantId = (process.env.EXPO_PUBLIC_TENANT_ID || 'default') as TenantId;
    this.currentTenant = tenantConfigs[defaultTenantId] || tenantConfigs.default;
    
    return this.currentTenant;
  }

  /**
   * Get current tenant configuration
   */
  static getCurrentTenant(): TenantConfig {
    if (!this.currentTenant) {
      const defaultTenantId = (process.env.EXPO_PUBLIC_TENANT_ID || 'default') as TenantId;
      this.currentTenant = tenantConfigs[defaultTenantId] || tenantConfigs.default;
    }
    
    return this.currentTenant;
  }

  /**
   * Check if feature is enabled for current tenant
   */
  static isFeatureEnabled(feature: keyof TenantFeatureFlags): boolean {
    const tenant = this.getCurrentTenant();
    return tenant.featureFlags[feature] ?? false;
  }

  /**
   * Check if permission is granted for current tenant
   */
  static hasPermission(permission: keyof TenantPermissions): boolean {
    const tenant = this.getCurrentTenant();
    return tenant.permissions[permission] ?? false;
  }
}

export const getTenantConfig = (): TenantConfig => TenantLoader.getCurrentTenant();





