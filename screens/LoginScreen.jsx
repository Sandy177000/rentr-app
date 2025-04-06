/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import CustomText from '../src/components/common/CustomText';
import CustomTextInputField from '../src/components/common/CustomTextInputField';
import {useLogin} from '../src/hooks/auth/useLogin';
import {useTheme} from '../src/theme/ThemeProvider';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../src/components/common/CustomButton';
import {colors} from '../src/theme/theme';
import Toast from 'react-native-toast-message';

export const LoginScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

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
          <CustomTextInputField
            label="Email"
            value={formData.email}
            onChangeText={value => handleFormData('email', value)}
            placeholder="Enter your email"
            placeholderColor={theme.colors.text.secondary}
          />
          <CustomTextInputField
            label="Password"
            value={formData.password}
            onChangeText={value => handleFormData('password', value)}
            placeholder="Enter your password"
            placeholderColor={theme.colors.text.secondary}
            type="password"
          />
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
        <CustomButton variant="primary" type="action" onPress={handleLoginWithToast}>
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
          <CustomButton type="label" onPress={() => navigation.navigate('Register')}>
            <CustomText variant="h4" style={{color: theme.colors.primary}} type="link">
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
});
