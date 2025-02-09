import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBaseUrl } from './constants';

const API_BASE_URL = getBaseUrl();

export const chatApi = {
  createChatRoom: async (participantId) => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        return { error: 'User not found' };
      }
      const { token } = JSON.parse(storedUser);

      const response = await axios.post(
        `${API_BASE_URL}/chat/rooms`,
        { participantId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Create chat room error:', error);
      throw error;
    }
  },

  getChatRooms: async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        return { error: 'User not found' };
      }
      const { token } = JSON.parse(storedUser);

      const response = await axios.get(`${API_BASE_URL}/chat/rooms`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Get chat rooms error:', error);
      throw error;
    }
  },

  getChatMessages: async (roomId) => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        return { error: 'User not found' };
      }
      const { token } = JSON.parse(storedUser);

      const response = await axios.get(`${API_BASE_URL}/chat/rooms/${roomId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  },

  sendMessage: async (roomId, message) => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        return { error: 'User not found' };
      }
      const { token } = JSON.parse(storedUser);

      const response = await axios.post(`${API_BASE_URL}/chat/rooms/${roomId}/messages`, {
        content: message,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  },
};
