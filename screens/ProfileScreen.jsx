import {useNavigation} from '@react-navigation/native';
import React, {useState, useCallback} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, StatusBar, Image, Animated, Platform} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {selectCurrentUser, getUserInfo} from '../store/authSlice';
import {useTheme} from '../src/theme/ThemeProvider';
import ProfileCard from '../src/components/ProfileCard';
import RecentItems from '../src/components/RecentItems';
import {ProfileSection} from '../src/components/profle/ProfileSection';
import CustomText from '../src/components/common/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = () => {
  const [loading, setLoading] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
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

  // Calculate header opacity for a fade effect when scrolling
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    { useNativeDriver: false }
  );

  const navigateToPersonalInfo = () => {
    navigation.navigate('PersonalInfoScreen');
  };

  const renderProfile = () => {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
              progressBackgroundColor={theme.colors.surface}
            />
          }>
          
          {/* Enhanced Profile Card Section */}
          <View style={[styles.profileCardWrapper, {backgroundColor: theme.colors.surface}]}>
            <ProfileCard
              user={user}
              theme={theme}
              navigation={navigation}
              fetchUser={fetchUser}
            />
          </View>

          {/* Action Sections */}
          <View style={[styles.actionSectionTitle, {marginTop: 20}]}>
            <Icon name="gear" size={20} color={theme.colors.primary} />
            <CustomText variant="h4" bold={600} style={{color: theme.colors.text.primary}}>
              Manage Your Items
            </CustomText>
          </View>

          <View style={styles.sectionsContainer}>
            <ProfileSection
              title="My Items"
              icon="list"
              onPress={() => navigation.navigate('MyListings')}
              theme={theme}
            />
            <ProfileSection
              title="My Favourites"
              icon="heart"
              onPress={() => navigation.navigate('FavouritesScreen', {goBack: true})}
              theme={theme}
            />
          </View>

          {/* Floating Add Button */}
          <TouchableOpacity
            style={[
              styles.addItemButton, 
              {backgroundColor: theme.colors.primary}
            ]}
            onPress={() => navigation.navigate('NewItemScreen')}>
            <Icon name="plus" size={20} color="#FFFFFF" />
            <CustomText variant="h4" bold={600} style={{color: "#FFFFFF"}}>
              Add New Item
            </CustomText>
          </TouchableOpacity>

          {/* Recent Items Sections */}
          <View style={styles.recentSectionsContainer}>
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
          </View>
        </ScrollView>
      </View>
    );
  };

  return user ? renderProfile() : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    borderBottomWidth: 0.5,
    paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  profileCardWrapper: {
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  actionSectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 8,
  },
  sectionsContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  addItemButton: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8
  },
  recentSectionsContainer: {
    paddingHorizontal: 16,
  },
});

export default ProfileScreen;
