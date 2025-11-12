import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../constants/theme';
import HubCard from '../components/HubCard';

const DonateHubScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Welcome to HAVN — donate new or pre-loved items.</Text>
    <HubCard
      title="New Donation"
      description="Share an item and we’ll match it to a request."
      ctaLabel="Start a donation"
      onPress={() => navigation.navigate('/donate/new')}
    />
    <HubCard
      title="Items Requested"
      description="See what receivers are looking for right now."
      ctaLabel="View requests"
      onPress={() => navigation.navigate('/donate/requests')}
    />
    <HubCard
      title="My Donation List"
      description="Track items you’ve offered."
      ctaLabel="View my donations"
      onPress={() => navigation.navigate('/donate/mine')}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 24,
  },
  title: {
    fontSize: 20,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: 20,
  },
});

export default DonateHubScreen;
