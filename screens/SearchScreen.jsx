import React, {useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../src/theme/ThemeProvider';
import {useNavigation} from '@react-navigation/native';
import {itemApi} from '../src/services/api/index';
import CustomText from '../src/components/common/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import ListItem from '../src/components/ListItem';
import { TextInput } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/authSlice';


const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectCurrentUser)
  const theme = useTheme();
  const navigation = useNavigation();

  const debouncedSearch = (query) => {
    setSearchQuery(query);
    setTimeout(() => {
      handleSearch(query);
    }, 500);
  };

  const handleSearch = async (query) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const searchResults = await itemApi.searchItems(query);
      const searchItems = searchResults.filter((item)=>item.ownerId!==user.id)
      setResults(searchItems);
    } catch (error) {
      console.error('Search error:', JSON.stringify(error));
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
      <ListItem item={item} theme={theme} navigation={navigation} horizontal={true} showFavorite={true} />
    </TouchableOpacity>
  );

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="angle-left" size={25} color={theme.colors.text.secondary} />
        </TouchableOpacity>
        <TextInput
          placeholder="Search for items..."
          placeholderTextColor={theme.colors.text.secondary}
          value={searchQuery}
          style={{color: theme.colors.text.primary,  width: '100%'}}
          onChangeText={debouncedSearch}
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

      <View style={styles.searchResultsContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={results}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.resultsList}
        />
      </View>
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
    marginBottom: 8,
    borderRadius: 25,
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
    borderRadius: 30,
    margin: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    height: 50,
    alignItems: 'center',
    gap: 15,
  },
  backButton: {
    marginLeft: 25,
  },
  searchResultsContainer: {
    flex: 1,
    padding: 10,
  },
});

export default SearchScreen;
