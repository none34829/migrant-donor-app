import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import theme from '../../constants/theme';
import AuthLayout from '../components/AuthLayout';
import { PrimaryButton, TextButton } from '../components/Buttons';
import { useAuthFlow } from '../context/AuthFlowContext';

const ForgotStartScreen = ({ navigation }) => {
  const { sendOtp, otpCooldown } = useAuthFlow();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email) {
      setError('Email is required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await sendOtp(email);
      navigation.navigate('/auth/forgot/verify', { email });
    } catch (err) {
      setError(err.message ?? 'Unable to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email to receive a 6-digit OTP."
      footer={<TextButton label="Back to login" onPress={() => navigation.navigate('/auth/login')} />}
    >
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {otpCooldown ? <Text style={styles.cooldown}>Resend available in {otpCooldown}s</Text> : null}
        <PrimaryButton label="Send OTP" onPress={handleSend} loading={loading} />
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
  cooldown: {
    color: theme.colors.textSecondary,
  },
});

export default ForgotStartScreen;
