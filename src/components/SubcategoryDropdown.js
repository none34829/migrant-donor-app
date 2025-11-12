import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, View } from 'react-native';
import { SUBCATEGORY_OPTIONS } from '../../constants/catalog';
import theme from '../../constants/theme';

const SubcategoryDropdown = ({
  category,
  value,
  onChange,
  optionsMap = SUBCATEGORY_OPTIONS,
  label = 'Subcategory',
  placeholder = 'Select subcategory',
}) => {
  const options = category ? optionsMap[category] ?? optionsMap.Other : [];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value ?? ''}
          onValueChange={(itemValue) => onChange(itemValue)}
          dropdownIconColor={theme.colors.textPrimary}
        >
          <Picker.Item label={placeholder} value="" />
          {options.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </View>
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },
});

export default SubcategoryDropdown;
