/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import CustomText from './CustomText';
import { useTheme } from '../../theme/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomTextInputField = ({label, value, onChangeText, placeholder, placeholderColor, required = false, type = 'text' }) => {
  const theme = useTheme();
  const [secureTextEntry, setSecureTextEntry] = useState();

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={{gap: 5}}>
      {label && <CustomText variant="h4" >{label}
        {required && <CustomText variant="h4" color={theme.colors.error}>*</CustomText>}
        </CustomText>}
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: theme.colors.surface, padding: 10}}>
      <TextInput
        style={[styles.input, { color: theme.colors.text.primary}]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry} 
        placeholderTextColor={placeholderColor || theme.colors.text.secondary}

      />
      {type === 'password' && <Icon name={secureTextEntry ? 'eye' : 'eye-slash'} size={20} color={theme.colors.text.primary} onPress={toggleSecureTextEntry} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 13,
  },
});
export default CustomTextInputField;
