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
import { auth, db } from '../config/firebase';

const CATEGORIES = [
  'Electronics',
  'Furniture',
  'Clothing',
  'Books',
  'Kitchen',
  'Sports',
  'Other',
];

const AddDonationScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronics');
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
      // Convert image to Base64
      const imageBase64 = await convertImageToBase64(image.uri);

      // Add donation to Firestore
      await addDoc(collection(db, 'donations'), {
        title: title.trim(),
        description: description.trim(),
        category,
        imageUrl: imageBase64, // Store Base64 string instead of URL
        donorId: auth.currentUser.uid,
        requestedBy: [],
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Donation added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add donation: ' + error.message);
    } finally {
      setLoading(false);
    }
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
              onValueChange={setCategory}
              style={styles.picker}
            >
              {CATEGORIES.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
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
    backgroundColor: '#f5f5f5',
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
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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
    backgroundColor: '#E5E5EA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D1D1D6',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  label: {
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#B0B0B0',
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
    backgroundColor: '#F8D7DA',
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
    color: '#721C24',
    marginBottom: 16,
    textAlign: 'center',
  },
  restrictedMessage: {
    fontSize: 16,
    color: '#721C24',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  signUpButton: {
    backgroundColor: '#007AFF',
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