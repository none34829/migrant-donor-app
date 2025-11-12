import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import theme from '../../constants/theme';
import { ItemList } from '../components/ItemList';
import { useAppData } from '../context/AppDataContext';

const MyDonationsListScreen = ({ navigation }) => {
  const { offers, matches, currentUserId } = useAppData();
  const mine = offers.filter((item) => item.ownerId === currentUserId);

  const handleSelect = (offerId) => {
    const match = matches.find((item) => item.offerId === offerId);
    if (match) {
      navigation.navigate('/match/:matchId', { matchId: match.id });
    } else {
      Alert.alert('Awaiting match', 'This donation has not been matched yet.');
    }
  };

  return (
    <View style={styles.container}>
      <ItemList
        items={mine}
        actionLabel="View status"
        onSelect={handleSelect}
        emptyState={{
          title: 'No donations yet',
          subtitle: 'Create your first donation to see it here.',
          ctaLabel: 'New Donation',
        }}
        onEmptyAction={() => navigation.navigate('/donate/new')}
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
});

export default MyDonationsListScreen;
