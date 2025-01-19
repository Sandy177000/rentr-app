import axios from 'axios';
import { getBaseUrl } from './constants';

const API_BASE_URL = getBaseUrl();

export const authApi = {
  login: async (credentials) => {
    try {
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