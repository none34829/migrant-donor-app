import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../constants/theme';
import HubCard from '../components/HubCard';

const ReceiveHubScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Welcome to HAVN — receive new or pre-loved items.</Text>
    <HubCard
      title="Items Offered"
      description="Browse items donors have already listed."
      ctaLabel="See offers"
      onPress={() => navigation.navigate('/receive/offers')}
    />
    <HubCard
      title="New Request"
      description="Let donors know what you need."
      ctaLabel="Create request"
      onPress={() => navigation.navigate('/receive/new')}
    />
    <HubCard
      title="My Requests"
      description="Track the requests you’ve created."
      ctaLabel="View my requests"
      onPress={() => navigation.navigate('/receive/mine')}
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

export default ReceiveHubScreen;
