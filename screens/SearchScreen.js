import React, {useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../src/theme/ThemeProvider';
import {useNavigation} from '@react-navigation/native';
import {itemApi} from '../src/apis/item';
import CustomText from '../src/components/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation();

  const handleSearch = async text => {
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

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.itemCard,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.text.secondary,
        },
      ]}
      onPress={() => navigation.navigate('ItemDetails', {item})}>
      <CustomText
        style={[styles.itemTitle, {color: theme.colors.text.primary}]}>
        {item.title}
      </CustomText>
      <CustomText
        style={[styles.itemPrice, {color: theme.colors.text.secondary}]}>
        ${item.price}/day
      </CustomText>
    </TouchableOpacity>
  );

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-left" size={18} color={theme.colors.text.secondary} />
        </TouchableOpacity>
        <TextInput
          placeholder="Search for items..."
          placeholderTextColor={theme.colors.text.secondary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {loading && (
        <CustomText
          style={[styles.statusText, {color: theme.colors.text.secondary}]}>
          Searching...
        </CustomText>
      )}

      {!loading && results.length === 0 && searchQuery.length >= 2 && (
        <CustomText
          style={[styles.statusText, {color: theme.colors.text.secondary}]}>
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
    padding: 10,
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
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 14,
    margin: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    gap: 10,
  },
});

export default SearchScreen;
