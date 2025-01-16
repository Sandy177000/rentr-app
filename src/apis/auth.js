import axios from 'axios';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000/api';  // Android emulator
  }
  return 'http://localhost:4000/api';    // iOS simulator
};

const API_BASE_URL = getBaseUrl();

export const authApi = {
  login: async (credentials) => {
    try {
      console.log('API URL:', `${API_BASE_URL}/auth/login`);  // Debug log
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);      
      return response.data;
    } catch (error) {
      console.error('Full error:', error);  // Log full error
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};