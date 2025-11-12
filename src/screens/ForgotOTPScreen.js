import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../constants/theme';
import AuthLayout from '../components/AuthLayout';
import { PrimaryButton, TextButton } from '../components/Buttons';
import OTPInput from '../components/OTPInput';
import { useAuthFlow } from '../context/AuthFlowContext';

const ForgotOTPScreen = ({ navigation, route }) => {
  const { email } = route.params ?? {};
  const { verifyOtp, sendOtp, otpCooldown, lastOtp } = useAuthFlow();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigation.replace('/auth/forgot');
    }
  }, [email, navigation]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('Enter the 6-digit OTP.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await verifyOtp(email, code);
      navigation.navigate('/auth/forgot/reset', { email });
    } catch (err) {
      setError(err.message ?? 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendOtp(email);
    } catch (err) {
      setError(err.message ?? 'Unable to resend OTP');
    }
  };

  return (
    <AuthLayout title="Confirm OTP" subtitle={`Enter the code sent to ${email}.`}>
      <View style={styles.form}>
        <OTPInput value={code} onChange={setCode} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {__DEV__ && lastOtp ? <Text style={styles.debug}>DEV OTP: {lastOtp}</Text> : null}
        <PrimaryButton label="Verify" onPress={handleVerify} loading={loading} />
        <TextButton
          label={otpCooldown ? `Resend available in ${otpCooldown}s` : 'Resend OTP'}
          onPress={handleResend}
          disabled={Boolean(otpCooldown)}
        />
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
  error: {
    color: theme.colors.danger,
  },
  debug: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
});

export default ForgotOTPScreen;
