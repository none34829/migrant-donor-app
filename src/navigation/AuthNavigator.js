import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ForgotOTPScreen from '../screens/ForgotOTPScreen';
import ForgotStartScreen from '../screens/ForgotStartScreen';
import LoginScreen from '../screens/LoginScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import SignupScreen from '../screens/SignupScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator initialRouteName="/" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="/" component={WelcomeScreen} />
    <Stack.Screen name="/auth/login" component={LoginScreen} />
    <Stack.Screen name="/auth/signup" component={SignupScreen} />
    <Stack.Screen name="/auth/forgot" component={ForgotStartScreen} />
    <Stack.Screen name="/auth/forgot/verify" component={ForgotOTPScreen} />
    <Stack.Screen name="/auth/forgot/reset" component={ResetPasswordScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
