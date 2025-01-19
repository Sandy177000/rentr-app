import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

export const Item = ({ item, navigation, theme }) => (
  <TouchableOpacity 
    style={[styles.itemCard, { 
      backgroundColor: theme.colors.surface,
      borderBottomColor: theme.colors.text.secondary 
    }]}
    onPress={() => navigation.navigate('ItemDetails', { item })}
  >
    <View style={styles.contentContainer}>
      <Text 
        style={[styles.itemTitle, { color: theme.colors.text.primary }]}
        numberOfLines={1}
      >
        {item.name}
      </Text>
      <Text 
        style={[styles.itemPrice, { color: theme.colors.text.secondary }]}
      >
        ${item.price}/day
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  itemCard: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '500',
  },
});