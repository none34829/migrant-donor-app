import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../constants/theme';

const STATUS_COLORS = {
  Pending: theme.colors.info,
  Matched: theme.colors.accent,
  InTransit: theme.colors.warning,
  Completed: theme.colors.accent,
  Open: theme.colors.primary,
  Cancelled: theme.colors.danger,
};

const StatusPill = ({ status = 'Pending', labelPrefix = 'Status:' }) => (
  <View style={[styles.pill, { backgroundColor: STATUS_COLORS[status] ?? theme.colors.primary }]}>
    <Text style={styles.label}>{`${labelPrefix} ${status}`}</Text>
  </View>
);

const styles = StyleSheet.create({
  pill: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  label: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default StatusPill;
