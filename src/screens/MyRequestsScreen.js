import { useFocusEffect } from '@react-navigation/native';
import { arrayRemove, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import DonationCard from '../components/DonationCard';
import { auth, db } from '../config/firebase';

const MyRequestsScreen = ({ navigation }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  // Refresh requests when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchMyRequests();
    }, [])
  );

  const fetchMyRequests = async () => {
    try {
      const currentUser = auth.currentUser;
      console.log('Current user:', currentUser?.uid);
      
      if (!currentUser) {
        console.log('No current user found');
        setDonations([]);
        return;
      }

      console.log('Fetching requests for user:', currentUser.uid);
      
      // Now try to fetch user's donations - without orderBy to avoid index requirement
      let q = query(
        collection(db, 'donations'),
        where('requestedBy', 'array-contains', currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      console.log('Query snapshot size:', querySnapshot.size);
      
      const donationsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });
      
      // Sort manually if we have data
      donationsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });
      
      console.log('Total requests found:', donationsData.length);
      setDonations(donationsData);
    } catch (error) {
      console.error('Error fetching requests:', error);
      Alert.alert('Error', 'Failed to fetch your requests: ' + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyRequests();
  };

  const handleDonationPress = (donation) => {
    navigation.navigate('DonationDetail', { donation });
  };

  const handleCancelRequest = async (donation) => {
    Alert.alert(
      'Cancel Request',
      `Are you sure you want to cancel your request for "${donation.title}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              const currentUser = auth.currentUser;
              if (!currentUser) {
                Alert.alert('Error', 'Please sign in to cancel requests');
                return;
              }

              const donationRef = doc(db, 'donations', donation.id);
              const acceptedRequests = donation.acceptedRequests || [];
              
              // Remove from both requestedBy and acceptedRequests
              await updateDoc(donationRef, {
                requestedBy: arrayRemove(currentUser.uid),
                acceptedRequests: acceptedRequests.filter(id => id !== currentUser.uid)
              });
              
              Alert.alert('Request Cancelled', 'Your request has been cancelled');
              fetchMyRequests(); // Refresh the list
            } catch (error) {
              console.error('Error cancelling request:', error);
              Alert.alert('Error', 'Failed to cancel request. Please try again.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Requests</Text>
        <Text style={styles.subtitle}>Items you've requested</Text>
      </View>

      <FlatList
        data={donations}
        renderItem={({ item }) => (
          <DonationCard
            donation={item}
            onPress={() => handleDonationPress(item)}
            onRequest={() => handleCancelRequest(item)}
            isRequested={true}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.donationsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You haven't requested any items yet
            </Text>
            <Text style={styles.emptySubtext}>
              Browse donations on the Home tab to request items
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('Main', { screen: 'Home' })}
            >
              <Text style={styles.browseButtonText}>Browse Donations</Text>
            </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  donationsList: {
    paddingVertical: 8,
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyRequestsScreen; 