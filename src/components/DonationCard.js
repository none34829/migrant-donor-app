import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const DonationCard = ({ donation, onPress, onRequest, isRequested = false, isAnonymous = false }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: donation.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {donation.title}
        </Text>
        <Text style={styles.category}>{donation.category}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {donation.description}
        </Text>
        
        {onRequest && (
          <TouchableOpacity
            style={[
              styles.requestButton,
              isRequested && styles.requestedButton,
              isAnonymous && styles.anonymousButton
            ]}
            onPress={onRequest}
            disabled={isRequested}
          >
            <Text style={[
              styles.requestButtonText,
              isRequested && styles.requestedButtonText,
              isAnonymous && styles.anonymousButtonText
            ]}>
              {isRequested ? 'Requested' : isAnonymous ? 'Sign In to Request' : 'Request Item'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  category: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  requestButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestedButton: {
    backgroundColor: '#E5E5EA',
  },
  anonymousButton: {
    backgroundColor: '#FF9500',
  },
  requestButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  requestedButtonText: {
    color: '#8E8E93',
  },
  anonymousButtonText: {
    color: 'white',
  },
});

export default DonationCard; 