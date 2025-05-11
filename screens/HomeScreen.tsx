// screens/HomeScreen.tsx
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import {useTheme} from '../src/theme/ThemeProvider';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import CustomText from '../src/components/common/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import {HorizontalListSection as Section} from '../src/components/common/horizontal.list.section/HorizontalListSection';
import ListItem from '../src/components/ListItem';
import {useDispatch, useSelector} from 'react-redux';
import Footer from '../src/components/Footer';
import {
  getItems,
  getNearbyItems,
  selectItems,
  selectNearByItems,
  selectNearByRadius,
} from '../store/itemsSlice';
import {categories} from '../src/constants';
import ScreenHeader from '../src/components/ScreenHeader';
import {TItem} from '../src/components/types';
import Chip from '../src/components/Chip';
import Geolocation from '@react-native-community/geolocation';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {selectCurrentUser} from '../store/authSlice';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const items = useSelector(selectItems);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const nearByItems = useSelector(selectNearByItems);
  const nearByRadius = useSelector(selectNearByRadius);
  const currentUser = useSelector(selectCurrentUser);

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
  }, [dispatch]);

  const handleNavigation = useCallback(
    (navigateTo: string | undefined, data: any | null) => {
      if (navigateTo) {
        navigation.navigate(navigateTo, data);
      }
    },
    [navigation],
  );

  const renderCategory = useCallback(
    ({item}: {item: any}) => (
      <TouchableOpacity
        style={[
          styles.categoryCard,
          {backgroundColor: theme.colors.surface},
        ]}
        onPress={() =>
          handleNavigation('CategoryItems', {category: item.name})
        }>
        <View
          style={[
            styles.categoryIconContainer,
            {backgroundColor: theme.colors.primary + '20'},
          ]}>
          <Icon name={getCategoryIcon(item.name)} size={20} color={theme.colors.primary} />
        </View>
        <CustomText
          style={[styles.categoryText, {color: theme.colors.text.primary}]}>
          {item.name}
        </CustomText>
      </TouchableOpacity>
    ),
    [theme, handleNavigation],
  );

  const renderRecommendation = useCallback(
    ({item}: {item: TItem}) => (
      <View style={styles.itemContainer}>
        <ListItem
          item={item}
          theme={theme}
          navigation={navigation}
          showFavorite={true}
        />
      </View>
    ),
    [theme, navigation],
  );

  const getUserLocation = async () => {
    try {
      Geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
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
      await dispatch(
        getNearbyItems({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          radius: nearByRadius,
        }),
      ).unwrap();
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await dispatch(getItems()).unwrap();
      getNearby();
    } catch (error) {
      console.log('error', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getNearby();
  }, [userLocation, nearByRadius]);

  // Get appropriate icons for categories
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: {[key: string]: string} = {
      Electronics: 'laptop',
      Books: 'book',
      Clothing: 'shopping-bag',
      Furniture: 'bed',
      Tools: 'wrench',
      Sports: 'futbol-o',
      Toys: 'gamepad',
      Vehicles: 'car',
      // Add more mappings as needed
    };
    return iconMap[categoryName] || 'tag';
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Header */}
      <View 
        style={[
          styles.header, 
          {
            backgroundColor: theme.colors.background,
            elevation: 5,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0,
          }
        ]}>
        <View style={styles.headerTop}>
          <View style={styles.welcomeContainer}>
            <CustomText 
              variant="h4" 
              style={[styles.welcomeText, {color: theme.colors.text.secondary}]}>
              Hello, {currentUser?.firstName || 'there'}! 👋
            </CustomText>
            <CustomText 
              variant="h3" 
              bold={700} 
              style={{color: theme.colors.text.primary}}>
              Find your perfect rental
            </CustomText>
          </View>
          
        </View>

        <TouchableOpacity
          onPress={() => handleNavigation('Search', null)}
          style={[
            styles.searchBar,
            {backgroundColor: theme.colors.surface},
          ]}>
          <Icon
            name="search"
            size={18}
            color={theme.colors.text.secondary}
          />
          <CustomText
            style={{color: theme.colors.text.secondary, marginLeft: 10}}>
            Search for items...
          </CustomText>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.surface}
          />
        }
        contentContainerStyle={styles.scrollContent}>
        
        {/* Categories Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="cubes" size={18} color={theme.colors.primary} />
            <CustomText variant="h3" bold={700} style={{color: theme.colors.text.primary}}>
              Categories
            </CustomText>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}>
            {categories.map((item, index) => (
              <React.Fragment key={`category-${index}`}>
                {renderCategory({item})}
              </React.Fragment>
            ))}
          </ScrollView>
        </View>

        {/* Latest Deals Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="tags" size={18} color={theme.colors.primary} />
            <CustomText variant="h3" bold={700} style={{color: theme.colors.text.primary}}>
              Latest Deals
            </CustomText>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{borderRadius: 20}}
            contentContainerStyle={styles.itemsContainerCompact}>
            {items.map((item, index) => (
              <React.Fragment key={`latest-${index}`}>
                {renderRecommendation({item})}
              </React.Fragment>
            ))}
          </ScrollView>
        </View>

        {/* Nearby Items Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="map-marker" size={18} color={theme.colors.primary} />
            <CustomText variant="h3" bold={700} style={{color: theme.colors.text.primary}}>
              Goods Near You
            </CustomText>
          </View>
          
          {nearByItems.length > 0 ? (
            <ScrollView
              horizontal
              style={{borderRadius: 20}}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.itemsContainerCompact}>
              {nearByItems.map((item, index) => (
                <React.Fragment key={`nearby-${index}`}>
                  {renderRecommendation({item})}
                </React.Fragment>
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.emptyNearbyContainer, {backgroundColor: theme.colors.surface}]}>
              <Icon name="map-marker" size={36} color={theme.colors.text.secondary} />
              <CustomText style={{color: theme.colors.text.secondary, textAlign: 'center', marginTop: 10}}>
                No items found nearby.{'\n'}Try increasing your search radius in settings.
              </CustomText>
            </View>
          )}
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    marginBottom: 4,
  },
  favoriteButton: {
    width: 35,
    height: 35, 
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionContainer: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  categoriesContainer: {
    paddingRight: 16,
    gap: 12,
  },
  categoryCard: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    minWidth: 80,
    maxWidth: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  itemsContainerCompact: {
    paddingRight: 6,
    gap: 6,
  },
  itemContainer: {
    width: 190,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  emptyNearbyContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});

export default HomeScreen;
