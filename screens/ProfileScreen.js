import {useNavigation} from '@react-navigation/native';
import React, {useState, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import {useSelector, useDispatch} from 'react-redux';
import {selectCurrentUser, logout, updateUser} from '../store/authSlice';
import {useTheme} from '../src/theme/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userApi} from '../src/apis/user';
import ProfileCard from '../src/components/ProfileCard';
import CustomText from '../src/components/CustomText';
import RecentItems from '../src/components/RecentItems';

const ProfileScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const fetchUser = async () => {
    const userData = await userApi.getUserInfo();
    dispatch(updateUser(userData));
    return userData;
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // fetch user info from backend on refre
    fetchUser();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);



  const recentRentals = [
    {id: 1, title: 'Surfboard', price: '$30/day'},
    {id: 2, title: 'DJ Equipment', price: '$45/day'},
    {id: 3, title: 'Drone', price: '$35/day'},
  ];

  const ItemCard = ({title, price}) => (
    <View style={[styles.itemCard, {backgroundColor: theme.colors.background}]}>
      <View
        style={[
          styles.itemImagePlaceholder,
          {backgroundColor: theme.colors.surface},
        ]}
      />
      <CustomText style={[styles.itemTitle, {color: theme.colors.text.primary}]}>
        {title}
      </CustomText>
      <CustomText style={[styles.itemPrice, {color: theme.colors.text.secondary}]}>
        {price}
      </CustomText>
    </View>
  );

  const ProfileSection = ({title, icon, onPress}) => (
    <TouchableOpacity
      style={[
        styles.sectionContainer,
        {backgroundColor: theme.colors.background},
      ]}
      onPress={onPress}>
      <View style={styles.sectionContent}>
        <Icons name={icon} size={24} color={theme.colors.text.primary} />
        <CustomText style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
          {title}
        </CustomText>
      </View>
      <Icons
        name="chevron-right"
        size={14}
        color={theme.colors.text.secondary}
      />
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      dispatch(logout());
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const renderProfile = () => {
    return (
      <ScrollView
        style={[styles.container, {backgroundColor: theme.colors.surface}]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.text.primary}
            colors={[theme.colors.text.primary]}
            progressBackgroundColor={theme.colors.background}
          />
        }>
        <ProfileCard
          user={user}
          theme={theme}
          navigation={navigation}
          fetchUser={fetchUser}
        />
        <View style={styles.sectionsContainer}>
          <ProfileSection
            title="My Listed Items"
            icon="list"
            onPress={() => navigation.navigate('MyListings')}
          />
          <ProfileSection
            title="Items Rented by Me"
            icon="shopping-cart"
            onPress={() => navigation.navigate('MyRentals')}
          />
          <RecentItems theme={theme} type="listings" title="Recently Listed Items" limit={5}/>
          <RecentItems theme={theme} type="rentals" title="Recently Rented Items" limit={5}/>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, {backgroundColor: theme.colors.primary}]}
          onPress={handleLogout}>
          <CustomText style={styles.logoutText}>Logout</CustomText>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return user && renderProfile();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionsContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  logoutButton: {
    marginTop: 30,
    marginBottom: 150,
    marginHorizontal: 15,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  recentSection: {
    marginTop: 20,
  },
  recentTitle: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginLeft: 5,
  },
  recentItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
  },
  itemCard: {
    width: 120,
    marginRight: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImagePlaceholder: {
    width: '100%',
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTitle: {
    fontWeight: '500',
    marginBottom: 4,
  },
  itemPrice: {
    color: '#666',
  },
});

export default ProfileScreen;
