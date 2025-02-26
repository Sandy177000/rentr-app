import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
const CustomButton = ({ onPress, style, children, variant = 'primary', disabled = false, type = 'button'}) => {
  const theme = useTheme();

  const getButtonStyle = (buttonType) => {
    switch (buttonType) {
      case 'primary':
        return {backgroundColor: theme.colors.primary};
      case 'secondary':
        return {backgroundColor: theme.colors.secondary};
      default:
        return {backgroundColor: theme.colors.primary};
    }
  };

  if (type === 'label') {
    return (
      <TouchableOpacity
        style={style}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(variant), styles.button, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 15,
  },
});

export default CustomButton;

