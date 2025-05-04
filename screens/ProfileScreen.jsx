import {useNavigation} from '@react-navigation/native';
import React, {useState, useCallback} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
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
  const fetchUser = useCallback(async () => {
    const userData = await dispatch(getUserInfo()).unwrap();
    return userData;
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    setLoading(true);
    fetchUser();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [fetchUser]);

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
        <View style={[styles.sectionsContainer]}>
          <ProfileSection
            title="My Listed Items"
            icon="list"
            onPress={() => navigation.navigate('MyListings')}
            theme={theme}
          />
        </View>
        <RecentItems
          loading={loading}
          theme={theme}
          type="listings"
          title="Recently Listed Items"
          limit={5}
        />
        <RecentItems
          loading={loading}
          theme={theme}
          type="rentals"
          title="Recently Rented Items"
          limit={5}
        />
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
    flexWrap: 'wrap',
    marginTop: 20,
    paddingHorizontal: 15,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
});

export default ProfileScreen;
