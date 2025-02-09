import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

const CustomText = ({ style, variant = 'body', children, ...props }) => {
  const theme = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'h1':
        return styles.h1;
      case 'h2':
        return styles.h2;
      case 'h3':
        return styles.h3;
      case 'subtitle':
        return styles.subtitle;
      case 'caption':
        return styles.caption;
      case 'h4':
        return styles.h4;
      default:
        return styles.body;
    }
  };

  return (
    <Text
      {...props}
      style={[
        {
          color: theme.colors.text.primary,
          fontFamily: theme.font,
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    fontSize: 14,
  },
  h4: {
    fontSize: 12,
  },
  subtitle: {
    fontSize: 8,
  },
  caption: {
    fontSize: 6,
  },
});

export default CustomText;
