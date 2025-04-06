import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  loginUser,
  selectAuthError,
  clearError,
  restoreUser,
  setError,
  logout,
} from '../../../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export const useLogin = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  // const [email, setEmail] = useState('admin@rentr.com'); // hello@world.com
  // const [password, setPassword] = useState('Admin@123'); // Sandesh@2000
  // const [email, setEmail] = useState('t@t.c'); // hello@world.com
  // const [password, setPassword] = useState('Test@123'); // Sandesh@2000
  const [formData, setFormData] = useState({email: '', password: ''}); // hello@world.com
  const error = useSelector(selectAuthError);

  const handleLogin = async () => {
    try {
      setLoading(true);
      if (!formData.email || !formData.password) {
        throw new Error('Email and password are required');
      }

      const result = await dispatch(loginUser(formData)).unwrap();
      if (result) {
        await AsyncStorage.setItem('user', JSON.stringify(result));
        await AsyncStorage.setItem('token', result.token);
        navigation.replace('MainTabs');
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      dispatch(setError(err.message || 'Login error'));
      throw new Error(err.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  const handleFormData = (key, value) => {
    setFormData({...formData, [key]: value});
  };

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const {user, token} = JSON.parse(storedUser);
          dispatch(restoreUser({user, token}));
          navigation.replace('MainTabs');
        }
      } catch (err) {
        await AsyncStorage.removeItem('user');
      }
    };
    checkAuthState();
  }, [dispatch, navigation]);

  return {
    loading,
    setLoading,
    error,
    handleLogin,
    formData,
    handleFormData,
  };
};
