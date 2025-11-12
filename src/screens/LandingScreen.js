import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../constants/theme';
import HomeTiles from '../components/HomeTiles';

const tiles = [
  { key: 'donate', title: 'Donate', subtitle: 'Donate new or pre-loved items.' },
  { key: 'request', title: 'Request', subtitle: 'Receive items you need.' },
  { key: 'matched', title: 'Matched', subtitle: 'View active matches.' },
  { key: 'offers', title: 'Offers', subtitle: 'Browse items offered now.' },
];

const LandingScreen = ({ navigation }) => {
  const handleSelect = (key) => {
    switch (key) {
      case 'donate':
        navigation.navigate('/donate');
        break;
      case 'request':
        navigation.navigate('/receive');
        break;
      case 'matched':
        navigation.navigate('/status');
        break;
      case 'offers':
        navigation.navigate('/receive/offers');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>What do you want to do?</Text>
      <HomeTiles items={tiles} onSelect={handleSelect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 24,
  },
});

export default LandingScreen;
