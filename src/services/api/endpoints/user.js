import {apiClient} from '../apiClient';

export const userApi = {
  updateUserInfo: async userData => {
    try {
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      const response = await apiClient.post(
        '/users/update',
        userData,
        {
          headers,
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
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      return {error: 'Failed to get user info'};
    }
  },
  getFavourites: async () => {
    try {
      const response = await apiClient.get('/users/favorites');
      return response.data;
    } catch (error) {
      console.log('error in getFavourites', error);
      return {error: 'Failed to get favourites'};
    }
  },
  addToFavourites: async itemId => {
    try {
      const response = await apiClient.post(
        '/users/add-favorite',
        {
          itemId,
        },
      );
      return response.data;
    } catch (error) {
      return {error: 'Failed to add to favourites'};
    }
  },
  removeFromFavourites: async itemId => {
    try {
      console.log('itemId in removeFromFavourites', itemId);
      const response = await apiClient.post(
        '/users/remove-favorite',
        {
          itemId,
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
      const response = await apiClient.post(
        '/users/update-theme',
        userThemeData,
      );
      return response.data;
    } catch (error) {
      console.log('error in updateUserTheme', error);
      return {error: 'Failed to update user theme'};
    }
  },
};
