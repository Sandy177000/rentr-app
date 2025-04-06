import React from 'react';
import {useWindowDimensions, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {selectCurrentUser} from '../../store/authSlice';
import {avatar} from '../constants';
import {TabView, SceneMap} from 'react-native-tab-view';
import {View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PanGestureHandler} from 'react-native-gesture-handler';
import HomeScreen from '../../screens/HomeScreen';
import FavouritesScreen from '../../screens/FavouritesScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import ChatScreen from '../../screens/ChatScreen';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StyleSheet} from 'react-native';
import {useState} from 'react';
import { useTheme } from '../theme/ThemeProvider';

const MainTabs = () => {

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const theme = useTheme();
  const user = useSelector(selectCurrentUser);

  const routes = [
    {key: 'home', title: 'Home', icon: 'home'},
    {key: 'favorites', title: 'Favorites', icon: 'heart'},
    {key: 'chat', title: 'Chat', icon: 'comment'},
    {
      key: 'profile',
      title: 'Profile',
      icon: user?.profileImage || avatar,
      type: 'image',
    },
  ];

  const renderScene = SceneMap({
    home: HomeScreen,
    favorites: FavouritesScreen,
    profile: ProfileScreen,
    chat: ChatScreen,
  });

  const handleSwipe = direction => {
    if (direction === 'left' && index < routes.length - 1) {
      setIndex(index + 1);
    } else if (direction === 'right' && index > 0) {
      setIndex(index - 1);
    }
  };

  // Custom tab bar implementation
  const renderTabBar = () => (
    <View style={styles.tabBarContainer}>
      <GestureHandlerRootView>
        <PanGestureHandler
          onGestureEvent={({nativeEvent}) => {
            if (nativeEvent.translationX > 50) {
              handleSwipe('right');
            } else if (nativeEvent.translationX < -50) {
              handleSwipe('left');
            }
          }}>
          <View collapsable={false}>
            <View style={[
              styles.tabBar,
              { backgroundColor: theme.colors.primary }
            ]}>
              {routes.map((route, i) => {
                const isActive = index === i;
                return (
                  <TouchableOpacity
                    key={route.key}
                    style={styles.tabItem}
                    onPress={() => setIndex(i)}
                    activeOpacity={0.9}
                  >
                    {route.type === 'image' ? (
                      <Image
                        source={{uri: route.icon}}
                        style={{width: 25, height: 25, borderRadius: 100}}
                      />
                    ) : (
                      <Icon
                        name={route.icon}
                        color={isActive ? 'white' : 'rgba(255, 255, 255, 0.6)'}
                        size={20}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </PanGestureHandler>
      </GestureHandlerRootView>
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
    borderRadius: 300,
    width: '80%',
    alignSelf: 'center',
    height: 50,
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
