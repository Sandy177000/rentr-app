// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../src/theme/ThemeProvider';

export const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch items from API
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.itemCard, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.text.secondary 
      }]}
      onPress={() => navigation.navigate('ItemDetails', { item })}
    >
      <Text style={[styles.itemTitle, { color: theme.colors.text.primary }]}>{item.title}</Text>
      <Text style={[styles.itemPrice, { color: theme.colors.text.secondary }]}>${item.price}/day</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
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
});