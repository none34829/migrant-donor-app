import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../constants/theme';

const HubCard = ({ title, description, ctaLabel, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} accessibilityRole="button">
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.cta}>{ctaLabel}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...theme.shadows.card,
  },
  content: {
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  cta: {
    fontSize: 14,
    color: theme.colors.accent,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default HubCard;
