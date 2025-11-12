import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../constants/theme';
import { PrimaryButton } from '../components/Buttons';
import { useAppData } from '../context/AppDataContext';

const ReceiveOfferScreen = ({ navigation, route }) => {
  const { offerId } = route.params ?? {};
  const { getOfferById, receiveOffer } = useAppData();
  const offer = getOfferById(offerId);

  if (!offer) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Offer not found.</Text>
      </View>
    );
  }

  const handleReceive = async () => {
    const match = await receiveOffer(offerId);
    if (match) {
      navigation.navigate('/match/:matchId', { matchId: match.id });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receive — {offer.title}</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Category</Text>
        <Text style={styles.value}>{offer.category}</Text>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{offer.description}</Text>
        <Text style={styles.label}>Delivery</Text>
        <Text style={styles.value}>{offer.deliveryType === 'PickUp' ? 'Pick-up' : 'Delivery'}</Text>
        {offer.address?.line1 ? (
          <>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>
              {offer.address.line1}
              {offer.address.city ? `, ${offer.address.city}` : ''}
            </Text>
          </>
        ) : null}
      </View>
      <PrimaryButton label="Confirm receive" onPress={handleReceive} />
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  card: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    gap: 8,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  error: {
    color: theme.colors.danger,
  },
});

export default ReceiveOfferScreen;
