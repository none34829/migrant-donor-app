import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import theme from './constants/theme';
import { AppDataProvider } from './src/context/AppDataContext';
import { AuthFlowProvider } from './src/context/AuthFlowContext';
import { auth } from './src/config/firebase';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthFlowProvider>
      <AppDataProvider>
        <NavigationContainer>{user ? <AppNavigator /> : <AuthNavigator />}</NavigationContainer>
      </AppDataProvider>
    </AuthFlowProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});
