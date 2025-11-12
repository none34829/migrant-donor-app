import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import theme from '../../constants/theme';
import AuthLayout from '../components/AuthLayout';
import { PrimaryButton, TextButton } from '../components/Buttons';
import { auth } from '../config/firebase';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(err.message ?? 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Log in"
      subtitle="Enter your details to continue."
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New here?</Text>
          <TextButton label="Sign up" onPress={() => navigation.navigate('/auth/signup')} />
        </View>
      }
    >
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email or username"
          placeholderTextColor={theme.colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton label="Log in" onPress={handleLogin} loading={loading} />
        <TextButton label="Forgot password?" onPress={() => navigation.navigate('/auth/forgot')} />
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
  },
  error: {
    color: theme.colors.danger,
    fontSize: 14,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    color: theme.colors.textSecondary,
  },
});

export default LoginScreen;
