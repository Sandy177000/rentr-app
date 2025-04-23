/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useRegister} from '../src/hooks/auth/useRegister';
import {colors} from '../src/theme/theme';
import Divider from '../src/components/Divider';
import InputField from '../src/components/common/InputField';
import { getTextStyle } from '../src/utils/utils';

export const RegisterScreen = ({navigation}) => {
  const {
    formData,
    error,
    loading,
    theme,
    securePasswordEntry,
    secureConfirmPasswordEntry,
    setSecurePasswordEntry,
    setSecureConfirmPasswordEntry,
    handleFormData,
    onRegister,
  } = useRegister();



  const renderForm = () => (
    <>
      <View style={{gap: 10, marginTop: 20, marginBottom: 20}}>
        <InputField
          label="First Name"
          value={formData.firstName}
          onChangeText={value => handleFormData('firstName', value)}
          placeholder="Enter your first name"
          required
        />

        <InputField
          label="Last Name"
          value={formData.lastName}
          onChangeText={value => handleFormData('lastName', value)}
          placeholder="Enter your last name"
          required
        />

        <InputField
          label="Email"
          value={formData.email}
          onChangeText={value => handleFormData('email', value)}
          placeholder="Enter your email"
          required
        />

        <InputField
          label="Password"
          value={formData.password}
          onChangeText={value => handleFormData('password', value)}
          placeholder="Enter your password"
          secure={securePasswordEntry}
          toggleSecure={() => setSecurePasswordEntry(!securePasswordEntry)}
          required
        />

        <InputField
          label="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={value => handleFormData('confirmPassword', value)}
          placeholder="Confirm your password"
          secure={secureConfirmPasswordEntry}
          toggleSecure={() =>
            setSecureConfirmPasswordEntry(!secureConfirmPasswordEntry)
          }
          required
        />
      </View>

      {error && (
        <Text
          style={[
            styles.errorText,
            {color: theme.colors.error, alignSelf: 'center', marginBottom: 20},
          ]}>
          {error}
        </Text>
      )}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.primary,
            padding: 15,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
        onPress={onRegister}>
        <Text
          style={[
            getTextStyle('h3'),
            {color: colors.white, fontWeight: '800', textAlign: 'center'},
          ]}>
          {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
        </Text>
      </TouchableOpacity>
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
          <Divider />
          <Text
            style={[getTextStyle('h3'), {color: theme.colors.text.secondary}]}>
            Complete your profile
          </Text>
          {renderForm()}
          <View style={styles.loginContainer}>
            <Text
              style={[
                getTextStyle('h4'),
                {color: theme.colors.text.secondary},
              ]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                style={[
                  getTextStyle('h4'),
                  {
                    color: theme.colors.primary,
                    textDecorationLine: 'underline',
                  },
                ]}>
                Login
              </Text>
            </TouchableOpacity>
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
  input: {
    flex: 1,
    fontSize: 13,
    borderRadius: 15,
  },
  button: {
    borderRadius: 30,
    flexDirection: 'row',
  },
});
