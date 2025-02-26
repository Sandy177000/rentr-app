import React, { useState } from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../src/theme/ThemeProvider';
import ListItem from '../src/components/ListItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomText from '../src/components/common/CustomText';


const MyRentalsScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [rentalsData, setRentalsData] = useState([]);

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
            <CustomText
              style={[styles.emptyText, {color: theme.colors.text.secondary}]}>
              No Rentals yet
            </CustomText>
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
    flex: 1,
    padding: 16,
    paddingBottom: 100, // Space for the add button
  },
  row: {
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
});

export default MyRentalsScreen;
