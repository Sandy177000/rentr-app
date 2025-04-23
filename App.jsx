/* eslint-disable react-native/no-inline-styles */
// App.js
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import store from './store/store';
import ItemDetailsScreen from './screens/ItemDetailScreen';
import SettingsScreen from './screens/SettingsScreen';
import {MyListingsScreen} from './screens/MyListingsScreen';
import {RegisterScreen} from './screens/RegisterScreen';
import MyRentalsScreen from './screens/MyRentalsScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {View} from 'react-native';
import {useTheme} from './src/theme/ThemeProvider';
import {LoginScreen} from './screens/LoginScreen';
import {ThemeProvider} from './src/theme/ThemeProvider';
import ThemeScreen from './screens/ThemeScreen';
import SearchScreen from './screens/SearchScreen';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ChatDetails from './screens/ChatDetails';
import CategoryItems from './screens/CategoryItems';
import {avatar} from './src/constants';
import CustomImage from './src/components/common/CustomImage';
import Toast from 'react-native-toast-message';
import MainTabs from './src/components/MainTabs';


const Stack = createStackNavigator();
const queryClient = new QueryClient();

const renderChatHeader = (props, route) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {props.canGoBack && props.onPress && (
        <Icon
          name="angle-left"
          size={25}
          style={{marginLeft: 20}}
          onPress={props.onPress}
          color={props.tintColor}
        />
      )}
      <CustomImage
        source={route.params?.profileImage || avatar}
        style={{
          width: 35,
          height: 35,
          borderRadius: 17.5,
          marginLeft: 15,
          marginRight: 8,
        }}
        showLoading={false}
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
            options={{title: 'Details', headerShown: false}}
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
            options={({route}) => ({
              title: route.params?.name || 'Chat',
              headerTitleAlign: 'left',
              headerLeft: props => renderChatHeader(props, route),
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
      <Toast />
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

