import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from './constants';

const API_BASE_URL = getApiUrl();

export const chatApi = {
  createChatRoom: async (participantId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return { error: 'User not found' };
      }

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
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return { error: 'User not found' };
      }

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
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return { error: 'User not found' };
      }

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

  sendMessage: async (data) => {
    try {
      console.log(data);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return { error: 'User not found' };
      }

      const response = await axios.post(`${API_BASE_URL}/chat/rooms/messages`, data, {
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

  mediaUpload: async (data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return { error: 'User not found' };
      }

      const response = await axios.post(`${API_BASE_URL}/chat/media-upload`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Media upload error:', JSON.stringify(error));
      throw error;
    }
  },
};
