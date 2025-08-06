import { useFocusEffect } from '@react-navigation/native';
import { arrayRemove, arrayUnion, collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DonationCard from '../components/DonationCard';
import { auth, db } from '../config/firebase';

const CATEGORIES = [
  'All',
  'Electronics',
  'Furniture',
  'Clothing',
  'Books',
  'Kitchen',
  'Sports',
  'Other',
];

const HomeScreen = ({ navigation }) => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Check if current user is anonymous
  const isAnonymous = auth.currentUser?.isAnonymous;

  useEffect(() => {
    fetchDonations();
  }, []);

  // Refresh donations when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchDonations();
    }, [])
  );

  useEffect(() => {
    filterDonations();
  }, [donations, searchQuery, selectedCategory]);

  const fetchDonations = async () => {
    try {
      console.log('Fetching all donations...');
      const q = query(collection(db, 'donations'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      console.log('Total donations in database:', querySnapshot.size);
      
      const donationsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });
      console.log('Donations loaded:', donationsData.length);
      setDonations(donationsData);
    } catch (error) {
      console.error('Error fetching donations:', error);
      Alert.alert('Error', 'Failed to fetch donations: ' + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterDonations = () => {
    let filtered = donations;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(donation => 
        donation.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(donation =>
        donation.title.toLowerCase().includes(query) ||
        donation.description.toLowerCase().includes(query) ||
        donation.category.toLowerCase().includes(query)
      );
    }

    setFilteredDonations(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDonations();
  };

  const handleDonationPress = (donation) => {
    navigation.navigate('DonationDetail', { donation });
  };

  const handleRequestItem = async (donation) => {
    if (isAnonymous) {
      // Instantly sign out to redirect to login/signup
      auth.signOut();
      return;
    }

    try {
      const currentUser = auth.currentUser;
      console.log('Requesting item - Current user:', currentUser?.uid);
      console.log('Donation donorId:', donation.donorId);
      
      if (!currentUser) {
        Alert.alert('Error', 'Please sign in to request items');
        return;
      }

      // Check if user is requesting their own donation
      if (donation.donorId === currentUser.uid) {
        Alert.alert('Cannot Request', 'You cannot request your own donation');
        return;
      }

      // Check if already requested
      const isAlreadyRequested = donation.requestedBy && donation.requestedBy.includes(currentUser.uid);
      console.log('Already requested:', isAlreadyRequested);
      console.log('Current requestedBy array:', donation.requestedBy);
      
      if (isAlreadyRequested) {
        // Cancel request
        const donationRef = doc(db, 'donations', donation.id);
        await updateDoc(donationRef, {
          requestedBy: arrayRemove(currentUser.uid)
        });
        console.log('Request cancelled for user:', currentUser.uid);
        Alert.alert('Request Cancelled', 'Your request has been cancelled');
      } else {
        // Add request
        const donationRef = doc(db, 'donations', donation.id);
        await updateDoc(donationRef, {
          requestedBy: arrayUnion(currentUser.uid)
        });
        console.log('Request added for user:', currentUser.uid);
        Alert.alert('Request Sent', `Your request for "${donation.title}" has been sent to the donor`);
      }

      // Refresh the donations list
      fetchDonations();
    } catch (error) {
      console.error('Error requesting item:', error);
      Alert.alert('Error', 'Failed to process your request. Please try again.');
    }
  };

  const renderDonationItem = ({ item }) => (
    <DonationCard
      donation={item}
      onPress={() => handleDonationPress(item)}
      onRequest={() => handleRequestItem(item)}
      isAnonymous={isAnonymous}
    />
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.selectedCategoryButton,
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === item && styles.selectedCategoryButtonText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading donations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Anonymous User Banner */}
      {isAnonymous && (
        <View style={styles.anonymousBanner}>
          <Text style={styles.anonymousBannerText}>
            🔒 Anonymous Mode - You can browse donations but cannot request items or add donations
          </Text>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search donations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Donations List */}
      <FlatList
        data={filteredDonations}
        renderItem={renderDonationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.donationsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory !== 'All'
                ? 'No donations found matching your criteria'
                : 'No donations available yet'}
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
  anonymousBanner: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFEAA7',
  },
  anonymousBannerText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    fontWeight: '500',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedCategoryButton: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: 'white',
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
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen; 