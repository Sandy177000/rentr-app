/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

const CustomText = ({ style, variant = 'body', bold = 400, children, type = 'text', ...props }) => {
  const theme = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'h1':
        return styles.h1;
      case 'h2':
        return styles.h2;
      case 'h3':
        return styles.h3;
      case 'h4':
        return styles.h4;
      case 'h5':
        return styles.h5;
      case 'h6':
        return styles.h6;
      case 'h7':
        return styles.h7;
      default:
        return styles.default;
    }
  };

  return (
    <Text
      {...props}
      style={[
        {
          color: theme.colors.text.primary,
          fontFamily: theme.font,
          fontWeight: bold ? bold : 'normal',
          textDecorationLine: type === 'link' ? 'underline' : 'none',
        },
        getVariantStyle(),
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 19,
  },
  h2: {
    fontSize: 17,
  },
  h3: {
    fontSize: 15,
  },
  h4: {
    fontSize: 13,
  },
  h5: {
    fontSize: 11,
  },
  h6: {
    fontSize: 9,
  },
  h7: {
    fontSize: 7,
  },
  default: {
    fontSize: 11,
  },
});

export default CustomText;
