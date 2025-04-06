/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import CustomText from './CustomText';
import { useTheme } from '../../theme/ThemeProvider';
import globalStyles from '../../theme/global.styles';

const CustomTextInputField = ({ key, label, value, onChangeText, placeholder, secureTextEntry = false, placeholderColor, ...rest }) => {
  const theme = useTheme();
  return (
    <View style={{gap: 5}} key={key}>
      {label && <CustomText variant="h4" >{label}
        {rest.required && <CustomText variant="h4" color={theme.colors.error}>*</CustomText>}
        </CustomText>}
      <TextInput
        style={[styles.input, {backgroundColor: theme.colors.surface, color: theme.colors.text.primary}]}
        {...rest}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry} 
        placeholderTextColor={placeholderColor || theme.colors.text.secondary}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 13,
    ...globalStyles.borderRadius,
    padding: 15,
  },
});
export default CustomTextInputField;
