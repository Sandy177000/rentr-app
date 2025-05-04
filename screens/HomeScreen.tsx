// screens/HomeScreen.js
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useTheme} from '../src/theme/ThemeProvider';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RefreshControl} from 'react-native';
import CustomText from '../src/components/common/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import {HorizontalListSection as Section} from '../src/components/common/horizontal.list.section/HorizontalListSection';
import ListItem from '../src/components/ListItem';
import {useDispatch, useSelector} from 'react-redux';
import Footer from '../src/components/Footer';
import {getItems, getNearbyItems, selectItems, selectNearByItems} from '../store/itemsSlice';
import {categories} from '../src/constants';
import ScreenHeader from '../src/components/ScreenHeader';
import {TItem} from '../src/components/types';
import Chip from '../src/components/Chip';
import Geolocation from '@react-native-community/geolocation';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
const HomeScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const items = useSelector(selectItems);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const nearByItems = useSelector(selectNearByItems);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setRefreshing(true);
        await dispatch(getItems()).unwrap();
        getUserLocation();
      } catch (error) {
        console.log('error', error);
      } finally {
        setRefreshing(false);
      }
    };
    fetchItems();
    console.log('items fetch');
  }, [dispatch]);

  const handleNavigation = (navigateTo: string | undefined, data: any | null) => {
    if (navigateTo) {
      navigation.navigate(navigateTo, data);
    }
  };

  const renderCategory = ({item}: {item: any}) => (
    <Chip
      item={item}
      navigation={navigation}
      navigationData={{
        navigateTo: 'CategoryItems',
        data: {category: item.name},
      }}
    />
  );

  const renderRecommendation = ({item}: {item: TItem}) => (
    <View style={{padding: 3}}>
      <ListItem
        item={item}
        theme={theme}
        navigation={navigation}
        showFavorite={true}
      />
    </View>
  );

  const getUserLocation = async () => {
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log('position', JSON.stringify(position, null, 2));
      },
      (error) => {
        console.log(error);
        },
      );
    } catch (error) {
      console.log('error', error);
      Toast.show({
        text1: 'Error getting location',
        type: 'error',
      });
    }
  };

  const getNearby = async () => {
    if (userLocation) {
      const items = await dispatch(getNearbyItems({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: 100,
      })).unwrap();
      console.log('items', items);
    }

  };

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

  useEffect(() => {
    getNearby();
  }, [userLocation]);

  return (
    <>
      <View style={[styles.container, {backgroundColor: theme.colors.surface}]}>
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
              onPress={() => handleNavigation('Search', null)}
              style={[
                styles.searchPlaceholder,
                {backgroundColor: theme.colors.background},
              ]}>
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
              onPress={() => handleNavigation('FavouritesScreen', null)}
              style={{
                padding: 15,
                backgroundColor: theme.colors.background,
                borderRadius: 100,
              }}>
              <Icon
                name="heart-o"
                size={20}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNavigation('ChatScreen', null)}
              style={{
                padding: 15,
                backgroundColor: theme.colors.background,
                borderRadius: 100,
              }}>
              <Icon
                name="comment-o"
                size={20}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
        </ScreenHeader>
        <Section data={categories} renderItem={renderCategory} />
        {
          <View
            style={{
              flex: 1,
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              overflow: 'hidden',
              backgroundColor: theme.colors.background,
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
                    title="Goods Near You"
                    data={nearByItems}
                    renderItem={renderRecommendation}
                  />
                  <Section
                    title="Recommended Electronics"
                    data={items.filter(
                      (item: TItem) => item.category === 'Electronics',
                    )}
                    renderItem={renderRecommendation}
                  />
                </>
              }
              {<Footer />}
            </ScrollView>
          </View>
        }
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexDirection: 'row',
    borderRadius: 30,
    flex: 1,
  },
});

export default HomeScreen;
