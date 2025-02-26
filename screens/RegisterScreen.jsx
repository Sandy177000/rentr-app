/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ScrollView,
} from 'react-native';
import {useTheme} from '../src/theme/ThemeProvider';
import CustomText from '../src/components/common/CustomText';
import {useRegister} from '../src/hooks/auth/useRegister';
import CustomTextInputField from '../src/components/common/CustomTextInputField';
import CustomButton from '../src/components/common/CustomButton';
import {colors} from '../src/constants';
import { registerFormInputFields } from '../src/utils/form/registeration';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const RegisterScreen = ({navigation}) => {
  const {formData, error, loading, handleFormData, handleRegister} = useRegister();
  const theme = useTheme();

  const onRegister = async () => {
    try {
      await handleRegister();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created successfully!',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error || 'Something went wrong',
      });
    }
  };

  const renderRegisterFormInputFields = () => {
    return (
      <View style={{gap: 10, marginTop: 20, marginBottom: 20}}>
        {registerFormInputFields.map(field => (
          <CustomTextInputField
            {...field}
            value={formData[field.key]}
            onChangeText={value => handleFormData(field.key, value)}
            placeholderColor={colors.gray}
          />
        ))}
      </View>
    );
  };

  const renderForm = () => (
    <>
      {renderRegisterFormInputFields()}
      {error && (
        <CustomText
          style={[
            styles.errorText,
            {color: theme.colors.error, alignSelf: 'center', marginBottom: 20},
          ]}>
          {error}
        </CustomText>
      )}
      <CustomButton variant="primary" type="action" onPress={onRegister}>
        {loading ? (
          <CustomText variant="h3" style={{color: colors.white}} bold={800}>
            CREATING ACCOUNT...
          </CustomText>
        ) : (
          <CustomText variant="h3" style={{color: colors.white}} bold={800}>
            REGISTER
          </CustomText>
        )}
      </CustomButton>
    </>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.contentContainer}>
          <Text
            style={{
              color: theme.colors.text.primary,
              fontSize: 28,
              fontWeight: 'bold',
            }}>
            Create Account
          </Text>
          <CustomText variant="h3" style={{color: theme.colors.text.secondary}}>
            Complete your profile
          </CustomText>
          {renderForm()}
          <View style={styles.loginContainer}>
            <CustomText
              variant="h4"
              style={{color: theme.colors.text.secondary}}>
              Already have an account?{' '}
            </CustomText>
            <CustomButton
              type="label"
              onPress={() => navigation.navigate('Login')}>
              <CustomText
                variant="h4"
                style={{color: theme.colors.primary}}
                type="link">
                Login
              </CustomText>
            </CustomButton>
          </View>
        </View>
      </ScrollView>
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
});
