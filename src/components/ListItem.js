import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import CustomText from './common/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch} from 'react-redux';
import {
  addToFavourites,
  removeFromFavourites,
  addFavourite,
  removeFavourite,
} from '../../store/itemsSlice';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {CustomImage} from './common/CustomImage';
const {width} = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const ListItem = ({item, theme, index, navigation, animate = true}) => {
  const dispatch = useDispatch();
  const [isFavourite, setIsFavourite] = useState(item.isFavorite);

  const handleFavourite = async () => {
    const initialFavouriteState = isFavourite;
    try {
      setIsFavourite(!isFavourite);
      if (initialFavouriteState) {
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
    <Animated.View entering={FadeInDown.delay(index * 1)}>
      <View style={styles.itemCard}>
        <TouchableOpacity style={styles.heartIcon} onPress={handleFavourite}>
          {isFavourite ? (
            <Icon name="heart" size={22} color={theme.colors.primary} />
          ) : (
            <Icon name="heart-o" size={22} color={'#FFFFFF'} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.imageContainer}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ItemDetails', {item})}>
          <CustomImage
            source={item.images?.[0]}
            style={styles.itemImage}
            overlay
          />
        </TouchableOpacity>
      </View>
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
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemContent: {
    paddingTop: 10,
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
