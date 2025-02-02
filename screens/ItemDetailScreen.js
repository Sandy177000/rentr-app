// screens/ItemDetailsScreen.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../src/theme/ThemeProvider';
import CustomText from '../src/components/CustomText';
export const ItemDetailsScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { item } = route.params;

  const handleRent = () => {
    // Implement rental logic
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CustomText style={[styles.title, { color: theme.colors.text.primary }]}>{item.title}</CustomText>
      <CustomText style={[styles.description, { color: theme.colors.text.secondary }]}>{item.description}</CustomText>
      <CustomText style={[styles.price, { color: theme.colors.text.secondary }]}>${item.price}/day</CustomText>
      <TouchableOpacity
        style={[styles.rentButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleRent}
      >
        <CustomText style={{ color: '#FFFFFF', fontWeight: '600' }}>Rent Now</CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  itemCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 20,
  },
  rentButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});