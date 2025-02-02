import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '../src/theme/ThemeProvider';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, selectAuthError, selectAuthLoading, clearError } from '../store/authSlice';
import CustomText from '../src/components/CustomText';

export const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState(3);
  const [otp, setOtp] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const theme = useTheme();
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handleRegister = async () => {
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      alert("Please fix password validation errors");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
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
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      alert("Please enter a phone number");
      return;
    }
    // TODO: Implement OTP sending logic
    // This should call your backend API to send OTP
    try {
      // Mock API call for now
      alert("OTP sent to your phone number");
      setStep(2);
    } catch (err) {
      console.error('Error sending OTP:', err);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }
    // TODO: Implement OTP verification logic
    try {
      // Mock API call for now
      setIsPhoneVerified(true);
      setStep(3);
    } catch (err) {
      console.error('OTP verification error:', err);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // OTP service is not implemented yet skipping step 1 and step 2
  const renderStep1 = () => (
    <>
      <CustomText style={[styles.title, { color: theme.colors.text.primary }]}>
        Verify Phone Number
      </CustomText>
      <CustomText style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        Enter your phone number to get started
      </CustomText>

      <TextInput
        style={[styles.input, {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.primary
        }]}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        placeholderTextColor={theme.colors.text.secondary}
      />

      <TouchableOpacity
        style={[styles.registerButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleSendOTP}
      >
        <CustomText style={styles.buttonText}>Send OTP</CustomText>
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <CustomText style={[styles.title, { color: theme.colors.text.primary }]}>
        Enter OTP
      </CustomText>
      <CustomText style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        Enter the code sent to your phone
      </CustomText>

      <TextInput
        style={[styles.input, {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.primary
        }]}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        placeholderTextColor={theme.colors.text.secondary}
      />

      <TouchableOpacity
        style={[styles.registerButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleVerifyOTP}
      >
        <CustomText style={styles.buttonText}>Verify OTP</CustomText>
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <>
      <CustomText style={[styles.title, { color: theme.colors.text.primary }]}>
        Create Account
      </CustomText>
      <CustomText style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        Complete your profile
      </CustomText>

      <TextInput
        style={[styles.input, {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.primary
        }]}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor={theme.colors.text.secondary}
      />

      <TextInput
        style={[styles.input, {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.primary
        }]}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor={theme.colors.text.secondary}
      />

      <TextInput
        style={[
          styles.input, 
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text.primary
          },
          emailError ? { borderColor: theme.colors.error, borderWidth: 1 } : null
        ]}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError(!validateEmail(text) && text.length > 0 ? 'Please enter a valid email' : '');
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor={theme.colors.text.secondary}
      />
      {emailError ? (
        <CustomText style={[styles.errorText, { color: theme.colors.error, marginTop: -8 }]}>
          {emailError}
        </CustomText>
      ) : null}

      <TextInput
        style={[
          styles.input, 
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text.primary
          },
          passwordError ? { borderColor: theme.colors.error, borderWidth: 1 } : null
        ]}
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError(text.length > 0 ? validatePassword(text) : '');
        }}
        secureTextEntry
        placeholderTextColor={theme.colors.text.secondary}
      />
      {passwordError ? (
        <CustomText style={[styles.errorText, { color: theme.colors.error, marginTop: -8 }]}>
          {passwordError}
        </CustomText>
      ) : null}

      <TextInput
        style={[styles.input, {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.primary
        }]}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor={theme.colors.text.secondary}
      />

      <TouchableOpacity
        style={[
          styles.registerButton,
          { backgroundColor: theme.colors.primary },
          loading && styles.disabledButton
        ]}
        onPress={handleRegister}
        disabled={loading}
      >
        <CustomText style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Register'}
        </CustomText>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.contentContainer}>
        {error && (
          <CustomText style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </CustomText>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <View style={styles.loginContainer}>
          <CustomText style={[styles.loginText, { color: theme.colors.text.secondary }]}>
            Already have an account?{' '}
          </CustomText>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <CustomText style={[styles.loginLink, { color: theme.colors.primary }]}>
              Login
            </CustomText>
          </TouchableOpacity>
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
    padding: 24,
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
