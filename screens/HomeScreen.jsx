// screens/HomeScreen.js
import React, {useState, useEffect, useCallback} from 'react';
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

const HomeScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigation = useNavigation();
  const items = useSelector(selectItems);
  const [refreshing, setRefreshing] = useState(false);
  const categories = [
    {id: '1', name: 'Electronics', icon: 'laptop'},
    {id: '6', name: 'Books', icon: 'book'},
    {id: '4', name: 'Sports', icon: 'futbol-o'},
    {id: '5', name: 'Vehicles', icon: 'car'},
  ];


  useEffect(() => {
    const fetchItems = async () => {
      try {
        setRefreshing(true);
        await dispatch(getItems()).unwrap();
      } catch (error) {
        console.log('error', error);
      } finally {
        setRefreshing(false);
      }
    };
    fetchItems();
    console.log('items fetch');
  }, []);

  const renderCategory = ({item}) => (
    <TouchableOpacity
      style={[styles.categoryItem, {backgroundColor: theme.colors.surface}]}
      onPress={() =>
        navigation.navigate('CategoryItems', {category: item.name})
      }>
      <Icon name={item.icon} size={20} color={theme.colors.primary} />
      <CustomText variant="h4" style={[{color: theme.colors.text.primary}]}>
        {item.name}
      </CustomText>
    </TouchableOpacity>
  );

  const renderRecommendation = ({item, index}) => (
    <View style={{padding: 3}}>
      <ListItem
        item={item}
        index={index}
        theme={theme}
        navigation={navigation}
        showFavorite={true}
      />
    </View>
  );

  const handleRefresh = async () => {
    const fetchItems = async () => {
      try {
        setRefreshing(true);
        await dispatch(getItems()).unwrap();
      } catch (error) {
        console.log('error', error);
      } finally {
        setRefreshing(false);
      }
    };
    fetchItems();
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View
        style={{
          flexDirection: 'column',
          backgroundColor: theme.colors.background,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}>
        <View
          style={[
            styles.searchContainer,
            {backgroundColor: theme.colors.surface},
          ]}>
          <CustomButton
            onPress={() => navigation.navigate('Search')}
            style={[styles.searchPlaceholder]}>
            <Icon name="search" size={20} color={theme.colors.text.secondary} />
            <CustomText
              variant="h4"
              style={{color: theme.colors.text.secondary}}>
              Search for items...
            </CustomText>
          </CustomButton>
        </View>

        <Section data={categories} renderItem={renderCategory} />
      </View>

      {items && (
        <View
          style={{
            flex: 1,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            overflow: 'hidden',
            backgroundColor: theme.colors.background,
            marginBottom: 100,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }>
          {(
            <>
              <Section
                title="Latest Deals"
                data={items}
                renderItem={renderRecommendation}
              />
              <Section
                title="Goods near you"
                data={items.filter(item => item.category === 'Books')}
                renderItem={renderRecommendation}
              />
              <Section
                title="Recommended Electronics"
                data={items.filter(item => item.category === 'Electronics')}
                renderItem={renderRecommendation}
              />
            </>
          )}
        </ScrollView>
        </View>
      )}
      {!items && <Footer />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
  },
  searchPlaceholder: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchContainer: {
    padding: 15,
    flexDirection: 'row',
    borderRadius: 30,
    margin: 10,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    minWidth: 120,
    gap: 8,
    borderRadius: 30,
  },
});

export default HomeScreen;
