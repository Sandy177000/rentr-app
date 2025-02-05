// screens/HomeScreen.js
import React, {useState, useEffect} from 'react';
import {View, FlatList, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useTheme} from '../src/theme/ThemeProvider';
import {itemApi} from '../src/apis/item';
import {useNavigation} from '@react-navigation/native';
import {RefreshControl} from 'react-native';
import CustomText from '../src/components/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import Divider from '../src/components/Divider';

export const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([]);

  // Add dummy categories data
  const categories = [
    { id: '1', name: 'Electronics', icon: 'laptop' },
    { id: '2', name: 'Fashion', icon: 'shopping-bag' },
    { id: '3', name: 'Home & Garden', icon: 'home' },
    { id: '4', name: 'Sports', icon: 'futbol-o' },
    { id: '5', name: 'Vehicles', icon: 'car' },
  ];

  const fetchItems = async () => {
    const items = await itemApi.getItems();
    setItems(items);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('CategoryItems', { category: item.name })}
    >
      <Icon name={item.icon} size={24} color={theme.colors.text.primary} />
      <CustomText style={[styles.categoryText, { color: theme.colors.text.primary }]}>
        {item.name}
      </CustomText>
    </TouchableOpacity>
  );

  const renderRecommendation = ({ item }) => (
    <TouchableOpacity
      style={[styles.recommendationItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('ItemDetails', { item })}
    >
      <CustomText style={[styles.itemTitle, { color: theme.colors.text.primary }]}>
        {item.name}
      </CustomText>
      <CustomText style={[styles.itemPrice, { color: theme.colors.text.secondary }]}>
        ${item.price}/day
      </CustomText>
    </TouchableOpacity>
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  const renderItem = ({item}) => (
    <CustomText>{item.name}</CustomText>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        {/* Search Bar */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Search')}
          style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}
        >
          <Icon name="search" size={20} color={theme.colors.text.secondary} />
          <CustomText style={[styles.searchPlaceholder, { color: theme.colors.text.secondary }]}>
            Search for items...
          </CustomText>
        </TouchableOpacity>

        {/* Categories Section */}
        <CustomText style={{ color: theme.colors.text.primary }} variant="h3">
          Categories
        </CustomText>
        <Divider />
        <FlatList
          horizontal
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />

        {/* Recommendations Section */}
        <CustomText style={{ color: theme.colors.text.primary }} variant="h3">
          Latest Deals
        </CustomText>
        < Divider />
        <FlatList
          horizontal
          data={items}
          renderItem={renderRecommendation}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recommendationList}
        />

        {/* Existing Items List */}
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <CustomText>No items found : (</CustomText>
          </View>
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
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
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 14,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    gap: 10,
  },
  categoryItem: {
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    width: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 16,
    marginHorizontal: 4,
  },
  recommendationItem: {
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 160,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  categoryList: {
    padding: 4,
    marginBottom: 8,
  },
  recommendationList: {
    padding: 4,
    marginBottom: 16,
  },
});
