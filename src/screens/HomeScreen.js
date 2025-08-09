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
import theme from '../../constants/theme';
import DonationCard from '../components/DonationCard';
import { auth, db } from '../config/firebase';

const CATEGORY_TREE = {
  'Clothes': [
    'Shirts', 'T-shirts', 'Shorts', 'Pants', 'Skirts', 'Dress', 'Night suit',
    'Jackets', 'Hoodies', 'Woolens', 'Gym wear', 'Others'
  ],
  'Shoes, accessories': [
    'Formal shoes', 'Sports shoes', 'Sandals', 'Slippers', 'Watch', 'Jewellery'
  ],
  'Toiletries': [
    'Soap', 'Shampoo conditioner', 'Toothpaste', 'Toothbrush', 'Hairbrush',
    'Moisturizer cream', 'Deodorant', 'Makeup kit', 'Makeup remover',
    'Sunscreen', 'Razor', 'Shaving gel', 'Others'
  ],
  'Electric and Electronics': [
    'Phone', 'Computer', 'Laptop', 'Microwave', 'Lamp', 'Table fan',
    'Mixer grinder', 'Others'
  ],
  'Food (dry or packaged only)': [
    'Spices', 'Dals', 'Atta', 'Rice', 'Health snacks', 'Sweets', 'Chocolate',
    'Cookies', 'Chips', 'Others'
  ],
  'Sports': [
    'Cricket bat/ ball set', 'Football', 'Basketball', 'Hockey', 'Tennis', 'Others'
  ],
  'Toys': [
    'Puzzles', 'Building blocks', 'Board games', 'Soft toys', 'Bath toys',
    'Play dough', 'Kitchen set', 'Figurines', 'Dolls', 'Cars , other vehicles',
    'Others'
  ],
  'Furniture and furnishing': [
    'Chairs', 'Dining Table', 'Study table', 'Side table', 'Cabinet', 'Curtains',
    'Bed', 'Mattress', 'Others'
  ],
  'Kitchen stuff': [
    'Pans', 'Pots', 'Pressure cooker', 'Tawa', 'Wok', 'Spice jars',
    'Water bottle', 'Water Jugs', 'Plates', 'Glasses', 'Crockery', 'Cutlery',
    'Others'
  ],
  'Others': ['Others']
};

const MAIN_CATEGORIES = ['All', ...Object.keys(CATEGORY_TREE)];

const HomeScreen = ({ navigation }) => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [openDropdownFor, setOpenDropdownFor] = useState(null);
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
  }, [donations, searchQuery, selectedCategory, selectedSubcategory]);

  const fetchDonations = async () => {
    try {
      const q = query(collection(db, 'donations'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const donationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
      filtered = filtered.filter(donation => donation.category === selectedCategory);
      if (selectedSubcategory) {
        filtered = filtered.filter(donation => donation.subcategory === selectedSubcategory);
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(donation =>
        donation.title.toLowerCase().includes(q) ||
        donation.description.toLowerCase().includes(q) ||
        donation.category.toLowerCase().includes(q) ||
        (donation.subcategory?.toLowerCase?.().includes(q))
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
      
      if (isAlreadyRequested) {
        // Cancel request
        const donationRef = doc(db, 'donations', donation.id);
        await updateDoc(donationRef, { requestedBy: arrayRemove(currentUser.uid) });
        Alert.alert('Request Cancelled', 'Your request has been cancelled');
      } else {
        // Add request
        const donationRef = doc(db, 'donations', donation.id);
        await updateDoc(donationRef, { requestedBy: arrayUnion(currentUser.uid) });
        Alert.alert('Request Sent', `Your request for "${donation.title}" has been sent to the donor`);
      }

      // Refresh the donations list
      fetchDonations();
    } catch (error) {
      console.error('Error requesting item:', error);
      Alert.alert('Error', 'Failed to process your request. Please try again.');
    }
  };

  const onPressCategory = (parent) => {
    if (parent === 'All') {
      setSelectedCategory('All');
      setSelectedSubcategory(null);
      setOpenDropdownFor(null);
      return;
    }
    setSelectedCategory(parent);
    setSelectedSubcategory(null);
    setOpenDropdownFor((prev) => (prev === parent ? null : parent));
  };

  const onSelectSubcategory = (sub) => {
    setSelectedSubcategory(sub);
    setOpenDropdownFor(null);
  };

  const renderCategoryChip = (parent) => (
    <View key={parent} style={styles.categoryGroup}>
      <TouchableOpacity
        style={[styles.categoryButton, selectedCategory === parent && styles.selectedCategoryButton]}
        onPress={() => onPressCategory(parent)}
      >
        <Text style={[styles.categoryButtonText, selectedCategory === parent && styles.selectedCategoryButtonText]}>
          {parent}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDonationItem = ({ item }) => (
    <DonationCard
      donation={item}
      onPress={() => handleDonationPress(item)}
      onRequest={() => handleRequestItem(item)}
      isAnonymous={isAnonymous}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading donations...</Text>
      </View>
    );
  }

  const openSubs = openDropdownFor && CATEGORY_TREE[openDropdownFor];

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

      {/* Categories with dropdown */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={MAIN_CATEGORIES}
          renderItem={({ item }) => (
            item === 'All' ? (
              <TouchableOpacity
                style={[styles.categoryButton, selectedCategory === 'All' && styles.selectedCategoryButton]}
                onPress={() => onPressCategory('All')}
              >
                <Text style={[styles.categoryButtonText, selectedCategory === 'All' && styles.selectedCategoryButtonText]}>All</Text>
              </TouchableOpacity>
            ) : (
              renderCategoryChip(item)
            )
          )}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />

        {openSubs && (
          <View style={styles.subcategoriesContainer}>
            {openSubs.map((sub) => (
              <TouchableOpacity
                key={sub}
                style={[styles.subcategoryChip, selectedSubcategory === sub && styles.subcategoryChipSelected]}
                onPress={() => onSelectSubcategory(sub)}
              >
                <Text style={[styles.subcategoryText, selectedSubcategory === sub && styles.subcategoryTextSelected]}>
                  {sub}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedCategory !== 'All' && selectedSubcategory && (
          <View style={styles.currentFilterBar}>
            <Text style={styles.currentFilterText}>
              Filtering by: {selectedCategory} → {selectedSubcategory}
            </Text>
            <TouchableOpacity onPress={() => { setSelectedSubcategory(null); }}>
              <Text style={styles.clearFilterText}>Clear subcategory</Text>
            </TouchableOpacity>
          </View>
        )}
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
              {searchQuery || selectedCategory !== 'All' || selectedSubcategory
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
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  anonymousBanner: {
    backgroundColor: theme.colors.chipBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  anonymousBannerText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    fontWeight: '500',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchInput: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.textPrimary,
  },
  categoriesContainer: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryGroup: {
    marginRight: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.chipBackground,
  },
  selectedCategoryButton: {
    backgroundColor: theme.colors.chipSelectedBackground,
  },
  categoryButtonText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: theme.colors.chipSelectedText,
  },
  subcategoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  subcategoryChip: {
    backgroundColor: theme.colors.chipBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  subcategoryChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  subcategoryText: {
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  subcategoryTextSelected: {
    color: theme.colors.chipSelectedText,
    fontWeight: '600',
  },
  currentFilterBar: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  currentFilterText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  clearFilterText: {
    fontSize: 13,
    color: theme.colors.accent,
    marginTop: 4,
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
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen; 