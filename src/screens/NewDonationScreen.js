import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../constants/theme';
import ItemForm from '../components/ItemForm';
import { useAppData } from '../context/AppDataContext';

const NewDonationScreen = ({ navigation }) => {
  const { createOffer } = useAppData();

  const handleSubmit = async (payload) => {
    await createOffer(payload);
    navigation.navigate('/donate/mine');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start a new donation</Text>
      <ItemForm mode="donation" onSubmit={handleSubmit} submitLabel="Save donation" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
});

export default NewDonationScreen;
