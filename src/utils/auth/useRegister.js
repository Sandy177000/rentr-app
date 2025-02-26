import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  registerUser,
  selectAuthError,
  clearError,
  setError,
} from '../../../store/authSlice';
import {validateEmail, validatePassword} from './auth.utils';
import {useNavigation} from '@react-navigation/native';
export const useRegister = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const error = useSelector(selectAuthError);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleFormData = (key, value) => {
    setFormData({...formData, [key]: value});
  };

  const handleRegister = async () => {
    setLoading(true);
    const {email, password, confirmPassword, firstName, lastName} = formData;
    const passwordValidationError = validatePassword(password);
    const emailValidationError = validateEmail(email);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (emailValidationError) {
      setError(emailValidationError);
      return;
    }
    try {
      const userData = {
        email,
        password,
        firstName,
        lastName,
      };
      const result = await dispatch(registerUser(userData)).unwrap();
      if (result) {
        navigation.replace('MainTabs');
      }
    } catch (err) {
      console.error('Registration Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    formData,
    error,
    loading,
    setLoading,
    dispatch,
    handleFormData,
    handleRegister,
  };
};
