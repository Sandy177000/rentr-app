import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBaseUrl } from './constants';

const API_BASE_URL = getBaseUrl();

export const itemApi = {
  getItems: async () => {
    const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        return [];
      }

    const { token } = JSON.parse(storedUser);
    const response = await axios.get(`${API_BASE_URL}/items`,{
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
  },
  createItem: async (item) => {
    const storedUser = await AsyncStorage.getItem('user');
    

    if (!storedUser) {
      return {error: 'User not found'};
    }

    const { token } = JSON.parse(storedUser);
    const response = await axios.post(`${API_BASE_URL}/items`, item, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  updateItem: async (id, item) => {
    const response = await axios.put(`${API_BASE_URL}/items/${id}`, item);
    return response.data;
  },
  deleteItem: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/items/${id}`);
    return response.data;
  },
  searchItems: async (query) => {
    const response = await axios.get(`${API_BASE_URL}/items/search?query=${query}`);
    return response.data;
  },
  getUserItems: async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      

      if (!storedUser) {
        return [];
      }

      const { token } = JSON.parse(storedUser);
      const response = await axios.get(
        `${API_BASE_URL}/items/user`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user items:', error);
      throw error;
    }
  },
};
