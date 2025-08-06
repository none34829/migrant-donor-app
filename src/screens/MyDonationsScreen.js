import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
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
import DonationCard from '../components/DonationCard';
import { auth, db } from '../config/firebase';

const MyDonationsScreen = ({ navigation }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyDonations();
  }, []);

  // Refresh donations when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchMyDonations();
    }, [])
  );

  const fetchMyDonations = async () => {
    try {
      const currentUser = auth.currentUser;
      console.log('Current user:', currentUser?.uid);
      
      if (!currentUser) {
        console.log('No current user found');
        setDonations([]);
        return;
      }

      console.log('Fetching donations for user:', currentUser.uid);
      
      // Now try to fetch user's donations - without orderBy to avoid index requirement
      let q = query(
        collection(db, 'donations'),
        where('donorId', '==', currentUser.uid)
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
      
      console.log('Total donations found:', donationsData.length);
      setDonations(donationsData);
    } catch (error) {
      console.error('Error fetching donations:', error);
      Alert.alert('Error', 'Failed to fetch your donations: ' + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyDonations();
  };

  const handleDonationPress = (donation) => {
    navigation.navigate('DonationDetail', { donation });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your donations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Donations</Text>
        <Text style={styles.subtitle}>Donations you've shared ({donations.length})</Text>
      </View>

      <FlatList
        data={donations}
        renderItem={({ item }) => (
          <DonationCard
            donation={item}
            onPress={() => handleDonationPress(item)}
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
              You haven't shared any donations yet
            </Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add your first donation
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('Main', { screen: 'Add' })}
            >
              <Text style={styles.addButtonText}>Add Donation</Text>
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
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyDonationsScreen; 