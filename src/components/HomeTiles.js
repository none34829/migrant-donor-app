import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../constants/theme';

const HomeTiles = ({ items, onSelect }) => (
  <View style={styles.grid}>
    {items.map((tile) => (
      <TouchableOpacity
        key={tile.key}
        style={styles.tile}
        onPress={() => onSelect(tile.key)}
        accessibilityRole="button"
      >
        <Text style={styles.title}>{tile.title}</Text>
        <Text style={styles.subtitle}>{tile.subtitle}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  tile: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
});

export default HomeTiles;
