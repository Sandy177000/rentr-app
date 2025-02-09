import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBaseUrl } from './constants';

const API_BASE_URL = getBaseUrl();

export const userApi = {
  updateUserInfo: async (userData) => {
    try {

      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        return {error: 'User not found'}; 
      }
      const { token } = JSON.parse(storedUser);

      const response = await axios.post(`${API_BASE_URL}/users/update`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      
      return response.data;   
    } catch (error) {
      console.error("Error updating profile image:", error);
      return {error: 'Failed to update profile image'};
    }
  },
  getUserInfo: async () => {
    const storedUser = await AsyncStorage.getItem('user');
    if (!storedUser) {
      return {error: 'User not found'}; 
    }
    const { token } = JSON.parse(storedUser);
    const response = await axios.get(`${API_BASE_URL}/users/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  }
};