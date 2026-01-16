/**
 * Theme System
 * 
 * Centralized theming that combines brand colors with tenant-specific overrides.
 * Supports light/dark mode and dynamic theme switching.
 */

import { BrandConfig, getBrandConfig } from '../branding/brand.config';
import { TenantConfig, getTenantConfig } from '../tenant/tenant.config';

export type ColorMode = 'light' | 'dark' | 'auto';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  disabled: string;
  overlay: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeTypography {
  fontFamily: string;
  fontFamilyBold: string;
  fontSizeBase: number;
  fontSizeSmall: number;
  fontSizeMedium: number;
  fontSizeLarge: number;
  fontSizeXLarge: number;
  fontSizeXXLarge: number;
  lineHeightBase: number;
  lineHeightTight: number;
  lineHeightLoose: number;
}

export interface ThemeBorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface ThemeShadows {
  sm: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  md: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  lg: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  isDark: boolean;
}

const createLightTheme = (brand: BrandConfig, tenant: TenantConfig): Theme => ({
  colors: {
    primary: brand.colors.primary,
    secondary: brand.colors.secondary,
    accent: brand.colors.accent,
    background: brand.colors.background,
    surface: brand.colors.surface,
    text: brand.colors.text,
    textSecondary: brand.colors.textSecondary,
    border: '#E5E5E5',
    error: brand.colors.error,
    warning: brand.colors.warning,
    success: brand.colors.success,
    info: brand.colors.info,
    disabled: '#CCCCCC',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    fontFamily: brand.typography.fontFamily,
    fontFamilyBold: brand.typography.fontFamilyBold,
    fontSizeBase: brand.typography.fontSizeBase,
    fontSizeSmall: brand.typography.fontSizeSmall,
    fontSizeMedium: 16,
    fontSizeLarge: brand.typography.fontSizeLarge,
    fontSizeXLarge: brand.typography.fontSizeXLarge,
    fontSizeXXLarge: 32,
    lineHeightBase: brand.typography.lineHeightBase,
    lineHeightTight: 1.2,
    lineHeightLoose: 1.8,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  isDark: false,
});

const createDarkTheme = (brand: BrandConfig, tenant: TenantConfig): Theme => {
  const lightTheme = createLightTheme(brand, tenant);
  
  return {
    ...lightTheme,
    colors: {
      ...lightTheme.colors,
      background: '#121212',
      surface: '#1E1E1E',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
      border: '#333333',
      disabled: '#666666',
    },
    isDark: true,
  };
};

/**
 * Get current theme based on brand and tenant
 */
export const getTheme = (colorMode: ColorMode = 'light'): Theme => {
  const brand = getBrandConfig();
  const tenant = getTenantConfig();
  
  const isDark = colorMode === 'dark' || (colorMode === 'auto' && false);
  
  return isDark ? createDarkTheme(brand, tenant) : createLightTheme(brand, tenant);
};

export const defaultTheme = getTheme('light');





