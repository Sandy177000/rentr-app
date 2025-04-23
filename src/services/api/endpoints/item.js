import {apiClient} from '../apiClient';

/**
 * API module for item-related operations
 */
export const itemApi = {
  /**
   * Get all items
   * @returns {Promise<Array>} List of items
   */
  getItems: async () => {
    try {
      const response = await apiClient.get('/items');
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      return [];
    }
  },

  /**
   * Create a new item
   * @param {Object} item - The item data to create
   * @returns {Promise<Object>} Created item data
   */
  createItem: async item => {
    try {
      // Special case for multipart/form-data
      const headers = {'Content-Type': 'multipart/form-data'};
      const response = await apiClient.post('/items', item, {headers});
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  /**
   * Update an existing item
   * @param {string} id - Item ID to update
   * @param {Object} item - Updated item data
   * @returns {Promise<Object>} Updated item data
   */
  updateItem: async (id, item) => {
    try {
      const response = await apiClient.put(`/items/${id}`, item);
      return response.data;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  /**
   * Delete an item
   * @param {string} id - Item ID to delete
   * @returns {Promise<Object>} Deletion result
   */
  deleteItem: async id => {
    try {
      const response = await apiClient.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },

  /**
   * Search for items
   * @param {string} query - Search query string
   * @returns {Promise<Array>} Search results
   */
  searchItems: async query => {
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

  /**
   * Get items belonging to the current user
   * @returns {Promise<Array>} User's items
   */
  getUserItems: async () => {
    try {
      const response = await apiClient.get('/items/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user items:', error);
      return [];
    }
  },

  /**
   * Get items by category
   * @param {string} category - Category to filter by
   * @returns {Promise<Array>} Category filtered items
   */
  getCategoryItems: async category => {
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

  /**
   * Get a specific item by ID
   * @param {string} id - Item ID to retrieve
   * @returns {Promise<Object>} Item data
   */
  getItemById: async id => {
    try {
      const response = await apiClient.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching item by id:', error);
      throw error;
    }
  },
};
