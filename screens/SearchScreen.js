import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../src/theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { itemApi } from '../src/apis/item';
import CustomText from '../src/components/CustomText';
const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation();

  const handleSearch = async (text) => {
    setSearchQuery(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const searchResults = await itemApi.searchItems(text);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.itemCard, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.text.secondary 
      }]}
      onPress={() => navigation.navigate('ItemDetails', { item })}
    >
      <CustomText style={[styles.itemTitle, { color: theme.colors.text.primary }]}>{item.title}</CustomText>
      <CustomText style={[styles.itemPrice, { color: theme.colors.text.secondary }]}>${item.price}/day</CustomText>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        style={[styles.searchInput, {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.primary,
          borderColor: theme.colors.text.secondary
        }]}
        placeholder="Search for items..."
        placeholderTextColor={theme.colors.text.secondary}
        value={searchQuery}
        onChangeText={handleSearch}
      />
      
      {loading && (
        <CustomText style={[styles.statusText, { color: theme.colors.text.secondary }]}>
          Searching...
        </CustomText>
      )}
      
      {!loading && results.length === 0 && searchQuery.length >= 2 && (
        <CustomText style={[styles.statusText, { color: theme.colors.text.secondary }]}>
          No items found
        </CustomText>
      )}

      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.resultsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  resultsList: {
    flex: 1,
  },
  itemCard: {
    padding: 15,
    borderBottomWidth: 1,
    marginBottom: 8,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
  },
  statusText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  }
});

export default SearchScreen;