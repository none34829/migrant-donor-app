import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import theme from '../../constants/theme';

const WelcomeScreen = ({ navigation }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.hero}>
      <Image source={require('../../assets/images/image.png')} style={styles.image} />
      <Text style={styles.title}>Welcome to HAVN</Text>
      <Text style={styles.subtitle}>Helping All Voices be Noticed.</Text>
    </View>
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>What do you want to do?</Text>
      <Text style={styles.panelCopy}>
        HAVN connects donors and migrant workers to share new or pre-loved items directly.
      </Text>
      <View style={styles.actions}>
        <PrimaryButton label="Log in" onPress={() => navigation.navigate('/auth/login')} />
        <SecondaryButton label="Sign up" onPress={() => navigation.navigate('/auth/signup')} />
      </View>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  image: {
    width: 260,
    height: 180,
    borderRadius: 24,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  panel: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  panelCopy: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginBottom: 24,
  },
  actions: {
    gap: 12,
  },
});

export default WelcomeScreen;
