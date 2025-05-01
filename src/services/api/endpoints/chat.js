import {apiClient} from '../apiClient';

export const chatApi = {
  createChatRoom: async participantId => {
    try {
      const response = await apiClient.post('/chat/rooms', {
        participantId,
      });
      return response.data;
    } catch (error) {
      console.error('Create chat room error:', error);
      throw error;
    }
  },

  getChatRooms: async () => {
    try {
      const response = await apiClient.get('/chat/rooms');
      return response.data;
    } catch (error) {
      console.error('Get chat rooms error:', error);
      throw error;
    }
  },

  getChatMessages: async (roomId, limit = 10, page = 1) => {
    try {
      const response = await apiClient.get(
        `/chat/rooms/${roomId}/messages?limit=${limit}&page=${page}`,
      );
      return response.data;
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  },

  sendMessage: async data => {
    try {
      console.log(data);

      const response = await apiClient.post(
        '/chat/rooms/messages',
        data,
      );
      return response.data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  },

  mediaUpload: async data => {
    try {
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      console.log('mediaUpload', data);
      const response = await apiClient.post(
        '/chat/media-upload',
        data,
        {
          headers,
        },
      );
      return response.data;
    } catch (error) {
      console.error('Media upload error:', JSON.stringify(error));
      throw error;
    }
  },
};
