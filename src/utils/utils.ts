import { Keyboard, Platform, Linking, Alert } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { launchCamera, launchImageLibrary, CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';

export const formatDate = (date: string) => {
  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (messageDate.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return messageDate.toLocaleDateString();
  }
};

export const renderDateSeparator = (currentMessage: any, prevMessage: any) => {
  if (!prevMessage) {
    return true;
  }
  const currentDate = new Date(currentMessage.createdAt).toDateString();
  const prevDate = new Date(prevMessage.createdAt).toDateString();
  return currentDate !== prevDate;
};

export const getTextStyle = (variant: string) => {
  switch (variant) {
    case 'h1':
      return {fontSize: 19};
    case 'h2':
      return {fontSize: 17};
    case 'h3':
      return {fontSize: 15};
    case 'h4':
      return {fontSize: 13};
    case 'h5':
      return {fontSize: 11};
    default:
      return {fontSize: 13};
  }
};

export const validatePassword = (password: string) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return 'Password must be at least 8 characters long';
  }
  if (!hasUpperCase) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!hasLowerCase) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!hasNumbers) {
    return 'Password must contain at least one number';
  }
  if (!hasSpecialChar) {
    return 'Password must contain at least one special character';
  }
  return '';
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? '' : 'Invalid email address';
};


export const getLocationName = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'com.rentr.app/1.0',
        },
      }
    );
    const data = await response.json();
    const displayName = data.display_name;
    return displayName;
  } catch (error) {
    console.error('Error getting location name:', error);
    return null;
  }
};


export const isKeyboardVisible = (): boolean => {
  return Keyboard.isVisible();
};

export const isIOS = (): boolean => {
  return Platform.OS === 'ios';
};

export const isAndroid = (): boolean => {
  return Platform.OS === 'android';
};


export const handleMediaPicker = async (source: string, callback: (asset: any) => void) => {
  const options: CameraOptions | ImageLibraryOptions = {
    quality: 0.8,
    maxWidth: 1200,
    maxHeight: 1200,
    saveToPhotos: true,
    mediaType: source === 'camera' ? 'video' : 'photo',
  };
  try {
    let response;
    if (source === 'camera') {
      response = await launchCamera(options as CameraOptions);
    }
    if (source === 'gallery') {
      response = await launchImageLibrary(options as ImageLibraryOptions);
    }

    // Handle camera permissions
    if (response?.errorCode === 'others') {
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera access in your device settings.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Open Settings',
            onPress: () => {
              if (isIOS()) {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
        ],
      );
      return;
    }

    if (response?.didCancel) {
      return;
    }

    if (response?.errorCode) {
      console.log('ImagePicker Error:', response);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: response.errorMessage || 'An unexpected error occurred',
      });
      return;
    }

    if (response?.assets && response?.assets?.length > 0) {
      const asset = response.assets[0];
      callback(asset);
    }
  } catch (error) {
    console.log(error);
  }
};
