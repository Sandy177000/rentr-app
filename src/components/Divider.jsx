import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from '../theme/ThemeProvider'

const Divider = () => {
  const theme = useTheme();
  return (
    <View
      style={[styles.divider, {borderColor: theme.colors.primary}]}
    />
  );
};

const styles =  StyleSheet.create({
  divider: {
    borderWidth: 0.2,
    marginBottom: 10,
    marginTop: 10,
  },
});

export default Divider;
