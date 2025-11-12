import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import theme from '../../constants/theme';
import { ItemList } from '../components/ItemList';
import { useAppData } from '../context/AppDataContext';

const MyRequestsListScreen = ({ navigation }) => {
  const { requests, matches, currentUserId } = useAppData();
  const mine = requests.filter((item) => item.requesterId === currentUserId);

  const handleSelect = (requestId) => {
    const match = matches.find((item) => item.requestId === requestId);
    if (match) {
      navigation.navigate('/match/:matchId', { matchId: match.id });
    } else {
      Alert.alert('Awaiting match', 'This request has not been matched yet.');
    }
  };

  return (
    <View style={styles.container}>
      <ItemList
        items={mine}
        actionLabel="View status"
        onSelect={handleSelect}
        emptyState={{
          title: 'No requests yet',
          subtitle: 'Submit a new request to get started.',
          ctaLabel: 'New Request',
        }}
        onEmptyAction={() => navigation.navigate('/receive/new')}
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

export default MyRequestsListScreen;
