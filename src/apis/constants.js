import {Platform} from 'react-native';
export const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://192.168.1.44:4000/api'; // Android emulator
  }
  return 'http://localhost:4000/api'; // iOS simulator
};





// admin@gmail.com
// admin123

// t@t.com
// Test@123