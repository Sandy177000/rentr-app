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
import {registerFormInputFields} from '../src/utils/auth/auth.utils';
import {colors} from '../src/constants';
export const RegisterScreen = ({navigation}) => {
  const {formData, error, loading, handleFormData, handleRegister} = useRegister();
  const theme = useTheme();

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
      <CustomButton  variant="primary" type="action" onPress={handleRegister}>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  registerButton: {
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
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
