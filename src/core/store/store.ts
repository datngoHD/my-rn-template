/**
 * Redux Store Configuration
 * 
 * Centralized state management with Redux Toolkit.
 * Supports code splitting and lazy loading of reducers.
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Logger } from '../logging/logger';
import authReducer from '../../features/auth/presentation/auth.slice';

const rootReducer = combineReducers({
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'prod',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

if (process.env.NODE_ENV === 'development') {
  store.subscribe(() => {
    Logger.debug('Store updated', {
      state: store.getState(),
    });
  });
}
