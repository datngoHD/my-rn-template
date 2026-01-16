/**
 * Navigation Setup
 * 
 * React Navigation configuration with:
 * - Type-safe navigation
 * - Stack and Tab navigators
 * - Deep linking support
 * - Authentication flow handling
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { RootStackParamList, AuthStackParamList, MainTabParamList } from './types';
import { useAppSelector } from '../store/hooks';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{name} Screen</Text>
  </View>
);

const AuthNavigator = () => {
  return (
    <View>
      <Text>Auth Navigator</Text>
    </View>
  );
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={() => <PlaceholderScreen name="Login" />} />
      <AuthStack.Screen name="SignUp" component={() => <PlaceholderScreen name="SignUp" />} />
      <AuthStack.Screen name="ForgotPassword" component={() => <PlaceholderScreen name="ForgotPassword" />} />
    </AuthStack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <MainTab.Navigator screenOptions={{ headerShown: false }}>
      <MainTab.Screen name="HomeTab" component={() => <PlaceholderScreen name="Home" />} />
      <MainTab.Screen name="ProfileTab" component={() => <PlaceholderScreen name="Profile" />} />
      <MainTab.Screen name="SettingsTab" component={() => <PlaceholderScreen name="Settings" />} />
    </MainTab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export const AppNavigator = () => {
  // const isAuthenticated = useAppSelector((state) => {
  //   return state.auth.isAuthenticated;
  // });

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {false ? (
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
