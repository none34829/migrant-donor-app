import React, { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import theme from '../../constants/theme';

const OTPInput = ({ value = '', length = 6, onChange }) => {
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const sanitized = text.replace(/[^0-9]/g, '');
    const chars = value.split('');
    chars[index] = sanitized.slice(-1);
    const nextValue = chars.join('').padEnd(length, '');
    onChange(nextValue.slice(0, length));
    if (sanitized && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={`otp-${index}`}
          ref={(ref) => {
            inputs.current[index] = ref;
          }}
          style={styles.input}
          value={value[index] ?? ''}
          onChangeText={(text) => handleChange(text, index)}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
          accessible
          accessibilityLabel={`OTP digit ${index + 1}`}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    fontSize: 20,
    color: theme.colors.textPrimary,
  },
});

export default OTPInput;
