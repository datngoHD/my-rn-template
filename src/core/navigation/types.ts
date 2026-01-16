/**
 * Navigation Types
 * 
 * Type-safe navigation definitions for React Navigation.
 */

export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
  SettingsTab: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}




