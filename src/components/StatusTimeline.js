import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../constants/theme';

const StatusTimeline = ({ steps, currentStatus, history = [] }) => {
  const normalizedSteps = steps ?? ['Pending', 'Matched', 'InTransit', 'Completed'];

  const getTimestamp = (status) => history.find((entry) => entry.status === status)?.at;

  return (
    <View style={styles.container}>
      {normalizedSteps.map((step, index) => {
        const active = normalizedSteps.indexOf(currentStatus) >= index;
        const completed = getTimestamp(step);
        return (
          <View key={step} style={styles.row}>
            <View style={styles.indicatorColumn}>
              <View style={[styles.circle, active && styles.circleActive]} />
              {index !== normalizedSteps.length - 1 && <View style={[styles.connector, active && styles.connectorActive]} />}
            </View>
            <View style={styles.content}>
              <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{step}</Text>
              {completed && <Text style={styles.timestamp}>{new Date(completed).toLocaleString()}</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
  },
  indicatorColumn: {
    alignItems: 'center',
    width: 32,
  },
  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    marginTop: 4,
  },
  circleActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  connector: {
    width: 2,
    flex: 1,
    marginTop: 2,
    backgroundColor: theme.colors.border,
  },
  connectorActive: {
    backgroundColor: theme.colors.primary,
  },
  content: {
    flex: 1,
    paddingBottom: 16,
  },
  stepLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  stepLabelActive: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

export default StatusTimeline;
