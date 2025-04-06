import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  registerUser,
  selectAuthError,
  clearError,
} from '../../../store/authSlice';
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
    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };
      const result = await dispatch(registerUser(userData)).unwrap();
      if (result) {
        navigation.replace('MainTabs');
      } else {
        throw new Error('Registration failed');
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
