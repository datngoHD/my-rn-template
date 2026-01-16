/**
 * Brand Configuration
 * 
 * Defines brand-specific visual and identity settings.
 * These are typically BUILD-TIME configurations that affect app appearance.
 * 
 * Build-time decisions:
 * - App name, bundle ID, package name (required for app store)
 * - App icon, splash screen (assets bundled at build time)
 * - Default color palette (can be overridden at runtime for multi-tenant)
 * - Typography preferences
 */

export type BrandId = 'default' | 'brand-a' | 'brand-b' | 'brand-c';

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface BrandTypography {
  fontFamily: string;
  fontFamilyBold: string;
  fontSizeBase: number;
  fontSizeSmall: number;
  fontSizeLarge: number;
  fontSizeXLarge: number;
  lineHeightBase: number;
}

export interface BrandAssets {
  logo: string;
  logoDark?: string;
  icon: string;
  splash: string;
  favicon?: string;
}

export interface BrandConfig {
  id: BrandId;
  name: string;
  displayName: string;
  bundleId: string;
  packageName: string;
  colors: BrandColors;
  typography: BrandTypography;
  assets: BrandAssets;
}

const brandConfigs: Record<BrandId, BrandConfig> = {
  default: {
    id: 'default',
    name: 'default',
    displayName: 'Default App',
    bundleId: 'com.example.app',
    packageName: 'com.example.app',
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      accent: '#FF9500',
      background: '#FFFFFF',
      surface: '#F2F2F7',
      text: '#000000',
      textSecondary: '#6D6D80',
      error: '#FF3B30',
      warning: '#FF9500',
      success: '#34C759',
      info: '#007AFF',
    },
    typography: {
      fontFamily: 'System',
      fontFamilyBold: 'System',
      fontSizeBase: 16,
      fontSizeSmall: 14,
      fontSizeLarge: 18,
      fontSizeXLarge: 24,
      lineHeightBase: 1.5,
    },
    assets: {
      logo: require('../../../assets/icon.png'),
      icon: require('../../../assets/icon.png'),
      splash: require('../../../assets/splash-icon.png'),
    },
  },
  'brand-a': {
    id: 'brand-a',
    name: 'brand-a',
    displayName: 'Brand A',
    bundleId: 'com.branda.app',
    packageName: 'com.branda.app',
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#FFE66D',
      background: '#FFFFFF',
      surface: '#F8F9FA',
      text: '#212529',
      textSecondary: '#6C757D',
      error: '#DC3545',
      warning: '#FFC107',
      success: '#28A745',
      info: '#17A2B8',
    },
    typography: {
      fontFamily: 'System',
      fontFamilyBold: 'System',
      fontSizeBase: 16,
      fontSizeSmall: 14,
      fontSizeLarge: 18,
      fontSizeXLarge: 24,
      lineHeightBase: 1.5,
    },
    assets: {
      logo: require('../../../assets/icon.png'),
      icon: require('../../../assets/icon.png'),
      splash: require('../../../assets/splash-icon.png'),
    },
  },
  'brand-b': {
    id: 'brand-b',
    name: 'brand-b',
    displayName: 'Brand B',
    bundleId: 'com.brandb.app',
    packageName: 'com.brandb.app',
    colors: {
      primary: '#6C5CE7',
      secondary: '#A29BFE',
      accent: '#FD79A8',
      background: '#FFFFFF',
      surface: '#F1F2F6',
      text: '#2D3436',
      textSecondary: '#636E72',
      error: '#D63031',
      warning: '#FDCB6E',
      success: '#00B894',
      info: '#0984E3',
    },
    typography: {
      fontFamily: 'System',
      fontFamilyBold: 'System',
      fontSizeBase: 16,
      fontSizeSmall: 14,
      fontSizeLarge: 18,
      fontSizeXLarge: 24,
      lineHeightBase: 1.5,
    },
    assets: {
      logo: require('../../../assets/icon.png'),
      icon: require('../../../assets/icon.png'),
      splash: require('../../../assets/splash-icon.png'),
    },
  },
  'brand-c': {
    id: 'brand-c',
    name: 'brand-c',
    displayName: 'Brand C',
    bundleId: 'com.brandc.app',
    packageName: 'com.brandc.app',
    colors: {
      primary: '#2ECC71',
      secondary: '#3498DB',
      accent: '#E74C3C',
      background: '#ECF0F1',
      surface: '#FFFFFF',
      text: '#2C3E50',
      textSecondary: '#7F8C8D',
      error: '#E74C3C',
      warning: '#F39C12',
      success: '#27AE60',
      info: '#3498DB',
    },
    typography: {
      fontFamily: 'System',
      fontFamilyBold: 'System',
      fontSizeBase: 16,
      fontSizeSmall: 14,
      fontSizeLarge: 18,
      fontSizeXLarge: 24,
      lineHeightBase: 1.5,
    },
    assets: {
      logo: require('../../../assets/icon.png'),
      icon: require('../../../assets/icon.png'),
      splash: require('../../../assets/splash-icon.png'),
    },
  },
};

/**
 * Get brand configuration
 * In a real app, this would be determined at build time via:
 * - Environment variable: BRAND_ID
 * - Build script parameter
 * - CI/CD pipeline variable
 */
export const getBrandConfig = (): BrandConfig => {
  const brandId = (process.env.EXPO_PUBLIC_BRAND_ID || 'default') as BrandId;
  
  if (!brandConfigs[brandId]) {
    console.warn(`Brand config for "${brandId}" not found, using default`);
    return brandConfigs.default;
  }
  
  return brandConfigs[brandId];
};

export const currentBrandConfig = getBrandConfig();




