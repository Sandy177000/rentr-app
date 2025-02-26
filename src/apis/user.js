import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getApiUrl} from './constants';

const API_BASE_URL = getApiUrl();

export const userApi = {
  updateUserInfo: async userData => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return {error: 'User not found'};
      }

      const response = await axios.post(
        `${API_BASE_URL}/users/update`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error updating profile image:', error);
      return {error: 'Failed to update profile image'};
    }
  },
  getUserInfo: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return {error: 'User not found'};
      }
      const response = await axios.get(`${API_BASE_URL}/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return {error: 'Failed to get user info'};
    }
  },
  getFavourites: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return {error: 'User not found'};
      }
      const response = await axios.get(`${API_BASE_URL}/users/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log('error in getFavourites', error);
      return {error: 'Failed to get favourites'};
    }
  },
  addToFavourites: async itemId => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return {error: 'User not found'};
      }
      const response = await axios.post(
        `${API_BASE_URL}/users/add-favorite`,
        {
          itemId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return {error: 'Failed to add to favourites'};
    }
  },
  removeFromFavourites: async itemId => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return {error: 'User not found'};
      }
      console.log('itemId in removeFromFavourites', itemId);
      const response = await axios.post(
        `${API_BASE_URL}/users/remove-favorite`,
        {
          itemId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('response in removeFromFavourites', response.data);
      return response.data;
    } catch (error) {
      console.log('error in removeFromFavourites', error);
      return {error: 'Failed to remove from favourites'};
    }
  },
  updateUserTheme: async userThemeData => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return {error: 'User not found'};
      } 
      const response = await axios.post(`${API_BASE_URL}/users/update-theme`, userThemeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log('error in updateUserTheme', error);
      return {error: 'Failed to update user theme'};
    }
  },
};
