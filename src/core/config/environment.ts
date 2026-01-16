/**
 * Environment Configuration
 * 
 * Manages environment-specific settings and validates required variables.
 * Supports: dev, staging, production
 */

export type Environment = 'dev' | 'staging' | 'production';

export interface EnvironmentConfig {
  environment: Environment;
  apiBaseUrl: string;
  apiTimeout: number;
  enableLogging: boolean;
  enableSentry: boolean;
  sentryDsn?: string;
  featureFlags: {
    enableAnalytics: boolean;
    enableCrashReporting: boolean;
    enableRemoteConfig: boolean;
  };
}

const getEnvironment = (): Environment => {
  const env = process.env.EXPO_PUBLIC_ENV || process.env.NODE_ENV || 'dev';
  
  if (env === 'production' || env === 'prod') {
    return 'production';
  }
  
  if (env === 'staging' || env === 'stage') {
    return 'staging';
  }
  
  return 'dev';
};

const createEnvironmentConfig = (env: Environment): EnvironmentConfig => {
  const baseConfig: Record<Environment, Omit<EnvironmentConfig, 'environment'>> = {
    dev: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_URL_DEV || 'https://api-dev.example.com',
      apiTimeout: 30000,
      enableLogging: true,
      enableSentry: false,
      featureFlags: {
        enableAnalytics: false,
        enableCrashReporting: false,
        enableRemoteConfig: false,
      },
    },
    staging: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_URL_STAGING || 'https://api-staging.example.com',
      apiTimeout: 30000,
      enableLogging: true,
      enableSentry: true,
      sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
      featureFlags: {
        enableAnalytics: true,
        enableCrashReporting: true,
        enableRemoteConfig: true,
      },
    },
    production: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_URL_PROD || 'https://api.example.com',
      apiTimeout: 20000,
      enableLogging: false,
      enableSentry: true,
      sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
      featureFlags: {
        enableAnalytics: true,
        enableCrashReporting: true,
        enableRemoteConfig: true,
      },
    },
  };

  return {
    environment: env,
    ...baseConfig[env],
  };
};

export const environmentConfig: EnvironmentConfig = createEnvironmentConfig(getEnvironment());

export const isDevelopment = (): boolean => environmentConfig.environment === 'dev';
export const isStaging = (): boolean => environmentConfig.environment === 'staging';
export const isProduction = (): boolean => environmentConfig.environment === 'production';





