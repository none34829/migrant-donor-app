import { Ionicons } from '@expo/vector-icons';
import { arrayRemove, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { db } from '../config/firebase';
import { sendNotificationToUser } from '../services/notificationService';

const DonationRequestsScreen = ({ route, navigation }) => {
  const { donation } = route.params;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const requestsData = [];
      
      if (donation.requestedBy && donation.requestedBy.length > 0) {
        for (const userId of donation.requestedBy) {
          try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const isAccepted = donation.acceptedRequests && donation.acceptedRequests.includes(userId);
              requestsData.push({
                id: userId,
                ...userData,
                isAccepted,
              });
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      }
      
      setRequests(requestsData);
    } catch (error) {
      console.error('Error fetching requests:', error);
      Alert.alert('Error', 'Failed to fetch requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const handleAcceptRequest = async (userId) => {
    console.log('Accept request called for user:', userId);
    console.log('Donation data:', donation);
    
    try {
      console.log('Starting to accept request for user:', userId);
      const donationRef = doc(db, 'donations', donation.id);
      const acceptedRequests = donation.acceptedRequests || [];
      
      console.log('Current acceptedRequests:', acceptedRequests);
      console.log('User ID to accept:', userId);
      
      if (!acceptedRequests.includes(userId)) {
                        console.log('Updating Firestore...');
                const newAcceptedRequests = [...acceptedRequests, userId];
                console.log('New acceptedRequests array:', newAcceptedRequests);
                
                await updateDoc(donationRef, {
                  acceptedRequests: newAcceptedRequests
                });
                console.log('Firestore updated successfully');
                
                // Also update the local donation object
                donation.acceptedRequests = newAcceptedRequests;
                console.log('Updated local donation object:', donation);
        
        // Update local state
        setRequests(prev => {
          const updated = prev.map(req => 
            req.id === userId ? { ...req, isAccepted: true } : req
          );
          console.log('Updated requests state:', updated);
          return updated;
        });
        
        // Get requester info for notifications
        const requesterDoc = await getDoc(doc(db, 'users', userId));
        if (requesterDoc.exists()) {
          const requesterData = requesterDoc.data();
          console.log('Requester data:', requesterData);
          
          // Send notification to requester about accepted request
          console.log('Sending notification to requester...');
          await sendNotificationToUser(
            userId,
            'Request Accepted! 🎉',
            `Your request for "${donation.title}" has been accepted. You can now contact the donor.`,
            'request_accepted',
            donation.id
          );
          
          // Send notification to donor about accepted request
          console.log('Sending notification to donor...');
          await sendNotificationToUser(
            donation.donorId,
            'Request Accepted',
            `You accepted ${requesterData.name}'s request for "${donation.title}". They can now contact you.`,
            'request_accepted',
            donation.id
          );
        }
        
        Alert.alert(
          'Request Accepted', 
          'The requester can now see your contact information. Both parties will be notified.',
          [
            {
              text: 'View Notifications',
              onPress: () => navigation.navigate('Notifications')
            },
            { text: 'OK' }
          ]
        );
      } else {
        console.log('User already accepted');
        Alert.alert('Already Accepted', 'This request has already been accepted');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      console.error('Error details:', error.code, error.message);
      Alert.alert('Error', 'Failed to accept request: ' + error.message);
    }
  };

  const handleRemoveRequest = async (userId) => {
    console.log('Remove request called for user:', userId);
    
    try {
      const donationRef = doc(db, 'donations', donation.id);
      
      // Remove from both requestedBy and acceptedRequests
      await updateDoc(donationRef, {
        requestedBy: arrayRemove(userId),
        acceptedRequests: arrayRemove(userId)
      });
      
      // Update local state by removing the request from the list
      setRequests(prev => prev.filter(req => req.id !== userId));
      
      Alert.alert('Request Removed', 'The request has been removed');
    } catch (error) {
      console.error('Error removing request:', error);
      Alert.alert('Error', 'Failed to remove request');
    }
  };

  const renderRequestItem = ({ item }) => {
    console.log('Rendering request item:', item.id, 'isAccepted:', item.isAccepted);
    return (
      <View style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            {item.isAccepted && (
              <>
                <Text style={styles.userEmail}>{item.email}</Text>
                <View style={styles.acceptedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.acceptedText}>Accepted</Text>
                </View>
              </>
            )}
          </View>
          <View style={styles.actionButtons}>
            {!item.isAccepted && (
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => {
                  console.log('Accept button pressed for user:', item.id);
                  console.log('Item data:', item);
                  handleAcceptRequest(item.id);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => {
                console.log('Remove button pressed for user:', item.id);
                console.log('Item data:', item);
                handleRemoveRequest(item.id);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
        


        {!item.isAccepted && (
          <View style={styles.privacyNotice}>
            <Ionicons name="lock-closed-outline" size={16} color="#FF9800" />
            <Text style={styles.privacyText}>
              Contact information (including email) will be revealed after accepting this request
            </Text>
          </View>
        )}
        
        {item.isAccepted && (
          <View style={styles.contactSection}>
            <Text style={styles.contactSectionTitle}>Requester Contact Information</Text>
            {item.contact && (
              <View style={styles.contactInfo}>
                <Ionicons name="call-outline" size={16} color="#666" />
                <Text style={styles.contactText}>{item.contact}</Text>
              </View>
            )}
            {item.address && (
              <View style={styles.contactInfo}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.contactText}>{item.address}</Text>
              </View>
            )}
            <View style={styles.acceptedNotice}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.acceptedText}>
                You can now contact the requester to arrange pickup or delivery
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Requests for "{donation.title}"</Text>
        <Text style={styles.subtitle}>
          {requests.length} request{requests.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={requests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.requestsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No requests yet</Text>
            <Text style={styles.emptySubtext}>
              When people request your donation, they'll appear here
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  requestsList: {
    padding: 16,
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 4,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  acceptedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptButton: {
    marginRight: 10,
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  privacyText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 8,
  },
  contactSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  contactSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  acceptedNotice: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default DonationRequestsScreen; 