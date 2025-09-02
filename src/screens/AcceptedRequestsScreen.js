import { Ionicons } from '@expo/vector-icons';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
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
import { auth, db } from '../config/firebase';

const AcceptedRequestsScreen = ({ navigation }) => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAcceptedRequests();
  }, []);

  const fetchAcceptedRequests = async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      
      console.log('Fetching accepted requests for user:', currentUser?.uid);
      
      if (!currentUser) {
        setAcceptedRequests([]);
        return;
      }

      // First, let's try to fetch all donations and filter manually to debug
      console.log('Trying to fetch all donations first...');
      const allDonationsQuery = query(collection(db, 'donations'));
      const allDonationsSnapshot = await getDocs(allDonationsQuery);
      console.log('All donations found:', allDonationsSnapshot.size);
      
      // Filter donations where current user's request has been accepted
      const requestsData = [];
      
      for (const docSnapshot of allDonationsSnapshot.docs) {
        const donationData = docSnapshot.data();
        console.log('Checking donation:', donationData.title);
        console.log('Donation acceptedRequests:', donationData.acceptedRequests);
        console.log('Current user ID:', currentUser.uid);
        
        // Check if this donation has the current user in acceptedRequests
        if (donationData.acceptedRequests && donationData.acceptedRequests.includes(currentUser.uid)) {
          console.log('Found accepted request for donation:', donationData.title);
          
          // Fetch donor information
          try {
            const donorDoc = await getDoc(doc(db, 'users', donationData.donorId));
            if (donorDoc.exists()) {
              requestsData.push({
                id: docSnapshot.id,
                ...donationData,
                donorInfo: donorDoc.data(),
              });
            }
                     } catch (error) {
             console.error('Error fetching donor info:', error);
           }
         }
       }

       console.log('Final requests data:', requestsData);

      // Sort by creation date (newest first)
      requestsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });

      setAcceptedRequests(requestsData);
    } catch (error) {
      console.error('Error fetching accepted requests:', error);
      Alert.alert('Error', 'Failed to fetch accepted requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAcceptedRequests();
  };

  const handleDonationPress = (donation) => {
    navigation.navigate('DonationDetail', { donation });
  };

  const renderAcceptedRequestItem = ({ item }) => (
    <View style={styles.requestCard}>
      <TouchableOpacity onPress={() => handleDonationPress(item)}>
        <View style={styles.requestHeader}>
          <View style={styles.donationInfo}>
            <Text style={styles.donationTitle}>{item.title}</Text>
            <Text style={styles.donationCategory}>{item.category}</Text>
          </View>
          <View style={styles.acceptedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.acceptedText}>Accepted</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.donorSection}>
        <Text style={styles.donorSectionTitle}>Donor Information</Text>
        <Text style={styles.donorName}>{item.donorInfo.name}</Text>
        
        {item.donorInfo.contact && (
          <View style={styles.contactInfo}>
            <Ionicons name="call-outline" size={16} color="#666" />
            <Text style={styles.contactText}>{item.donorInfo.contact}</Text>
          </View>
        )}
        
        {item.donorInfo.address && (
          <View style={styles.contactInfo}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.contactText}>{item.donorInfo.address}</Text>
          </View>
        )}
      </View>

      <View style={styles.actionSection}>
        <Text style={styles.actionText}>
          You can now contact the donor to arrange pickup or delivery
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading accepted requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Accepted Requests</Text>
        <Text style={styles.subtitle}>
          {acceptedRequests.length} accepted request{acceptedRequests.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={acceptedRequests}
        renderItem={renderAcceptedRequestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.requestsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No accepted requests yet</Text>
            <Text style={styles.emptySubtext}>
              When donors accept your requests, they'll appear here with contact information
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
    marginBottom: 16,
  },
  donationInfo: {
    flex: 1,
  },
  donationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  donationCategory: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  acceptedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '600',
  },
  donorSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  donorSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  donorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  actionSection: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
  },
  actionText: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: '500',
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

export default AcceptedRequestsScreen;

