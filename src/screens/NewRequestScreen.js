import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../constants/theme';
import ItemForm from '../components/ItemForm';
import { useAppData } from '../context/AppDataContext';

const NewRequestScreen = ({ navigation }) => {
  const { createRequest } = useAppData();

  const handleSubmit = async (payload) => {
    await createRequest(payload);
    navigation.navigate('/receive/mine');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a new request</Text>
      <ItemForm mode="request" onSubmit={handleSubmit} submitLabel="Save request" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
});

export default NewRequestScreen;
