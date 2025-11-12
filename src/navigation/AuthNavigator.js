import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import theme from '../../constants/theme';
import ForgotOTPScreen from '../screens/ForgotOTPScreen';
import ForgotStartScreen from '../screens/ForgotStartScreen';
import LoginScreen from '../screens/LoginScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import SignupScreen from '../screens/SignupScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerTintColor: theme.colors.textPrimary,
  headerStyle: { backgroundColor: theme.colors.background },
  headerTitleStyle: { fontSize: 16, fontWeight: '600' },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
};

const AuthNavigator = () => (
  <Stack.Navigator initialRouteName="/" screenOptions={screenOptions}>
    <Stack.Screen name="/" component={WelcomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="/auth/login" component={LoginScreen} options={{ title: 'Log in' }} />
    <Stack.Screen name="/auth/signup" component={SignupScreen} options={{ title: 'Sign up' }} />
    <Stack.Screen
      name="/auth/forgot"
      component={ForgotStartScreen}
      options={{ title: 'Forgot password' }}
    />
    <Stack.Screen
      name="/auth/forgot/verify"
      component={ForgotOTPScreen}
      options={{ title: 'Confirm OTP' }}
    />
    <Stack.Screen
      name="/auth/forgot/reset"
      component={ResetPasswordScreen}
      options={{ title: 'Reset password' }}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
