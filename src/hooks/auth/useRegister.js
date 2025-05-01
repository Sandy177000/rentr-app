import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  registerUser,
  selectAuthError,
  clearError,
  setError
} from '../../../store/authSlice';
import {useNavigation} from '@react-navigation/native';
import {validateEmail, validatePassword} from '../../../src/utils/utils';
import { useTheme } from '../../theme/ThemeProvider';
import Toast from 'react-native-toast-message';
import { authStorage } from '../../services';

export const useRegister = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const theme = useTheme();
  const [securePasswordEntry, setSecurePasswordEntry] = useState(true);
  const [secureConfirmPasswordEntry, setSecureConfirmPasswordEntry] = useState(true);
  const error = useSelector(selectAuthError);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleFormData = (key, value) => {
    setFormData({...formData, [key]: value});
  };

  const handleRegister = async () => {
    validateForm();
    setLoading(true);
    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };
      const result = await dispatch(registerUser(userData)).unwrap();
      if (result) {
        await authStorage.saveAuth(result);
        navigation.replace('MainTabs');
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Account created successfully!',
        });
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      console.error('Registration Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const {email, password, confirmPassword, firstName, lastName} = formData;
    if (firstName === '' || lastName === '') {
      setError('First name and last name are required');
      return;
    }
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setError(emailValidationError);
      return;
    }
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
  };

  const onRegister = async () => {
    try {
      await handleRegister();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error || 'Something went wrong',
      });
    }
  };

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    formData,
    error,
    loading,
    theme,
    secureConfirmPasswordEntry,
    securePasswordEntry,
    setSecurePasswordEntry,
    setSecureConfirmPasswordEntry,
    setLoading,
    dispatch,
    handleFormData,
    handleRegister,
    onRegister,
    validateForm
  };
};
