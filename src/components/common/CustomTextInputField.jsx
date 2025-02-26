/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import CustomText from './CustomText';
import { useTheme } from '../../theme/ThemeProvider';
import globalStyles from '../../theme/global.styles';

const CustomTextInputField = ({ label, value, onChangeText, placeholder, secureTextEntry = false, placeholderColor }) => {
  const theme = useTheme();
  return (
    <View style={{gap: 5}}>
      {label && <CustomText variant="h4" >{label}</CustomText>}
      <TextInput
        style={[styles.input, {backgroundColor: theme.colors.surface, color: theme.colors.text.primary}]}
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
