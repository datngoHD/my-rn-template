/**
 * Auth Redux Slice
 * 
 * Presentation layer state management for authentication.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authRepository } from '../data/auth.repository';
import { LoginCredentials, SignUpData, User, AuthTokens } from '../domain/auth.types';
import { apiClient } from '../../../core/api/api-client';
import { Logger } from '../../../core/logging/logger';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authRepository.login(credentials);
      
      apiClient.setAccessToken(response.tokens.accessToken);
      apiClient.setRefreshToken(response.tokens.refreshToken);
      
      return response;
    } catch (error) {
      Logger.error('Login failed', { error });
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (data: SignUpData, { rejectWithValue }) => {
    try {
      const response = await authRepository.signUp(data);
      
      apiClient.setAccessToken(response.tokens.accessToken);
      apiClient.setRefreshToken(response.tokens.refreshToken);
      
      return response;
    } catch (error) {
      Logger.error('Sign up failed', { error });
      return rejectWithValue(error instanceof Error ? error.message : 'Sign up failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authRepository.logout();
    apiClient.clearTokens();
  } catch (error) {
    Logger.error('Logout failed', { error });
    return rejectWithValue(error instanceof Error ? error.message : 'Logout failed');
  }
});

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authRepository.getCurrentUser();
      return user;
    } catch (error) {
      Logger.error('Get current user failed', { error });
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to get user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setTokens } = authSlice.actions;
export default authSlice.reducer;




