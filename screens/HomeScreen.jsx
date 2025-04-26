// screens/HomeScreen.js
import React, {useState, useEffect} from 'react';
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
import {categories} from '../src/constants';
import ScreenHeader from '../src/components/ScreenHeader';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigation = useNavigation();
  const items = useSelector(selectItems);
  const [refreshing, setRefreshing] = useState(false);

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
  }, [dispatch]);

  const handleNavigation = (navigateTo, data) =>{
    navigation.navigate(navigateTo, data);
  };

  const renderCategory = ({item}) => (
    <TouchableOpacity
      style={[styles.categoryItem, {backgroundColor: theme.colors.surface}]}
      onPress={() => handleNavigation('CategoryItems', {category: item.name})}>
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
    try {
      setRefreshing(true);
      await dispatch(getItems()).unwrap();
      console.log('items fetch');
    } catch (error) {
      console.log('error', error);
    } finally {
      setRefreshing(false);
    }
  };

  

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScreenHeader goBack={false}>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 10,
            flex: 1,
          }}>
            <TouchableOpacity
              onPress={() => handleNavigation('Search')}
              style={[styles.searchPlaceholder,{ backgroundColor: theme.colors.surface}]}>
              <Icon
                name="search"
                size={20}
                color={theme.colors.text.secondary}
              />
              <CustomText
                variant="h4"
                style={{color: theme.colors.text.secondary}}>
                Search for items...
              </CustomText>
            </TouchableOpacity>
          <TouchableOpacity
            onPress={()=> handleNavigation('FavouritesScreen')}
            style={{
              padding: 15,
              backgroundColor: theme.colors.surface,
              borderRadius: 100,
            }}>
            <Icon name="heart-o" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>handleNavigation('ChatScreen')}
            style={{
              padding: 15,
              backgroundColor: theme.colors.surface,
              borderRadius: 100,
            }}>
            <Icon name="comment-o" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </ScreenHeader>
        <Section data={categories} renderItem={renderCategory} />

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
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }>
            {
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
            }
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
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 30,
    gap: 10,
  },
  searchContainer: {
    padding: 15,
    // flexGrow: 1,
    flexDirection: 'row',
    borderRadius: 30,
    flex: 1,
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
