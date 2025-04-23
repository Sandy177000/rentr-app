import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  loginUser,
  selectAuthError,
  clearError,
  restoreUser,
  setError,
} from '../../../store/authSlice';
import { useNavigation } from '@react-navigation/native';
import { authStorage } from '../../services';

export const useLogin = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [formData, setFormData] = useState({email: 'sandeshyele2000@gmail.com', password: 'Qwerty@12345'});
  const error = useSelector(selectAuthError);

  const handleLogin = async () => {
    try {
      setLoading(true);
      if (!formData.email || !formData.password) {
        throw new Error('Email and password are required');
      }

      const result = await dispatch(loginUser(formData)).unwrap();
      if (result) {
        await authStorage.saveAuth(result);
        navigation.replace('MainTabs');
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      dispatch(setError('Login error'));
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
        const storedUser = await authStorage.getUser();
        if (storedUser) {
          const {user, token} = JSON.parse(storedUser);
          dispatch(restoreUser({user, token}));
          navigation.replace('MainTabs');
        }
      } catch (err) {
        await authStorage.clearAuth();
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
