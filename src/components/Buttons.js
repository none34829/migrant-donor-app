import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import theme from '../../constants/theme';

const baseStyles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export const PrimaryButton = ({ label, onPress, disabled, loading, style, labelStyle, ...props }) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel={label}
    style={[
      baseStyles.button,
      styles.primary,
      (disabled || loading) && styles.disabled,
      style,
    ]}
    onPress={onPress}
    disabled={disabled || loading}
    {...props}
  >
    {loading && <ActivityIndicator color="#fff" size="small" />}
    <Text style={[baseStyles.label, styles.primaryLabel, labelStyle]}>{label}</Text>
  </TouchableOpacity>
);

export const SecondaryButton = ({ label, onPress, style, labelStyle, ...props }) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel={label}
    style={[baseStyles.button, styles.secondary, style]}
    onPress={onPress}
    {...props}
  >
    <Text style={[baseStyles.label, styles.secondaryLabel, labelStyle]}>{label}</Text>
  </TouchableOpacity>
);

export const TextButton = ({ label, onPress, style, labelStyle, ...props }) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel={label}
    style={[styles.textButton, style]}
    onPress={onPress}
    {...props}
  >
    <Text style={[styles.textButtonLabel, labelStyle]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.card,
  },
  primaryLabel: {
    color: theme.colors.surface,
  },
  secondary: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: 'transparent',
  },
  secondaryLabel: {
    color: theme.colors.primary,
  },
  textButton: {
    paddingVertical: 8,
  },
  textButtonLabel: {
    color: theme.colors.accent,
    fontWeight: '600',
    fontSize: 14,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default PrimaryButton;
