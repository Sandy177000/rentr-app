import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getApiConfig} from './endpoints/constants';
import Toast from 'react-native-toast-message';
import { requestInterceptor } from './interceptors/authInterceptor';

/**
 * Creates and configures an axios instance with interceptors for authentication and error handling
 */
const createApiClient = () => {
  const client = axios.create(getApiConfig());

  // Add request interceptor for auth
  client.interceptors.request.use(requestInterceptor);

  // Add response interceptor for errors and token refresh
  // client.interceptors.response.use(
  //   response => response,
  //   async error => {
  //     const originalRequest = error.config;

  //     // Handle 401 with token refresh
  //     if (error.response?.status === 401 && !originalRequest._retry) {
  //       originalRequest._retry = true;
  //       try {
  //         // TODO: Implement token refresh logic here
  //         // For now, we'll just get the existing token
  //         const token = await AsyncStorage.getItem('token');

  //         if (!token) {
  //           // If no token is available, redirect to login
  //           // This would be handled by the navigation system
  //           return Promise.reject(error);
  //         }

  //         originalRequest.headers.Authorization = `Bearer ${token}`;
  //         return client(originalRequest);
  //       } catch (refreshError) {
  //         console.error('Token refresh failed:', refreshError);

  //         // Show toast message
  //         Toast.show({
  //           type: 'error',
  //           text1: 'Authentication Error',
  //           text2: 'Your session has expired. Please login again.',
  //         });

  //         // Clear token
  //         await AsyncStorage.removeItem('token');

  //         return Promise.reject(refreshError);
  //       }
  //     }

  //     // Generic error handler
  //     let errorMessage = 'An unexpected error occurred';

  //     if (error.response) {
  //       // The request was made and the server responded with a status code
  //       errorMessage =
  //         error.response.data?.message || `Error: ${error.response.status}`;
  //     } else if (error.request) {
  //       // The request was made but no response was received
  //       errorMessage = 'No response from server. Please check your connection.';
  //     } else {
  //       // Something happened in setting up the request
  //       errorMessage = error.message || errorMessage;
  //     }

  //     // Log error for debugging
  //     console.error('API Error:', errorMessage, error);

  //     return Promise.reject(error);
  //   },
  // );

  return client;
};

export const apiClient = createApiClient();

// Auth service functions
export const getAuthToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const setAuthToken = async token => {
  return await AsyncStorage.setItem('token', token);
};

export const clearAuthToken = async () => {
  return await AsyncStorage.removeItem('token');
};
