import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../constants/theme';
import { PrimaryButton } from '../components/Buttons';
import MatchDetails from '../components/MatchDetails';
import { useAppData } from '../context/AppDataContext';

const MatchDetailsScreen = ({ route }) => {
  const { matchId } = route.params ?? {};
  const { getMatchById, getContact, statusSteps, updateMatchStatus } = useAppData();
  const match = getMatchById(matchId);

  if (!match) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Match not found.</Text>
      </View>
    );
  }

  const donor = getContact(match.donorId);
  const receiver = getContact(match.receiverId);

  const currentIndex = statusSteps.indexOf(match.status);
  const nextStatus = currentIndex >= 0 ? statusSteps[currentIndex + 1] : null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Match details</Text>
      <Text style={styles.itemTitle}>{match.itemSnapshot?.title}</Text>
      <MatchDetails
        donor={donor}
        receiver={receiver}
        status={match.status}
        history={match.statusHistory}
        statusSteps={statusSteps}
      />
      {nextStatus ? (
        <PrimaryButton
          label={`Mark as ${nextStatus}`}
          onPress={() => updateMatchStatus(matchId, nextStatus)}
        />
      ) : (
        <PrimaryButton label="Status: Completed" disabled />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.background,
    gap: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  itemTitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  error: {
    color: theme.colors.danger,
  },
});

export default MatchDetailsScreen;
