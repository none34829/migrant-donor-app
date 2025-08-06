import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth } from '../config/firebase';

const { width } = Dimensions.get('window');

const DonationCard = ({ donation, onPress, onRequest, isAnonymous = false }) => {
  const [imageError, setImageError] = useState(false);
  
  // Check if current user has requested this item
  const currentUser = auth.currentUser;
  const isRequested = donation.requestedBy && currentUser && donation.requestedBy.includes(currentUser.uid);
  const isOwnDonation = donation.donorId === currentUser?.uid;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {!imageError ? (
        <Image
          source={{ uri: donation.imageUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={handleImageError}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={48} color="#ccc" />
          <Text style={styles.imagePlaceholderText}>Image not available</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {donation.title}
        </Text>
        <Text style={styles.category}>{donation.category}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {donation.description}
        </Text>
        
        {onRequest && !isOwnDonation && (
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

        {isOwnDonation && (
          <View style={styles.ownDonationContainer}>
            <Text style={styles.ownDonationText}>Your Donation</Text>
            {donation.requestedBy && donation.requestedBy.length > 0 && (
              <Text style={styles.requestCountText}>
                {donation.requestedBy.length} request{donation.requestedBy.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
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
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
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
  ownDonationContainer: {
    backgroundColor: '#E8F5E8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  ownDonationText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '600',
  },
  requestCountText: {
    color: '#388E3C',
    fontSize: 11,
    marginTop: 2,
  },
});

export default DonationCard; 