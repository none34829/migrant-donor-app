import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../constants/theme';
import ContactCard from './ContactCard';
import StatusTimeline from './StatusTimeline';

const MatchDetails = ({ donor, receiver, status, history, statusSteps }) => (
  <View>
    <View style={styles.notice}>
      <Text style={styles.noticeText}>
        Push notification has been sent to both; donor & receiver contact details below.
      </Text>
    </View>
    <ContactCard title="Donor" contact={donor} />
    <ContactCard title="Receiver" contact={receiver} />
    <View style={styles.timeline}>
      <Text style={styles.timelineLabel}>Status</Text>
      <StatusTimeline steps={statusSteps} currentStatus={status} history={history} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  notice: {
    backgroundColor: theme.colors.chipBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  noticeText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
  },
  timeline: {
    marginTop: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
  },
  timelineLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
});

export default MatchDetails;
