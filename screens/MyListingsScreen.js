import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Button, StyleSheet } from 'react-native';

export const MyListingsScreen = ({ navigation }) => {
  const [myListings, setMyListings] = useState([]);

  useEffect(() => {
    // Fetch user's listings from API or local storage
    const fetchListings = async () => {
      // Replace with actual data fetching logic
      const listings = [
        { id: '1', title: 'Item 1', price: '10' },
        { id: '2', title: 'Item 2', price: '15' },
      ];
      setMyListings(listings);
    };

    fetchListings();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemPrice}>${item.price}/day</Text>
      <Button
        title="View Details"
        onPress={() => navigation.navigate('ItemDetails', { item })}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={myListings}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Button
        title="List New Item"
        onPress={() => navigation.navigate('ListItem')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
});
