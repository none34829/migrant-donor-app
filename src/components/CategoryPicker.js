import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CATEGORY_OPTIONS } from '../../constants/catalog';
import theme from '../../constants/theme';

const CategoryPicker = ({ value, onChange, options = CATEGORY_OPTIONS, label = 'Category' }) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <TouchableOpacity
            key={option}
            style={[styles.pill, selected && styles.pillSelected]}
            onPress={() => onChange(option)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.pillLabel, selected && styles.pillLabelSelected]}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
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
  scroll: {
    gap: 8,
  },
  pill: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
  },
  pillSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  pillLabel: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  pillLabelSelected: {
    color: theme.colors.surface,
    fontWeight: '600',
  },
});

export default CategoryPicker;
