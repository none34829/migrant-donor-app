import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import theme from '../../constants/theme';
import AuthLayout from '../components/AuthLayout';
import { PrimaryButton, TextButton } from '../components/Buttons';
import { useAuthFlow } from '../context/AuthFlowContext';

const ResetPasswordScreen = ({ navigation, route }) => {
  const { email } = route.params ?? {};
  const { resetPassword } = useAuthFlow();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigation.replace('/auth/forgot');
    }
  }, [email, navigation]);

  const handleReset = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await resetPassword(email, password);
      navigation.navigate('/auth/login');
    } catch (err) {
      setError(err.message ?? 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Create a new password to finish the flow."
      footer={<TextButton label="Back to login" onPress={() => navigation.navigate('/auth/login')} />}
    >
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="New password"
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton label="Save & log in" onPress={handleReset} loading={loading} />
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
  },
});

export default ResetPasswordScreen;
