import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DELIVERY_TYPES } from '../../constants/catalog';
import theme from '../../constants/theme';

const DeliveryTypePicker = ({
  value,
  onChange,
  options = DELIVERY_TYPES,
  label = 'Delivery Type',
}) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.row}>
      {options.map(({ label: optionLabel, value: optionValue }) => {
        const selected = optionValue === value;
        return (
          <TouchableOpacity
            key={optionValue}
            style={[styles.option, selected && styles.optionSelected]}
            onPress={() => onChange(optionValue)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
              {optionLabel}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  optionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionLabel: {
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  optionLabelSelected: {
    color: theme.colors.surface,
  },
});

export default DeliveryTypePicker;
