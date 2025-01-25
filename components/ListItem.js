import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2; // 48 = padding left + right + gap
const ListItem = ({ item, index, theme, navigation }) => {


  return (
    <View style={[
        styles.itemCard,
        { 
          backgroundColor: theme.colors.surface,
          marginLeft: index % 2 === 0 ? 0 : 8,
          shadowColor: theme.colors.text.primary 
        }
      ]}>
        
        <Image
          source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemContent}>
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
          <TouchableOpacity
            style={[styles.viewButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('ItemDetails', { item })}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    listContent: {
      padding: 16,
      paddingBottom: 100, // Space for the add button
    },
    row: {
      justifyContent: 'flex-start',
      marginBottom: 16,
    },
    itemCard: {
      width: COLUMN_WIDTH,
      borderRadius: 12,
      overflow: 'hidden',
      elevation: 2,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    itemImage: {
      width: '100%',
      height: 150,
      backgroundColor: '#f0f0f0',
    },
    itemContent: {
      padding: 12,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    itemPrice: {
      fontSize: 14,
      marginBottom: 12,
    },
    viewButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    viewButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '500',
    },
    addButton: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 100,
    },
    emptyText: {
      fontSize: 16,
      marginTop: 16,
    },
  });
  
export default ListItem;