import {Platform} from 'react-native';
export const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://192.168.1.36:4000/api'; // Android emulator
  }
  return 'http://localhost:4000/api'; // iOS simulator
};
