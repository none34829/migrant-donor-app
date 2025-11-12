import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import theme from '../../constants/theme';
import { SecondaryButton } from './Buttons';
import ItemCard from './ItemCard';

const BaseItemList = ({
  items,
  actionLabel,
  onSelect,
  emptyState,
  onEmptyAction,
  contentContainerStyle,
}) => {
  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{emptyState?.title ?? 'No items yet'}</Text>
      {emptyState?.subtitle ? <Text style={styles.emptySubtitle}>{emptyState.subtitle}</Text> : null}
      {emptyState?.ctaLabel ? (
        <SecondaryButton label={emptyState.ctaLabel} onPress={onEmptyAction} />
      ) : null}
    </View>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ItemCard item={item} actionLabel={actionLabel} onPress={() => onSelect(item.id)} />
      )}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={[styles.list, contentContainerStyle]}
    />
  );
};

export const RequestList = (props) => (
  <BaseItemList
    actionLabel="Donate"
    emptyState={{
      title: 'No requests yet',
      subtitle: 'Be the first to support someone in need.',
      ctaLabel: 'New Donation',
    }}
    {...props}
  />
);

export const OfferList = (props) => (
  <BaseItemList
    actionLabel="Receive"
    emptyState={{
      title: 'No items offered yet',
      subtitle: 'Check back soon or submit your own request.',
    }}
    {...props}
  />
);

export const ItemList = BaseItemList;

const styles = StyleSheet.create({
  list: {
    paddingBottom: 24,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default BaseItemList;
