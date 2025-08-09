import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import theme from '../../constants/theme';
import { auth, db } from '../config/firebase';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [saving, setSaving] = useState(false);

  // Check if current user is anonymous
  const isAnonymous = auth.currentUser?.isAnonymous;

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      if (isAnonymous) {
        setUser({
          name: 'Anonymous User',
          email: 'anonymous@example.com',
          contact: 'Not available',
          address: 'Not available',
          anonymous: true,
        });
        setName('Anonymous User');
        setContact('Not available');
        setAddress('Not available');
        setAnonymous(true);
      } else {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          setName(userData.name || '');
          setContact(userData.contact || '');
          setAddress(userData.address || '');
          setAnonymous(userData.anonymous || false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (isAnonymous) {
      Alert.alert('Restricted', 'Anonymous users cannot edit their profile. Please sign up or log in.');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name: name.trim(),
        contact: contact.trim(),
        address: address.trim(),
        anonymous,
        updatedAt: new Date(),
      });

      setUser({
        ...user,
        name: name.trim(),
        contact: contact.trim(),
        address: address.trim(),
        anonymous,
      });

      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out: ' + error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account</Text>
        {isAnonymous && (
          <View style={styles.anonymousBanner}>
            <Text style={styles.anonymousBannerText}>🔒 Anonymous Mode - Limited Access</Text>
          </View>
        )}
      </View>

      <View style={styles.profileSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {!isAnonymous && (
            <TouchableOpacity style={styles.editButton} onPress={() => setEditing(!editing)}>
              <Text style={styles.editButtonText}>{editing ? 'Cancel' : 'Edit'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {isAnonymous && (
          <View style={styles.restrictedMessage}>
            <Text style={styles.restrictedText}>
              Profile editing is not available for anonymous users. Sign up or log in to access full features.
            </Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name</Text>
          {editing && !isAnonymous ? (
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" />
          ) : (
            <Text style={styles.value}>{user?.name || 'Not set'}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{auth.currentUser.email || 'Anonymous'}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Contact Number</Text>
          {editing && !isAnonymous ? (
            <TextInput
              style={styles.input}
              value={contact}
              onChangeText={setContact}
              placeholder="Enter contact number"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{user?.contact || 'Not set'}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Address</Text>
          {editing && !isAnonymous ? (
            <TextInput
              style={[styles.input, styles.textArea]}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
              multiline
              numberOfLines={3}
            />
          ) : (
            <Text style={styles.value}>{user?.address || 'Not set'}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Anonymous Mode</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>{anonymous ? 'Enabled' : 'Disabled'}</Text>
            <Switch value={anonymous} onValueChange={setAnonymous} disabled={!editing || isAnonymous} />
          </View>
        </View>

        {editing && !isAnonymous && (
          <TouchableOpacity style={[styles.saveButton, saving && styles.saveButtonDisabled]} onPress={handleSave} disabled={saving}>
            <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={[styles.actionButton, isAnonymous && styles.disabledButton]}
          onPress={() => (isAnonymous ? Alert.alert('Restricted', 'My Donations is not available for anonymous users.') : navigation.navigate('MyDonations'))}
          disabled={isAnonymous}
        >
          <Text style={[styles.actionButtonText, isAnonymous && styles.disabledButtonText]}>My Donations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, isAnonymous && styles.disabledButton]}
          onPress={() => (isAnonymous ? Alert.alert('Restricted', 'My Requests is not available for anonymous users.') : navigation.navigate('MyRequests'))}
          disabled={isAnonymous}
        >
          <Text style={[styles.actionButtonText, isAnonymous && styles.disabledButtonText]}>My Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.signOutButton]} onPress={handleSignOut}>
          <Text style={[styles.actionButtonText, styles.signOutButtonText]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
  },
  anonymousBanner: {
    backgroundColor: theme.colors.chipBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  anonymousBannerText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  profileSection: {
    backgroundColor: theme.colors.surface,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  restrictedMessage: {
    backgroundColor: theme.colors.chipBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  restrictedText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.textPrimary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.muted,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  actionsSection: {
    margin: 16,
  },
  actionButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionButtonText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: theme.colors.background,
    opacity: 0.6,
  },
  disabledButtonText: {
    color: theme.colors.textSecondary,
  },
  signOutButton: {
    backgroundColor: theme.colors.danger,
    marginTop: 20,
  },
  signOutButtonText: {
    color: 'white',
  },
});

export default ProfileScreen; 