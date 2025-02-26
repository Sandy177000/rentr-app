// App.js
import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import store from './store/store';
import {ItemDetailsScreen} from './screens/ItemDetailScreen';
import SettingsScreen from './screens/SettingsScreen';
import {HomeScreen} from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import {MyListingsScreen} from './screens/MyListingsScreen';
import {RegisterScreen} from './screens/RegisterScreen';
import MyRentalsScreen from './screens/MyRentalsScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {View} from 'react-native';
import {useTheme} from './src/theme/ThemeProvider';
import {LoginScreen} from './screens/LoginScreen';
import {ThemeProvider} from './src/theme/ThemeProvider';
import ThemeScreen from './screens/ThemeScreen';
import ChatScreen from './screens/ChatScreen';
import SearchScreen from './screens/SearchScreen';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ChatDetails from './screens/ChatDetails';
import CategoryItems from './screens/CategoryItems';
import FavouritesScreen from './screens/FavouritesScreen';
import { Image } from 'react-native';
import { avatar } from './src/constants';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './store/authSlice';
import { CustomImage } from './src/components/common/CustomImage';
import CustomText from './src/components/common/CustomText';
const Stack = createStackNavigator();

const queryClient = new QueryClient();

const MainTabs = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const theme = useTheme();
  const user = useSelector(selectCurrentUser);

  const routes = [
    {key: 'home', title: 'Home', icon: 'home'},
    {key: 'favorites', title: 'Favorites', icon: 'heart'},
    {key: 'chat', title: 'Chat', icon: 'comment'},
    {key: 'profile', title: 'Profile', icon: user?.profileImage || avatar, type: 'image'},
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

  const renderTabBar = props => (
    <View
      style={{
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}>
      <GestureHandlerRootView>
        <PanGestureHandler
          onGestureEvent={({nativeEvent}) => {
            if (nativeEvent.translationX > 50) {
              handleSwipe('right');
            } else if (nativeEvent.translationX < -50) {
              handleSwipe('left');
            }
          }}>
          <View>
            <TabBar
              {...props}
              style={[styles.tabBar, {
                backgroundColor: theme.colors.primary,
              }]}
              pressColor="transparent"
              indicatorStyle={{display: 'none'}}
            />
          </View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <TabView
        navigationState={{index, routes}}
        commonOptions={{
          icon: ({route, focused, color}) => (
            route.type === 'image' ?
            <Image source={{uri: route.icon}} style={{width: 25, height: 25, borderRadius: 100}} /> 
            : 
            <Icon name={route.icon} color={color} size={20} />
          ),
          label: () => null,
        }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={renderTabBar}
        swipeEnabled={false}
      />
    </View>
  );
};

const App = () => {
  const theme = useTheme();
  return (
    // <QueryClientProvider client={queryClient}>
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.background,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: theme.colors.text.primary,
            headerTitleStyle: {
              fontWeight: '600',
              color: theme.colors.text.primary,
              fontSize: 15,
            },
            headerTitleAlign: 'center',
            cardStyle: {backgroundColor: theme.colors.background},
          }}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ItemDetails"
            options={{title: 'Details'}}
            component={ItemDetailsScreen}
          />
          <Stack.Screen
            name="MyListings"
            options={{title: 'My Items'}}
            component={MyListingsScreen}
          />
          <Stack.Screen
            name="MyRentals"
            options={{title: 'My Rentals'}}
            component={MyRentalsScreen}
          />
          <Stack.Screen
            name="Settings"
            options={{title: 'Settings'}}
            component={SettingsScreen}
          />
          <Stack.Screen
            name="Theme"
            options={{title: 'Theme'}}
            component={ThemeScreen}
          />
          <Stack.Screen
            name="Search"
            options={{title: 'Search', headerShown: false}}
            component={SearchScreen}
          />
          <Stack.Screen
            name="ChatDetails"
            options={({ route }) => ({
              title: route.params?.name || 'Chat',
              headerTitleAlign: 'left',
              headerLeft: (props) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  {props.canGoBack && props.onPress && (
                    <Icon 
                      name="angle-left" 
                      size={25} 
                      style={{ marginLeft: 10 }}
                      onPress={props.onPress}
                      color={props.tintColor}
                    />
                  )}
                  <CustomImage 
                    source={ route.params?.profileImage || avatar }
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 17.5,
                      marginLeft: 15,
                      marginRight: 8
                    }}
                  />
                </View>
              )
            })}
            component={ChatDetails}
          />
          <Stack.Screen
            name="CategoryItems"
            options={{title: 'Category Items'}}
            component={CategoryItems}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
    // </QueryClientProvider>
  );
};

const Root = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  );
};

export default Root;

const styles = StyleSheet.create({
  tabBar: {
    borderRadius: 300,
    width: '80%',
    alignSelf: 'center',
    height: 50,
    alignItems: 'center',
  },
});
