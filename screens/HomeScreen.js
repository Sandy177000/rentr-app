// screens/HomeScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useTheme} from '../src/theme/ThemeProvider';
import {itemApi} from '../src/apis/item';
import {useNavigation} from '@react-navigation/native';
import {RefreshControl} from 'react-native';
import CustomText from '../src/components/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeSection from '../src/components/HomeSection';
import ListItem from '../src/components/ListItem';
import {BottomGradient} from '../src/components/BottomGradient';

export const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([]);

  const categories = [
    {id: '1', name: 'Electronics', icon: 'laptop'},
    {id: '6', name: 'Books', icon: 'book'},
    {id: '4', name: 'Sports', icon: 'futbol-o'},
    {id: '5', name: 'Vehicles', icon: 'car'},
  ];

  const fetchItems = async () => {
    const itemsData = await itemApi.getItems();
    if (itemsData.length == 0) {
      Alert.alert('Items data', JSON.stringify(itemsData));
    }
    setItems(itemsData);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const renderCategory = ({item}) => (
    <TouchableOpacity
      style={[styles.categoryItem, {backgroundColor: theme.colors.surface}]}
      onPress={() =>
        navigation.navigate('CategoryItems', {category: item.name})
      }>
      <Icon name={item.icon} size={24} color={theme.colors.primary} />
      <CustomText variant="h4" style={[{color: theme.colors.text.primary}]}>
        {item.name}
      </CustomText>
    </TouchableOpacity>
  );

  const renderRecommendation = ({item, index}) => (
    <ListItem item={item} index={index} theme={theme} navigation={navigation} />
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  return (
    <>
      <View
        style={[styles.container, {backgroundColor: theme.colors.surface}]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Search')}
          style={[
            styles.searchContainer,
            {backgroundColor: theme.colors.background},
          ]}>
          <Icon name="search" size={20} color={theme.colors.text.secondary} />
          <CustomText
            style={[
              styles.searchPlaceholder,
              {color: theme.colors.text.secondary},
            ]}>
            Search for items...
          </CustomText>
        </TouchableOpacity>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }>
          <HomeSection
            title="Categories"
            data={categories}
            renderItem={renderCategory}
          />
          <HomeSection
            title="Latest Deals"
            data={items}
            renderItem={renderRecommendation}
          />
          <HomeSection
            title="Books"
            data={items.filter(item => item.category === 'Books')}
            renderItem={renderRecommendation}
          />
          <HomeSection
            title="Electronics"
            data={items.filter(item => item.category === 'Electronics')}
            renderItem={renderRecommendation}
          />
        </ScrollView>
      </View>
      <BottomGradient theme={theme} zIndex={1} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
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
    margin: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    gap: 10,
    zIndex: 2,
  },
  categoryItem: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: 120,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  recommendationList: {
    padding: 4,
    marginBottom: 16,
  },
});
