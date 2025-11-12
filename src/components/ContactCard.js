import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../constants/theme';

const ContactCard = ({ title, contact }) => {
  if (!contact) return null;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.name}>
        {contact.firstName} {contact.lastName}
      </Text>
      <Text style={styles.detail}>{contact.email}</Text>
      {contact.phone ? <Text style={styles.detail}>{contact.phone}</Text> : null}
      {contact.address?.line1 ? (
        <Text style={styles.detail}>
          {contact.address.line1}
          {contact.address.city ? `, ${contact.address.city}` : ''}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontSize: 13,
    textTransform: 'uppercase',
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});

export default ContactCard;
