import React from 'react';
import {useWindowDimensions, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {selectCurrentUser} from '../../store/authSlice';
import {avatar} from '../constants';
import {TabView, SceneMap} from 'react-native-tab-view';
import {View} from 'react-native';
import HomeScreen from '../../screens/HomeScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StyleSheet} from 'react-native';
import {useState} from 'react';
import {useTheme} from '../theme/ThemeProvider';
import { MyListingsScreen } from '../../screens/MyListingsScreen';
import MyRentalsScreen from '../../screens/MyRentalsScreen';
import NewItemScreen from '../../screens/NewItemScreen';

const MainTabs = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const theme = useTheme();
  const user = useSelector(selectCurrentUser);

  const routes = [
    {key: 'home', title: 'Home', icon: 'home'},
    {key: 'myOrders', title: 'myOrders', icon: 'shopping-cart'},
    {key: 'newItem', title: 'newItem', icon: 'plus'},
    {
      key: 'profile',
      title: 'Profile',
      icon: user?.profileImage || avatar,
      type: 'image',
    },
  ];

  const renderScene = SceneMap({
    home: HomeScreen,
    myOrders: MyRentalsScreen,
    profile: ProfileScreen,
    newItem: NewItemScreen,
  });


  // Custom tab bar implementation
  const renderTabBar = () => (
    <View style={styles.tabBarContainer}>
      <View collapsable={false}>
        <View style={[styles.tabBar, {backgroundColor: theme.colors.primary}]}>
          {routes.map((route, i) => {
            const isActive = index === i;
            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tabItem}
                onPress={() => setIndex(i)}
                activeOpacity={0.9}>
                <View
                  style={{
                    backgroundColor: isActive ? 'white' : theme.colors.primary,
                    width: 35,
                    height: 35,
                    borderRadius: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {route.type === 'image' ? (
                    <Image
                      source={{uri: route.icon}}
                      style={{width: 26, height: 26, borderRadius: 100}}
                    />
                  ) : (
                    <Icon
                      name={route.icon}
                      color={isActive ? theme.colors.primary : 'white'}
                      size={20}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={renderTabBar}
      swipeEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderRadius: 90,
    width: '70%',
    alignSelf: 'center',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});
export default MainTabs;
