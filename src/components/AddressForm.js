import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import theme from '../../constants/theme';

const AddressForm = ({ value = {}, onChange, label = 'Address' }) => {
  const handleChange = (field, newValue) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder="Line 1"
        placeholderTextColor={theme.colors.textSecondary}
        style={styles.input}
        value={value.line1 ?? ''}
        onChangeText={(text) => handleChange('line1', text)}
      />
      <TextInput
        placeholder="Line 2 (optional)"
        placeholderTextColor={theme.colors.textSecondary}
        style={styles.input}
        value={value.line2 ?? ''}
        onChangeText={(text) => handleChange('line2', text)}
      />
      <View style={styles.row}>
        <TextInput
          placeholder="City"
          placeholderTextColor={theme.colors.textSecondary}
          style={[styles.input, styles.flex]}
          value={value.city ?? ''}
          onChangeText={(text) => handleChange('city', text)}
        />
        <TextInput
          placeholder="Postal code"
          placeholderTextColor={theme.colors.textSecondary}
          style={[styles.input, styles.flex]}
          value={value.postalCode ?? ''}
          onChangeText={(text) => handleChange('postalCode', text)}
        />
      </View>
      <TextInput
        placeholder="Country"
        placeholderTextColor={theme.colors.textSecondary}
        style={styles.input}
        value={value.country ?? ''}
        onChangeText={(text) => handleChange('country', text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex: {
    flex: 1,
  },
});

export default AddressForm;
