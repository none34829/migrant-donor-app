import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../constants/theme';
import StatusPill from './StatusPill';

const ItemCard = ({ item, actionLabel, onPress }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => onPress?.(item)}
    accessibilityRole="button"
  >
    <View style={styles.header}>
      <Text style={styles.title}>{item.title || item.subcategory || 'Item'}</Text>
      <StatusPill status={item.status ?? 'Open'} labelPrefix="Status:" />
    </View>
    <Text style={styles.category}>{item.category}</Text>
    {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
    <View style={styles.footer}>
      <Text style={styles.cta}>{actionLabel}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  category: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  footer: {
    alignItems: 'flex-end',
  },
  cta: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
});

export default ItemCard;
