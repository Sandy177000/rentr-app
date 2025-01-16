import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, RefreshControl } from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout } from '../store/authSlice';
import { useTheme } from '../src/theme/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const user = useSelector(selectCurrentUser);

  const recentListings = [
    { id: 1, title: 'Mountain Bike', price: '$15/day' },
    { id: 2, title: 'Camera Kit', price: '$25/day' },
    { id: 3, title: 'Camping Tent', price: '$20/day' },
    { id: 4, title: 'Camera Kit', price: '$25/day' },
    { id: 5, title: 'Camping Tent', price: '$20/day' },
  ];

  const recentRentals = [
    { id: 1, title: 'Surfboard', price: '$30/day' },
    { id: 2, title: 'DJ Equipment', price: '$45/day' },
    { id: 3, title: 'Drone', price: '$35/day' },
  ];

  const ItemCard = ({ title, price }) => (
    <View style={[styles.itemCard, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.itemImagePlaceholder, { backgroundColor: theme.colors.surface }]} />
      <Text style={[styles.itemTitle, { color: theme.colors.text.primary }]}>{title}</Text>
      <Text style={[styles.itemPrice, { color: theme.colors.text.secondary }]}>{price}</Text>
    </View>
  );

  const ProfileSection = ({ title, icon, onPress }) => (
    <TouchableOpacity 
      style={[styles.sectionContainer, { backgroundColor: theme.colors.background }]} 
      onPress={onPress}
    >
      <View style={styles.sectionContent}>
        <Icons name={icon} size={24} color={theme.colors.text.primary} />
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>{title}</Text>
      </View>
      <Icons name="chevron-forward" size={24} color={theme.colors.text.secondary} />
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
    console.log('user', user);
    
    return <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.text.primary}
          colors={[theme.colors.text.primary]}
          progressBackgroundColor={theme.colors.background}
        />
      }
    >
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: '' }} style={styles.profileImage} />
          <TouchableOpacity style={[styles.editImageButton, { backgroundColor: theme.colors.primary }]}>
            <Icons name="camera" size={20} color={theme.colors.background} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.name, { color: theme.colors.text.primary }]}>{user.name}</Text>
        <Text style={[styles.email, { color: theme.colors.text.secondary }]}>{user.email}</Text>
      </View>

      <View style={styles.sectionsContainer}>
        <ProfileSection 
          title="My Listed Items" 
          icon="list" 
          onPress={() => navigation.navigate('MyListings')} 
        />
        <ProfileSection 
          title="Items Rented by Me" 
          icon="cart" 
          onPress={() => navigation.navigate('MyRentals')} 
        />

        <View style={styles.recentSection}>
          <Text style={[styles.recentTitle, { color: theme.colors.text.primary }]}>
            Recently Listed Items
          </Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.recentItemsContainer}>
              {recentListings.map(item => (
                <ItemCard key={item.id} title={item.title} price={item.price} />
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.recentSection}>
          <Text style={[styles.recentTitle, { color: theme.colors.text.primary }]}>
            Recently Rented Items
          </Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.recentItemsContainer}>
              {recentRentals.map(item => (
                <ItemCard key={item.id} title={item.title} price={item.price} />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleLogout}
      >
        <Text style={[styles.logoutText, { color: theme.colors.background }]}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  }

  return (
    user && renderProfile()
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#666666',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
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
    fontSize: 18,
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
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 12,
    color: '#666',
  },
});

export default ProfileScreen;
