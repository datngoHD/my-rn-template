/**
 * Theme Context
 * 
 * React context for theme access throughout the app.
 */

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Theme, getTheme, ColorMode } from './theme';

interface ThemeContextValue {
  theme: Theme;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialColorMode?: ColorMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialColorMode = 'light' }) => {
  const [colorMode, setColorMode] = useState<ColorMode>(initialColorMode);
  
  const theme = useMemo(() => getTheme(colorMode), [colorMode]);

  const toggleColorMode = () => {
    setColorMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const value: ThemeContextValue = {
    theme,
    colorMode,
    setColorMode,
    toggleColorMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};





