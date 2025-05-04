import {apiClient} from '../apiClient';
import { TFormData } from './../../../components/types';
/**
 * API module for item-related operations
 */
export const itemApi = {
  getItems: async () => {
    try {
      const response = await apiClient.get('/items');
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      return [];
    }
  },

  createItem: async (item: TFormData) => {
    try {
      const response = await apiClient.post('/items', item);
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  updateItem: async (id: string | undefined, item: TFormData) => {
    try {
      const response = await apiClient.patch(`/items/${id}`, item);
      console.log('response', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating item:', error.message);
      throw error;
    }
  },

  deleteItem: async (id: string | undefined | null) => {
    try {
      if (!id) {
        throw new Error('Item not found');
      }
      const response = await apiClient.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },

  searchItems: async (query: string) => {
    try {
      const response = await apiClient.get('/items/search', {
        params: {query},
      });
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  },


  getUserItems: async () => {
    try {
      const response = await apiClient.get('/items/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user items:', JSON.stringify(error));
      return [];
    }
  },

  getCategoryItems: async (category: string) => {
    try {
      const response = await apiClient.get('/items/category', {
        params: {category},
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching category items:', error);
      return [];  
    }
  },

  getItemById: async (id: string | undefined) => {
    try {
      if (!id) {
        throw new Error('Item not found');
      }
      const response = await apiClient.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching item by id:', error);
      throw error;
    }
  },

  getNearbyItems: async (data: {latitude: number, longitude: number, radius: number}) => {
    try {
      const response = await apiClient.get('/items/nearby', {params: data});
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby items:', error);
      return [];
    }
  },
};
