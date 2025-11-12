import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../constants/theme';
import ItemForm from '../components/ItemForm';
import { useAppData } from '../context/AppDataContext';

const DonateAgainstRequestScreen = ({ navigation, route }) => {
  const { requestId } = route.params ?? {};
  const { getRequestById, donateAgainstRequest } = useAppData();
  const request = getRequestById(requestId);

  if (!request) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Request not found.</Text>
      </View>
    );
  }

  const handleSubmit = async (payload) => {
    const match = await donateAgainstRequest(requestId, payload);
    if (match) {
      navigation.navigate('/match/:matchId', { matchId: match.id });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Donate — {request.title}</Text>
        <Text style={styles.subtitle}>{request.description}</Text>
      </View>
      <ItemForm mode="donationAgainstRequest" initial={request} onSubmit={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.textSecondary,
  },
  error: {
    color: theme.colors.danger,
  },
});

export default DonateAgainstRequestScreen;
