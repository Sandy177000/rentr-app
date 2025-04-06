import {useNavigation} from '@react-navigation/native';
import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {selectCurrentUser, getUserInfo} from '../store/authSlice';
import {useTheme} from '../src/theme/ThemeProvider';
import ProfileCard from '../src/components/ProfileCard';
import RecentItems from '../src/components/RecentItems';
import {ProfileSection} from '../src/components/profle/ProfileSection';

const ProfileScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const fetchUser = async () => {
    const userData = await dispatch(getUserInfo()).unwrap();
    return userData;
  };

  const onRefresh = useCallback(() => {
    setLoading(true);
    fetchUser();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const renderProfile = () => {
    return (
      <ScrollView
        style={[styles.container, {backgroundColor: theme.colors.background}]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
              refreshing={loading}
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
        <View
          style={[
            styles.sectionsContainer,
            {backgroundColor: theme.colors.background},
          ]}>
          <ProfileSection
            title="My Listed Items"
            icon="list"
            onPress={() => navigation.navigate('MyListings')}
            theme={theme}
          />
          <ProfileSection
            title="Items Rented by Me"
            icon="shopping-cart"
            onPress={() => navigation.navigate('MyRentals')}
            theme={theme}
          />
          <RecentItems
            theme={theme}
            type="listings"
            title="Recently Listed Items"
            limit={5}
          />
          <RecentItems
            theme={theme}
            type="rentals"
            title="Recently Rented Items"
            limit={5}
          />
        </View>
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
});

export default ProfileScreen;
