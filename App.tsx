/**
 * Main App Component
 * 
 * Root component that initializes:
 * - Redux store
 * - Theme provider
 * - Navigation
 * - i18n
 * - Error handling
 * - Tenant configuration
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/core/store/store';
import { ThemeProvider } from './src/core/theme/theme-context';
import { AppNavigator } from './src/core/navigation/navigation';
import { TenantLoader } from './src/core/tenant/tenant.config';
import { Logger } from './src/core/logging/logger';
import './src/core/i18n/i18n';
import 'react-native-get-random-values';

const App: React.FC = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        Logger.info('Initializing app...');
        
        await TenantLoader.loadTenant();
        
        Logger.info('App initialized successfully');
      } catch (error) {
        Logger.error('Failed to initialize app', { error });
      }
    };

    initializeApp();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
