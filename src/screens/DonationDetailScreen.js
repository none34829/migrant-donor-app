import { Ionicons } from '@expo/vector-icons';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import theme from '../../constants/theme';
import { auth, db } from '../config/firebase';

const DonationDetailScreen = ({ route, navigation }) => {
  const { donation } = route.params;
  const [donorInfo, setDonorInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const currentUser = auth.currentUser;
  const isAnonymous = currentUser?.isAnonymous;
  const isOwnDonation = donation.donorId === currentUser?.uid;

  useEffect(() => {
    fetchDonorInfo();
    checkRequestStatus();
  }, []);

  const fetchDonorInfo = async () => {
    try {
      const donorDoc = await getDoc(doc(db, 'users', donation.donorId));
      if (donorDoc.exists()) {
        setDonorInfo(donorDoc.data());
      }
    } catch (error) {
      console.error('Error fetching donor info:', error);
    }
  };

  const checkRequestStatus = () => {
    if (donation.requestedBy && currentUser) {
      setIsRequested(donation.requestedBy.includes(currentUser.uid));
      // Check if request is accepted
      if (donation.acceptedRequests && donation.acceptedRequests.includes(currentUser.uid)) {
        setIsAccepted(true);
      }
    }
  };

  const handleRequest = async () => {
    if (isAnonymous) {
      auth.signOut();
      return;
    }

    if (!currentUser) {
      Alert.alert('Error', 'Please sign in to request items');
      return;
    }

    setLoading(true);
    try {
      const donationRef = doc(db, 'donations', donation.id);
      
      if (isRequested) {
        // Cancel request
        await updateDoc(donationRef, {
          requestedBy: arrayRemove(currentUser.uid)
        });
        setIsRequested(false);
        Alert.alert('Request Cancelled', 'Your request has been cancelled');
      } else {
        // Add request
        await updateDoc(donationRef, {
          requestedBy: arrayUnion(currentUser.uid)
        });
        setIsRequested(true);
        Alert.alert('Request Sent', `Your request for "${donation.title}" has been sent to the donor`);
      }
    } catch (error) {
      console.error('Error updating request:', error);
      Alert.alert('Error', 'Failed to process your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: donation.imageUrl }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{donation.title}</Text>
        <Text style={styles.category}>{donation.category}{donation.subcategory ? ` · ${donation.subcategory}` : ''}</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>Posted on {formatDate(donation.createdAt)}</Text>
        </View>

        <Text style={styles.description}>{donation.description}</Text>

        {donorInfo && (
          <View style={styles.donorSection}>
            <Text style={styles.sectionTitle}>Donor Information</Text>
            <View style={styles.donorInfo}>
              <Text style={styles.donorName}>{donorInfo.name}</Text>
              
              {/* Show contact info only if request is accepted or if it's own donation */}
              {(isAccepted || isOwnDonation) && donorInfo.contact && (
                <Text style={styles.donorContact}>Contact: {donorInfo.contact}</Text>
              )}
              
              {(isAccepted || isOwnDonation) && donorInfo.address && (
                <Text style={styles.donorAddress}>Location: {donorInfo.address}</Text>
              )}

              {/* Show privacy notice if requested but not accepted */}
              {isRequested && !isAccepted && !isOwnDonation && (
                <View style={styles.privacyNotice}>
                  <Ionicons name="lock-closed-outline" size={16} color="#FF9800" />
                  <Text style={styles.privacyText}>
                    Contact information will be revealed after the donor accepts your request
                  </Text>
                </View>
              )}

              {/* Show status if request is accepted */}
              {isAccepted && (
                <View style={styles.acceptedNotice}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.acceptedText}>
                    Your request has been accepted! You can now contact the donor.
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {donation.requestedBy && donation.requestedBy.length > 0 && (
          <View style={styles.requestsSection}>
            <Text style={styles.sectionTitle}>
              Requests ({donation.requestedBy.length})
            </Text>
            <Text style={styles.requestsText}>
              {donation.requestedBy.length} person{donation.requestedBy.length !== 1 ? 's have' : ' has'} requested this item
            </Text>
          </View>
        )}

        {!isOwnDonation && (
          <TouchableOpacity
            style={[
              styles.requestButton,
              isRequested && styles.requestedButton,
              isAnonymous && styles.anonymousButton,
              loading && styles.loadingButton
            ]}
            onPress={handleRequest}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={[
                styles.requestButtonText,
                isRequested && styles.requestedButtonText,
                isAnonymous && styles.anonymousButtonText
              ]}>
                {isRequested ? 'Cancel Request' : isAnonymous ? 'Sign In to Request' : 'Request Item'}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {isOwnDonation && (
          <View style={styles.ownDonationContainer}>
            <Text style={styles.ownDonationText}>This is your donation</Text>
            <Text style={styles.ownDonationSubtext}>
              You can view requests in your profile
            </Text>
            {donation.requestedBy && donation.requestedBy.length > 0 && (
              <TouchableOpacity
                style={styles.viewRequestsButton}
                onPress={() => navigation.navigate('DonationRequests', { donation })}
              >
                <Text style={styles.viewRequestsButtonText}>
                  View {donation.requestedBy.length} Request{donation.requestedBy.length !== 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: theme.colors.accent,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    marginLeft: 8,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    lineHeight: 24,
    marginBottom: 24,
  },
  donorSection: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  donorInfo: {
    gap: 4,
  },
  donorName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  donorContact: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  donorAddress: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  requestsSection: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  requestsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  requestButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  requestedButton: {
    backgroundColor: theme.colors.danger,
  },
  anonymousButton: {
    backgroundColor: theme.colors.warning,
  },
  loadingButton: {
    opacity: 0.7,
  },
  requestButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  requestedButtonText: {
    color: 'white',
  },
  anonymousButtonText: {
    color: 'white',
  },
  ownDonationContainer: {
    backgroundColor: theme.colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ownDonationText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.accent,
  },
  ownDonationSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  viewRequestsButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
  },
  viewRequestsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  privacyText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 8,
    flex: 1,
  },
  acceptedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  acceptedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 8,
    flex: 1,
  },
});

export default DonationDetailScreen; 