import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { countries, iso2ToFlagEmoji } from '../../constants/countryCodes';
import theme from '../../constants/theme';
import { auth, db } from '../config/firebase';

const countryCodeToLength = {
  '+1': 10, // USA/Canada
  '+44': 10, // UK typical national significant number length (varies 9-10)
  '+61': 9, // Australia (9 digits without leading 0)
  '+81': 10, // Japan (varies 9-10)
  '+91': 10, // India
  '+971': 9, // UAE (typically 9)
  '+65': 8, // Singapore
  '+49': 10, // Germany (varies widely 7-11)
};

const getExpectedLocalLength = (code) => countryCodeToLength[code] ?? null; // fallback handled below

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd');
        const data = await res.json();
        const mapped = data
          .map((c) => {
            const iso2 = c.cca2;
            const name = c?.name?.common;
            const root = c?.idd?.root; // e.g., '+1'
            const suffixes = c?.idd?.suffixes; // e.g., ['684']
            if (!iso2 || !name || !root) return null;
            const dial_code = suffixes && suffixes.length > 0 ? `${root}${suffixes[0]}` : `${root}`;
            return { iso2, name, dial_code };
          })
          .filter(Boolean);
        const unique = [];
        const seen = new Set();
        for (const item of mapped) {
          if (!seen.has(item.iso2)) {
            seen.add(item.iso2);
            unique.push(item);
          }
        }
        setCountryList(unique);
      } catch (e) {
        setCountryList([]);
      }
    };
    loadCountries();
  }, []);

  const sortedCountries = useMemo(() => {
    const src = countryList.length ? countryList : countries;
    const sorted = src.slice().sort((a, b) => a.name.localeCompare(b.name));
    
    if (!searchQuery.trim()) return sorted;
    
    const query = searchQuery.toLowerCase();
    return sorted.filter(country => 
      country.name.toLowerCase().includes(query) ||
      country.iso2.toLowerCase().includes(query) ||
      country.dial_code.includes(query)
    );
  }, [countryList, searchQuery]);

  const validatePhone = (cc, num) => {
    const trimmedCode = cc.trim();
    const trimmedNum = num.trim();

    if (!/^\+[0-9]{1,3}$/.test(trimmedCode)) {
      Alert.alert('Invalid Country Code', 'Enter a valid country code like +1, +44, +91');
      return false;
    }

    if (!/^[0-9]+$/.test(trimmedNum)) {
      Alert.alert('Invalid Phone Number', 'Phone number should contain digits only');
      return false;
    }

    const expected = getExpectedLocalLength(trimmedCode);
    if (expected) {
      if (trimmedNum.length !== expected) {
        Alert.alert(
          'Invalid Phone Number',
          `For country code ${trimmedCode}, the phone number should be ${expected} digits`
        );
        return false;
      }
    } else {
      if (trimmedNum.length < 6 || trimmedNum.length > 14) {
        Alert.alert('Invalid Phone Number', 'Phone number length looks incorrect');
        return false;
      }
    }

    return true;
  };

  const handleCountrySelect = (c) => {
    console.log('Country selected:', c);
    console.log('Setting countryCode to:', c.dial_code);
    console.log('Setting selectedCountry to:', c.iso2);
    setSelectedCountry(c.iso2);
    setCountryCode(c.dial_code);
    setSearchQuery(''); // Clear search when country is selected
    setPickerOpen(false);
  };

  const openCountryPicker = () => {
    setSearchQuery(''); // Clear search when opening picker
    setPickerOpen(true);
  };

  const closeCountryPicker = () => {
    setSearchQuery(''); // Clear search when closing picker
    setPickerOpen(false);
  };

  const handleSignup = async () => {
    console.log('Signup attempt - State values:', {
      name,
      email,
      password: password ? '***' : 'empty',
      confirmPassword: confirmPassword ? '***' : 'empty',
      countryCode,
      selectedCountry,
      phoneNumber,
      address
    });

    if (!name || !email || !password || !confirmPassword || !countryCode || !phoneNumber || !address) {
      console.log('Validation failed - missing fields:', {
        hasName: !!name,
        hasEmail: !!email,
        hasPassword: !!password,
        hasConfirmPassword: !!confirmPassword,
        hasCountryCode: !!countryCode,
        hasPhoneNumber: !!phoneNumber,
        hasAddress: !!address
      });
      Alert.alert('Error', 'Please fill in all required fields including country code');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (!validatePhone(countryCode, phoneNumber)) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const combinedContact = `${countryCode.trim()} ${phoneNumber.trim()}`;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        contact: combinedContact,
        contactCountryCode: countryCode.trim(),
        contactNumber: phoneNumber.trim(),
        address: address.trim(),
        anonymous: false,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the Migrant Donor community</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            placeholderTextColor={theme.colors.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Email *"
            placeholderTextColor={theme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Password *"
            placeholderTextColor={theme.colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password *"
            placeholderTextColor={theme.colors.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Address *"
            placeholderTextColor={theme.colors.textSecondary}
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />

          <View style={styles.phoneSection}>
            <Text style={styles.sectionLabel}>Phone Number *</Text>
            <View style={styles.phoneRow}>
              <Pressable 
                style={[
                  styles.input, 
                  styles.countryCodePicker, 
                  !countryCode && styles.requiredField
                ]} 
                onPress={openCountryPicker}
              >
                <Text style={[styles.countryCodeText, !countryCode && styles.placeholderText]}>
                  {countryCode ? `${iso2ToFlagEmoji(selectedCountry)} ${countryCode}` : 'Country Code *'}
                </Text>
              </Pressable>
              <TextInput
                style={[styles.input, styles.phoneNumberInput]}
                placeholder="Phone Number *"
                placeholderTextColor={theme.colors.textSecondary}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.backToWelcome}>
          <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
            <Text style={styles.backToWelcomeText}>← Back to Welcome</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={pickerOpen} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={closeCountryPicker} />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <TouchableOpacity onPress={closeCountryPicker}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.modalSearchInput}
            placeholder="Search countries..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <FlatList
            data={sortedCountries}
            keyExtractor={(item) => item.iso2}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.countryRow} onPress={() => handleCountrySelect(item)}>
                <Text style={styles.countryFlag}>{iso2ToFlagEmoji(item.iso2)}</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryDial}>{item.dial_code}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptySearchContainer}>
                <Text style={styles.emptySearchText}>
                  {searchQuery.trim() ? 'No countries found' : 'Loading countries...'}
                </Text>
              </View>
            }
          />
        </View>
      </Modal>
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
    paddingTop: 40,
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
    marginBottom: 30,
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
  phoneRow: {
    flexDirection: 'row',
    gap: 12,
  },
  countryCodePicker: {
    flexBasis: 120,
    flexGrow: 0,
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  placeholderText: {
    color: theme.colors.textSecondary,
  },
  phoneNumberInput: {
    flex: 1,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.muted,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  linkText: {
    fontSize: 16,
    color: theme.colors.accent,
    fontWeight: '600',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  requiredField: {
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
  phoneSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  // Country picker modal
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    bottom: 60,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  modalClose: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
  modalSearchInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.textPrimary,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  countryFlag: {
    fontSize: 22,
    marginRight: 12,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  countryDial: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  emptySearchContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptySearchText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  backToWelcome: {
    marginTop: 20,
    alignItems: 'center',
  },
  backToWelcomeText: {
    fontSize: 16,
    color: theme.colors.accent,
    fontWeight: '600',
  },
});

export default SignupScreen; 