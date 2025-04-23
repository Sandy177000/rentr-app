import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage service for managing local storage operations
 * This service provides a consistent interface for storing and retrieving data
 */
export const storageService = {
  /**
   * Store a value in local storage
   * @param {string} key - The key to store the value under
   * @param {any} value - The value to store (will be JSON stringified)
   * @returns {Promise<void>}
   */
  storeData: async (key, value) => {
    try {
      const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing data:', error);
      throw error;
    }
  },

  /**
   * Retrieve a value from local storage
   * @param {string} key - The key to retrieve
   * @param {boolean} parseJson - Whether to parse the result as JSON
   * @returns {Promise<any>} The stored value
   */
  getData: async (key, parseJson = true) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null && parseJson) {
        try {
          return JSON.parse(value);
        } catch (e) {
          // Value is not JSON, return as is
          return value;
        }
      }
      return value;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  },

  /**
   * Remove a value from local storage
   * @param {string} key - The key to remove
   * @returns {Promise<void>}
   */
  removeData: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  },

  /**
   * Clear all values from local storage
   * @returns {Promise<void>}
   */
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
};

// Auth-specific storage functions
export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';

export const authStorage = {
  /**
   * Store authentication token
   * @param {string} token - JWT token
   * @returns {Promise<void>}
   */
  setToken: async (token) => {
    return storageService.storeData(TOKEN_KEY, token);
  },

  /**
   * Get authentication token
   * @returns {Promise<string|null>} The token or null
   */
  getToken: async () => {
    return storageService.getData(TOKEN_KEY, false);
  },

  /**
   * Remove authentication token
   * @returns {Promise<void>}
   */
  removeToken: async () => {
    return storageService.removeData(TOKEN_KEY);
  },

  /**
   * Store user data
   * @param {Object} userData - User information
   * @returns {Promise<void>}
   */
  setUser: async (userData) => {
    return storageService.storeData(USER_KEY, userData);
  },

  /**
   * Get user data
   * @returns {Promise<Object|null>} User data or null
   */
  getUser: async () => {
    return storageService.getData(USER_KEY);
  },

  /** 
   * Save authentication data
   * @param {Object} authData - Authentication data
   * @returns {Promise<void>}
   */
  saveAuth: async (authData) => {
    await authStorage.setToken(authData.token);
    await authStorage.setUser(authData);
  },

  /**
   * Remove user data
   * @returns {Promise<void>}
   */
  removeUser: async () => {
    return storageService.removeData(USER_KEY);
  },

  /**
   * Clear all auth data (logout)
   * @returns {Promise<void>}
   */
  clearAuth: async () => {
    await authStorage.removeToken();
    await authStorage.removeUser();
  },
};
