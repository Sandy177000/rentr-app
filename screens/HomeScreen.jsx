// screens/HomeScreen.js
import React, {useState, useLayoutEffect} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useTheme} from '../src/theme/ThemeProvider';
import {useNavigation} from '@react-navigation/native';
import {RefreshControl} from 'react-native';
import CustomText from '../src/components/common/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import {HorizontalListSection as Section} from '../src/components/common/horizontal.list.section/HorizontalListSection';
import ListItem from '../src/components/ListItem';
import {useDispatch, useSelector} from 'react-redux';
import Footer from '../src/components/Footer';
import {getItems, selectItems} from '../store/itemsSlice';
import CustomButton from '../src/components/common/CustomButton';
import globalStyles from '../src/theme/global.styles';
import { HorizontalListSectionShimmer } from '../src/components/common/horizontal.list.section/HorizontalListSectionShimmer';
export const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const items = useSelector(selectItems);

  const categories = [
    {id: '1', name: 'Electronics', icon: 'laptop'},
    {id: '6', name: 'Books', icon: 'book'},
    {id: '4', name: 'Sports', icon: 'futbol-o'},
    {id: '5', name: 'Vehicles', icon: 'car'},
  ];

  const fetchItems = async () => {
    try {
      setLoading(true);
      await dispatch(getItems()).unwrap();
      setLoading(false);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
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
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.searchContainer, {backgroundColor: theme.colors.surface}]}>
        <CustomButton
          onPress={() => navigation.navigate('Search')}
          style={[styles.searchPlaceholder]}>
          <Icon name="search" size={20} color={theme.colors.text.secondary} />
          <CustomText variant="h4" style={{color: theme.colors.text.secondary}}>
            Search for items...
          </CustomText>
        </CustomButton>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <Section
          title="Categories"
          data={categories}
          renderItem={renderCategory}
        />
        <Section
          title="Latest Deals"
          data={items}
          renderItem={renderRecommendation}
        />
        <Section
          title="Books"
          data={items.filter(item => item.category === 'Books')}
          renderItem={renderRecommendation}
        />
        <Section
          title="Electronics"
          data={items.filter(item => item.category === 'Electronics')}
          renderItem={renderRecommendation}
        />
        {/* {loading && <HorizontalListSectionShimmer />} */}
        <Footer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchPlaceholder: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...globalStyles.borderRadius,
  },
  searchContainer: {
    margin: 10,
    padding: 10,
    flexDirection: 'row',
    ...globalStyles.borderRadius,
    ...globalStyles.shadow,
  },
  categoryItem: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: 120,
    gap: 8,
    ...globalStyles.shadow,
  },
});
