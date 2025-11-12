import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '../../constants/theme';
import CategoryPicker from '../components/CategoryPicker';
import { OfferList } from '../components/ItemList';
import { useAppData } from '../context/AppDataContext';

const OffersByCategoryScreen = ({ navigation }) => {
  const { categoryOptions, offers } = useAppData();
  const [category, setCategory] = useState(categoryOptions[0]);

  const filtered = useMemo(
    () => offers.filter((item) => !category || item.category === category),
    [category, offers]
  );

  return (
    <View style={styles.container}>
      <CategoryPicker value={category} onChange={setCategory} options={categoryOptions} />
      <OfferList
        items={filtered}
        onSelect={(id) => navigation.navigate('/receive/offers/:offerId', { offerId: id })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.background,
  },
});

export default OffersByCategoryScreen;
