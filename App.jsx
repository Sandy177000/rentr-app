// App.js
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import store from './store/store';
import {ItemDetailsScreen} from './screens/ItemDetailScreen';
import AboutScreen from './screens/AboutScreen';
import SettingsScreen from './screens/SettingsScreen';
import {HomeScreen} from './screens/HomeScreen';
import {ListItemScreen} from './screens/ListItemScreen';
import ProfileScreen from './screens/ProfileScreen';
import {MyListingsScreen} from './screens/MyListingsScreen';
import {RegisterScreen} from './screens/RegisterScreen';
import MyRentalsScreen from './screens/MyRentalsScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useWindowDimensions} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {View} from 'react-native';
import {useTheme} from './src/theme/ThemeProvider';
import {LoginScreen} from './screens/LoginScreen';
import {ThemeProvider} from './src/theme/ThemeProvider';
import SearchScreen from './screens/SearchScreen';

const Stack = createStackNavigator();

const MainTabs = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(1);
  const theme = useTheme();

  const routes = [
    {key: 'home', title: 'Home', icon: 'home'},
    {key: 'search', title: 'Search', icon: 'search'},
    {key: 'listItem', title: 'List Item', icon: 'plus-circle'},
    {key: 'profile', title: 'Profile', icon: 'user'},
  ];

  const renderScene = SceneMap({
    listItem: ListItemScreen,
    home: HomeScreen,
    profile: ProfileScreen,
    search: SearchScreen,
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
              style={{
                backgroundColor: theme.colors.primary,
                borderRadius: 300,
                width: '95%',
                alignSelf: 'center',
                height: 50,
              }}
              indicatorStyle={{display: 'none'}}
              tabStyle={{flex: 1}}
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
            },
            cardStyle: {backgroundColor: theme.colors.background},
          }}>
          <Stack.Screen name="Login" component={LoginScreen}  options={{headerShown: false}}/>
          <Stack.Screen name="Register" component={RegisterScreen} />
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
          {/* <Stack.Screen name="About" options={{ title: "About" }} component={AboutScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const Root = () => {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  );
};

export default Root;
