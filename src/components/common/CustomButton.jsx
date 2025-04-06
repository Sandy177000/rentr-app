import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import globalStyles from '../../theme/global.styles';
const CustomButton = ({ onPress, style, children, variant = '', disabled = false, type = 'button'}) => {
  const theme = useTheme();

  const getButtonStyle = (buttonType) => {
    switch (buttonType) {
      case 'primary':
        return {backgroundColor: theme.colors.primary};
      case 'secondary':
        return {backgroundColor: theme.colors.secondary};
      default:
        return {backgroundColor: 'transparent'};
    }
  };

  if (type === 'label') {
    return (
      <TouchableOpacity
        style={style}
        onPress={onPress}
        disabled={disabled}
      >
        {children}
      </TouchableOpacity>
    );
  }

  if (type === 'action') {
    return (
      <TouchableOpacity
        style={[getButtonStyle(variant), styles.button, styles.centerContent, style]}
        onPress={onPress} 
        disabled={disabled}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    flexDirection: 'row',
  },
  centerContent: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default CustomButton;

