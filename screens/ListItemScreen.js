// screens/ListItemScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../src/theme/ThemeProvider';

export const ListItemScreen = () => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = () => {
    // Implement item listing logic
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        style={[styles.input, {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.primary,
          borderColor: theme.colors.text.secondary
        }]}
        placeholder="Item Title"
        placeholderTextColor={theme.colors.text.secondary}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.primary,
          borderColor: theme.colors.text.secondary
        }]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={[styles.input, {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text.primary,
          borderColor: theme.colors.text.secondary
        }]}
        placeholder="Price per day"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleSubmit}
      >
        <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>List Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  itemCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 20,
  },
  submitButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});