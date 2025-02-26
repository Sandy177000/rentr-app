import React, {useState, useEffect} from 'react';
import {View, FlatList, StyleSheet, RefreshControl} from 'react-native';
import {useTheme} from '../src/theme/ThemeProvider';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ListItem from '../src/components/ListItem';
import CustomText from '../src/components/common/CustomText';
import { useDispatch, useSelector } from 'react-redux';
import { getFavouriteItems, selectFavourites } from '../store/itemsSlice';
import Animated, { FadeInDown } from 'react-native-reanimated';

const FavouritesScreen = () => {
  const dispatch = useDispatch();
  const favourites = useSelector(selectFavourites);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();

  const getFavourites = async () => {
    setLoading(true);
    try {
      await dispatch(getFavouriteItems()).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFavourites();
  }, []);

  const renderItem = ({item, index}) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100)}
    >
      <ListItem item={item} index={index} theme={theme} navigation={navigation} />
    </Animated.View>
  );

  return (
    <>
    
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <FlatList
        data={favourites}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.listContent,
          !favourites.length && styles.emptyListContent
        ]}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getFavourites} />
        }
        ListEmptyComponent={
          <Animated.View 
            entering={FadeInDown}
            style={styles.emptyContainer}
          >
            <Icon
              name="heart-o"
              size={64}
              color={theme.colors.text.secondary}
              style={styles.emptyIcon}
            />
            <CustomText
              style={[styles.emptyText, {color: theme.colors.text.secondary}]}>
              No favourites yet
            </CustomText>
            <CustomText
              style={[styles.emptySubText, {color: theme.colors.text.secondary}]}>
              Items you love will appear here
            </CustomText>
          </Animated.View>
        }
      />
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
    minHeight: '100%',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.8,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default FavouritesScreen;
