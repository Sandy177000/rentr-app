import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../src/theme/ThemeProvider';
import ListItem from '../components/ListItem';
import Icon from 'react-native-vector-icons/FontAwesome';

// Sample data for rentals
const rentalsData = [
    {id: '1', name: 'Rental 1'},
    {id: '2', name: 'Rental 2'},
    {id: '3', name: 'Rental 3'},
];

const MyRentalsScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const renderItem = ({item, index}) => (
    <ListItem item={item} index={index} theme={theme} navigation={navigation} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={rentalsData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={50} color={theme.colors.text.secondary} />
            <Text
              style={[styles.emptyText, {color: theme.colors.text.secondary}]}>
              No Rentals yet
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginTop: 10,
  },
  item: {
    padding: 15,
    backgroundColor: '#f9c2ff',
    marginVertical: 8,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
  },
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Space for the add button
  },
  row: {
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
});

export default MyRentalsScreen;
