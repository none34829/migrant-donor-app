import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../constants/theme';
import StatusPill from '../components/StatusPill';
import { useAppData } from '../context/AppDataContext';

const StatusUpdatesScreen = ({ navigation }) => {
  const { matches, getContact } = useAppData();

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const donor = getContact(item.donorId);
          const receiver = getContact(item.receiverId);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('/match/:matchId', { matchId: item.id })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.itemSnapshot?.title ?? 'Item'}</Text>
                <StatusPill status={item.status} />
              </View>
              <Text style={styles.cardMeta}>
                Donor: {donor.firstName} · Receiver: {receiver.firstName}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No matches yet.</Text>
          </View>
        }
        contentContainerStyle={matches.length ? null : styles.flex}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  card: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 16,
    backgroundColor: theme.colors.surface,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  cardMeta: {
    color: theme.colors.textSecondary,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
  },
  flex: {
    flexGrow: 1,
  },
});

export default StatusUpdatesScreen;
