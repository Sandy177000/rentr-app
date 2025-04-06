import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from './constants';

const API_BASE_URL = getApiUrl();

export const itemApi = {
  getItems: async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return [];
    }

    const response = await axios.get(`${API_BASE_URL}/items`,{
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data;
  },
  createItem: async (item) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return {error: 'User not found'};
    }

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
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return {error: 'User not found'};
    }
    const response = await axios.delete(`${API_BASE_URL}/items/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error.message;
    }
  },
  searchItems: async (query) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/items/search?query=${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Search error:', JSON.stringify(error));
      throw error.message;
    }
  },
  getUserItems: async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        return [];
      }

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
      throw error.message;
    }
  },
  getCategoryItems: async (category) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return [];
    }
    const response = await axios.get(`${API_BASE_URL}/items/category?category=${category}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
    } catch (error) {
      console.error('Error fetching category items:', error);
      throw error.message;
    }
  },
  getItemById: async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return [];
      }
    const response = await axios.get(`${API_BASE_URL}/items/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
    } catch (error) {
      console.error('Error fetching item by id:', error);
      throw error.message;
    }
  },
};
