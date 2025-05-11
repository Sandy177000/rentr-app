// src/components/common/CustomToast.jsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { useTheme } from '../theme/ThemeProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomToast = () => {
  const theme = useTheme();
  
  // Update toast config when theme changes
  useEffect(() => {
    Toast.setConfig({
      config: toastConfig
    });
  }, [theme.isDark]);
  
  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: theme.colors.primary,
          backgroundColor: theme.colors.surface,
          borderRadius: 8,
          marginTop: 10,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: '600',
          color: theme.colors.text.primary,
        }}
        text2Style={{
          fontSize: 14,
          color: theme.colors.text.secondary,
        }}
        renderLeadingIcon={() => (
          <View style={styles.iconContainer}>
            <Icon name="check-circle" size={24} color={theme.colors.primary} />
          </View>
        )}
      />
    ),
    
    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: theme.colors.error,
          backgroundColor: theme.colors.surface,
          borderRadius: 8,
          marginTop: 10,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: '600',
          color: theme.colors.text.primary,
        }}
        text2Style={{
          fontSize: 14,
          color: theme.colors.text.secondary,
        }}
        renderLeadingIcon={() => (
          <View style={styles.iconContainer}>
            <Icon name="alert-circle" size={24} color={theme.colors.error} />
          </View>
        )}
      />
    ),
    
    info: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: '#0A84FF',
          backgroundColor: theme.colors.surface,
          borderRadius: 8,
          marginTop: 10,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: '600',
          color: theme.colors.text.primary,
        }}
        text2Style={{
          fontSize: 14,
          color: theme.colors.text.secondary,
        }}
        renderLeadingIcon={() => (
          <View style={styles.iconContainer}>
            <Icon name="information" size={24} color="#0A84FF" />
          </View>
        )}
      />
    )
  };
  
  return null;
};

export default CustomToast;

const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
  }
});