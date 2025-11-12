import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import theme from '../../constants/theme';
import AddressForm from '../components/AddressForm';
import AuthLayout from '../components/AuthLayout';
import { PrimaryButton, TextButton } from '../components/Buttons';
import { auth, db } from '../config/firebase';

const SignupScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState({});
  const [contactConsent, setContactConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !address?.line1 ||
      !address?.city ||
      !address?.postalCode ||
      !address?.country
    ) {
      setError('All fields are required, including the full address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName,
        lastName,
        email: email.trim(),
        address,
        contactConsent,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.message ?? 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign up"
      subtitle="Create your HAVN account."
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TextButton label="Log in" onPress={() => navigation.navigate('/auth/login')} />
        </View>
      }
    >
      <View style={styles.form}>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.flex]}
            placeholder="First name"
            placeholderTextColor={theme.colors.textSecondary}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={[styles.input, styles.flex]}
            placeholder="Last name"
            placeholderTextColor={theme.colors.textSecondary}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password (min 8 characters)"
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <AddressForm value={address} onChange={setAddress} />
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setContactConsent((prev) => !prev)}
        >
          <View style={[styles.checkbox, contactConsent && styles.checkboxChecked]} />
          <Text style={styles.checkboxLabel}>Contact me about HAVN opportunities</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton label="Create account" onPress={handleSignup} loading={loading} />
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
  },
  flex: {
    flex: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxLabel: {
    color: theme.colors.textSecondary,
  },
  error: {
    color: theme.colors.danger,
  },
  footerText: {
    color: theme.colors.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

export default SignupScreen;
