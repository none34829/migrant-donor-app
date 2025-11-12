import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import theme from '../../constants/theme';
import AddressForm from './AddressForm';
import { PrimaryButton } from './Buttons';
import CategoryPicker from './CategoryPicker';
import DeliveryTypePicker from './DeliveryTypePicker';
import SubcategoryDropdown from './SubcategoryDropdown';

const MODE_LABEL = {
  donation: 'New Donation',
  request: 'New Request',
  donationAgainstRequest: 'Donate against request',
};

const ItemForm = ({ mode = 'donation', initial = {}, onSubmit, submitLabel }) => {
  const [category, setCategory] = useState(initial.category ?? '');
  const [subcategory, setSubcategory] = useState(initial.subcategory ?? '');
  const [description, setDescription] = useState(initial.description ?? '');
  const [deliveryType, setDeliveryType] = useState(initial.deliveryType ?? '');
  const [address, setAddress] = useState(initial.address ?? {});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const buttonLabel = submitLabel ?? MODE_LABEL[mode] ?? 'Submit';

  const isDonationAgainstRequest = mode === 'donationAgainstRequest';

  const payload = useMemo(
    () => ({
      category,
      subcategory,
      description,
      deliveryType,
      address,
      title: subcategory || description?.slice(0, 32) || 'Item',
    }),
    [address, category, description, deliveryType, subcategory]
  );

  const handleSubmit = async () => {
    if (!category || !description || !deliveryType || !address?.line1) {
      setError('Category, Description, Delivery Type, and Address are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSubmit?.(payload);
    } catch (err) {
      setError(err.message ?? 'Something went wrong, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <CategoryPicker value={category} onChange={setCategory} />
      {category ? (
        <SubcategoryDropdown category={category} value={subcategory} onChange={setSubcategory} />
      ) : null}

      <View style={styles.field}>
        <Text style={styles.label}>Description (Free text)</Text>
        <TextInput
          multiline
          numberOfLines={4}
          style={styles.input}
          placeholder="Describe the item"
          placeholderTextColor={theme.colors.textSecondary}
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <DeliveryTypePicker value={deliveryType} onChange={setDeliveryType} />

      <AddressForm value={address} onChange={setAddress} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton
        label={isDonationAgainstRequest ? 'Confirm Donation' : buttonLabel}
        onPress={handleSubmit}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 14,
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
  },
  error: {
    color: theme.colors.danger,
    marginBottom: 12,
  },
});

export default ItemForm;
