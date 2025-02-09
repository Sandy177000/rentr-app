import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet,
} from 'react-native';
import { useTheme } from '../src/theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ListItem from '../src/components/ListItem';
import CustomText from '../src/components/CustomText';

const FavouritesScreen = () => {
  const [favourites, setFavourites] = useState([]);
  const navigation = useNavigation();
  const theme = useTheme();

  // TODO: Replace with actual API call to get favourited items
  useEffect(() => {
    // Dummy data for now
    setFavourites([
      {
        id: '1',
        name: 'Mountain Bike',
        price: '25',
        images: ['https://via.placeholder.com/150'],
      },
      {
        id: '2',
        name: 'DSLR Camera',
        price: '45',
        images: ['https://via.placeholder.com/150'],
      },
    ]);
  }, []);

  const renderItem = ({ item, index }) => (
    <ListItem 
      item={item} 
      index={index} 
      theme={theme} 
      navigation={navigation} 
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={favourites}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="heart-o" size={50} color={theme.colors.text.secondary} />
            <CustomText 
              style={[styles.emptyText, { color: theme.colors.text.secondary }]}
            >
              No favourites yet
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
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'flex-start',
    marginBottom: 16,
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

export default FavouritesScreen;