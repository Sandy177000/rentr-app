import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { addToFavourites, removeFromFavourites, addFavourite, removeFavourite } from '../../store/itemsSlice';
import Animated, { FadeInDown } from 'react-native-reanimated';
const {width} = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2; // 48 = padding left + right + gap

const ListItem = ({item, theme, index, navigation, animate = true}) => {
  const dispatch = useDispatch();
  const [isFavourite, setIsFavourite] = useState(item.isFavorite);


  const handleFavourite = async () => {
    const initialFavouriteState = isFavourite;
    try {
      setIsFavourite(!isFavourite);
      if(initialFavouriteState) {
        // ui update
        dispatch(removeFavourite(item));
        // update in backend
        await dispatch(removeFromFavourites(item.id)).unwrap();
      } else {
        // ui update
        dispatch(addFavourite(item));
        // update in backend
        await dispatch(addToFavourites(item.id)).unwrap();
      }
    } catch (error) {
      setIsFavourite(initialFavouriteState);
      console.log('error in handleFavourite', error);
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 1)}
    >
    <View
      style={[
        styles.itemCard,
        {
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.primary,
        },
      ]}>
      <TouchableOpacity style={styles.heartIcon} onPress={handleFavourite}>
        {isFavourite ? (
          <Icon name="heart" size={22} color={theme.colors.primary} />
        ) : (
          <Icon name="heart-o" size={22} color={'#FFFFFF'} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('ItemDetails', {item})}>
        <Image
          source={{uri: item.images?.[0] || 'https://via.placeholder.com/150'}}
          style={styles.itemImage}
        />
      </TouchableOpacity>
      <View style={styles.itemContent}>
        <CustomText
          style={[styles.itemTitle, {color: theme.colors.text.primary}]}
          numberOfLines={1}>
          {item.name}
        </CustomText>
        <CustomText
          style={[styles.itemPrice, {color: theme.colors.text.secondary}]}>
          ${item.price}/day
        </CustomText>
      </View>
    </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Space for the add button
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
  },
  row: {
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  itemCard: {
    width: COLUMN_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: 150,
  },
  itemContent: {
    padding: 12,
  },
  itemTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    marginBottom: 12,
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
    marginTop: 16,
  },
});

export default ListItem;
