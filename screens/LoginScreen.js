// screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../src/theme/ThemeProvider';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectAuthError, selectAuthLoading, clearError, selectCurrentUser, restoreUser } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleLogin = async () => {
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      if(result) {
        // Store user data in AsyncStorage upon successful login
        await AsyncStorage.setItem('user', JSON.stringify(result));
        navigation.replace('MainTabs');
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      console.error('Login Error:', err);
    }
  };

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const { user, token } = JSON.parse(storedUser);
          dispatch(restoreUser(user));
          navigation.replace('MainTabs');
        }
      } catch (error) {
        await AsyncStorage.removeItem('user');
      }
    };
    checkAuthState();
  }, [dispatch, navigation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Welcome Back
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Sign in to continue
        </Text>

        <TextInput
          style={[styles.input, {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text.primary
          }]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholderTextColor={theme.colors.text.secondary}
        />
        <TextInput
          style={[styles.input, {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text.primary
          }]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={theme.colors.text.secondary}
        />

        {error && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
        )}
        
        <TouchableOpacity
          style={[
            styles.loginButton,
            { backgroundColor: theme.colors.primary },
            loading && styles.disabledButton
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={[styles.registerText, { color: theme.colors.text.secondary }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.registerLink, { color: theme.colors.primary }]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#1a1a1a',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#666',
    fontSize: 16,
  },
  registerLink: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
});