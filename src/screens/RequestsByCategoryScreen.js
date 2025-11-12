import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '../../constants/theme';
import CategoryPicker from '../components/CategoryPicker';
import { RequestList } from '../components/ItemList';
import { useAppData } from '../context/AppDataContext';

const RequestsByCategoryScreen = ({ navigation }) => {
  const { categoryOptions, requests } = useAppData();
  const [category, setCategory] = useState(categoryOptions[0]);

  const filtered = useMemo(
    () => requests.filter((item) => !category || item.category === category),
    [category, requests]
  );

  return (
    <View style={styles.container}>
      <CategoryPicker value={category} onChange={setCategory} options={categoryOptions} />
      <RequestList
        items={filtered}
        onSelect={(id) => navigation.navigate('/donate/requests/:requestId', { requestId: id })}
        onEmptyAction={() => navigation.navigate('/donate/new')}
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

export default RequestsByCategoryScreen;
