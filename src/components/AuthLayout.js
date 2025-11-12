import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import theme from '../../constants/theme';

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.card}>{children}</View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </ScrollView>
  </KeyboardAvoidingView>
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 20,
    ...theme.shadows.card,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
});

export default AuthLayout;
