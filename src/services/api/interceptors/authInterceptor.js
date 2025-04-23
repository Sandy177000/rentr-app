import { authStorage } from '../../storage/storageService';
import Toast from 'react-native-toast-message';

/**
 * Request interceptor to add authentication token to requests
 * @param {Object} config - Axios request config
 * @returns {Promise<Object>} Modified config with auth headers
 */
export const requestInterceptor = async (config) => {
  try {
    const token = await authStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error in request interceptor:', error);
    return config;
  }
};