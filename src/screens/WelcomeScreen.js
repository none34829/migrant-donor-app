import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../../constants/theme';

const WelcomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/image.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to HAVN</Text>
        <Text style={styles.subtitle}>Helping All Voice be Noticed</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletIcon}>{'\u2022'}</Text>
            <Text style={[styles.paragraph, styles.bulletText]}>
              HAVN (Helping All Voice be Noticed) is a youth-led initiative in Singapore dedicated to making everyday life more welcoming for the city's migrant worker community.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletIcon}>{'\u2022'}</Text>
            <Text style={[styles.paragraph, styles.bulletText]}>
              From creating warm, social spaces in worker dormitories -- home to over 4,000 migrant workers -- to organizing festive food drives, donation networks, and community events, HAVN is built around one idea: <Text style={styles.highlight}>connection</Text>.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletIcon}>{'\u2022'}</Text>
            <Text style={[styles.paragraph, styles.bulletText]}>
              We also run workshops that bring Singaporean youth closer to the stories, challenges, and contributions of the migrant workforce, building empathy and understanding across communities.
            </Text>
          </View>
        </View>

        <View style={styles.appSection}>
          <Text style={styles.appTitle}>About this App</Text>
          <Text style={styles.paragraph}>
            This app connects migrant workers directly with donors, making it easy to request and receive everyday necessities. By using this platform, you help foster a caring, connected Singapore where everyone feels at home.
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
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
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  heroImage: {
    width: 240,
    height: 160,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    marginBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletIcon: {
    fontSize: 20,
    color: theme.colors.primary,
    marginRight: 12,
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
  },
  appSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.textPrimary,
    textAlign: 'left',
  },
  highlight: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
  actions: {
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
    ...theme.shadows.card,
  },
  primaryButtonText: {
    color: theme.colors.surface,
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WelcomeScreen;
