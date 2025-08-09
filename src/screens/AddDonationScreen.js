import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import theme from '../../constants/theme';
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

const MAIN_CATEGORIES = Object.keys(CATEGORY_TREE);

const AddDonationScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(MAIN_CATEGORIES[0]);
  const [subcategory, setSubcategory] = useState(CATEGORY_TREE[MAIN_CATEGORIES[0]][0]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if current user is anonymous
  const isAnonymous = auth.currentUser?.isAnonymous;

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const convertImageToBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error('Failed to convert image');
    }
  };

  const handleSubmit = async () => {
    if (isAnonymous) {
      Alert.alert('Restricted', 'Anonymous users cannot add donations. Please sign up or log in.');
      return;
    }

    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!image) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'Please sign in to add donations');
        return;
      }

      // Convert image to Base64
      const imageBase64 = await convertImageToBase64(image.uri);

      const donationData = {
        title: title.trim(),
        description: description.trim(),
        category,
        subcategory,
        imageUrl: imageBase64, // Store Base64 string instead of URL
        donorId: currentUser.uid,
        requestedBy: [],
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'donations'), donationData);

      Alert.alert('Success', 'Donation added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error adding donation:', error);
      Alert.alert('Error', 'Failed to add donation: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onCategoryChange = (newCategory) => {
    setCategory(newCategory);
    const firstSub = CATEGORY_TREE[newCategory][0];
    setSubcategory(firstSub);
  };

  // Show restricted message for anonymous users
  if (isAnonymous) {
    return (
      <View style={styles.container}>
        <View style={styles.restrictedContainer}>
          <View style={styles.restrictedIcon}>
            <Text style={styles.restrictedIconText}>🔒</Text>
          </View>
          <Text style={styles.restrictedTitle}>Access Restricted</Text>
          <Text style={styles.restrictedMessage}>
            Anonymous users cannot add donations. To share items with the community, please sign up or log in with your account.
          </Text>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => {
              // Sign out to go back to login screen
              auth.signOut();
            }}
          >
            <Text style={styles.signUpButtonText}>Sign Up / Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Donation</Text>
          <Text style={styles.subtitle}>Share what you have to give</Text>
        </View>

        <View style={styles.form}>
          {/* Image Picker */}
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.selectedImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Title Input */}
          <TextInput
            style={styles.input}
            placeholder="Item Title *"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />

          {/* Category Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Category *</Text>
            <Picker
              selectedValue={category}
              onValueChange={onCategoryChange}
              style={styles.picker}
            >
              {MAIN_CATEGORIES.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>

          {/* Subcategory Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Subcategory *</Text>
            <Picker
              selectedValue={subcategory}
              onValueChange={setSubcategory}
              style={styles.picker}
            >
              {CATEGORY_TREE[category].map((sub) => (
                <Picker.Item key={sub} label={sub} value={sub} />
              ))}
            </Picker>
          </View>

          {/* Description Input */}
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description *"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Adding Donation...' : 'Add Donation'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  imageContainer: {
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.textPrimary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  label: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.muted,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Restricted view styles
  restrictedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  restrictedIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.chipBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  restrictedIconText: {
    fontSize: 40,
  },
  restrictedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  restrictedMessage: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  signUpButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddDonationScreen; 