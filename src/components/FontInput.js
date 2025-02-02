import React from 'react';
import { View, CustomText, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

const FontInput = ({ label, value, fontKey, onChangeFont }) => {
  const theme = useTheme();

  return (
    <View style={styles.inputContainer}>
      <CustomText style={[styles.label, { color: theme.colors.text.primary }]}>
        {label}
      </CustomText>
      <TextInput
        style={[styles.input, {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text.primary,
            borderColor: theme.colors.border
        }]}
        value={value}
        onChangeText={(text) => onChangeFont(fontKey, text)}
        placeholder="Enter font name"
        placeholderTextColor={theme.colors.text.secondary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
});

export default FontInput; 