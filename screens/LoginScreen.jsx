/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import CustomText from '../src/components/common/CustomText';
import {useLogin} from '../src/hooks/auth/useLogin';
import {useTheme} from '../src/theme/ThemeProvider';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../src/components/common/CustomButton';
import {colors} from '../src/theme/theme';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useState} from 'react';

export const LoginScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const {loading, error, handleLogin, formData, handleFormData} = useLogin();

  const handleLoginWithToast = async () => {
    try {
      await handleLogin();
      Toast.show({
        type: 'success',
        text1: 'Logged in successfully',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.message,
      });
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.contentContainer}>
        <Text
          style={{
            color: theme.colors.text.primary,
            fontSize: 28,
            fontWeight: 'bold',
          }}>
          Welcome Back
        </Text>
        <CustomText variant="h3" style={{color: theme.colors.text.secondary}}>
          Log in to continue
        </CustomText>
        <View style={{gap: 10, marginTop: 20, marginBottom: 20}}>
          <TextInput
            label="Email"
            style={[styles.input, {backgroundColor: theme.colors.surface, color: theme.colors.text.primary}]}
            value={formData.email}
            onChangeText={value => handleFormData('email', value)}
            placeholder="Enter your email"
            placeholderTextColor={colors.gray}
          />
            <View style={[styles.passwordInput, {backgroundColor: theme.colors.surface}]}>
              <TextInput
              style={{color: theme.colors.text.primary}}
              label="Password"
              value={formData.password}
              onChangeText={value => handleFormData('password', value)}
              placeholder="Enter your password"
              placeholderTextColor={colors.gray}
              secureTextEntry={secureTextEntry}
            />
            <Icon
              name={secureTextEntry ? 'eye-slash' : 'eye'}
              size={20}
              color={theme.colors.text.primary}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          </View>
        </View>
        {error && (
          <CustomText
            variant="h5"
            style={{
              color: theme.colors.error,
              alignSelf: 'center',
              marginBottom: 20,
            }}>
            {error}
          </CustomText>
        )}
        <CustomButton
          variant="primary"
          type="action"
          onPress={handleLoginWithToast}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <View>
              <CustomText variant="h3" style={{color: colors.white}} bold={800}>
                LOGIN
              </CustomText>
            </View>
          )}
        </CustomButton>
        <View style={styles.registerContainer}>
          <CustomText variant="h4" style={{color: theme.colors.text.secondary}}>
            Don't have an account?{'  '}
          </CustomText>
          <CustomButton
            type="label"
            onPress={() => navigation.navigate('Register')}>
            <CustomText
              variant="h4"
              style={{color: theme.colors.primary}}
              type="link">
              Register
            </CustomText>
          </CustomButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  input: {
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  passwordInput: {
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
