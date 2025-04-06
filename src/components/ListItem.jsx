import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  addToFavourites,
  removeFromFavourites,
  addFavourite,
  removeFavourite,
} from '../../store/itemsSlice';
import Animated, {FadeInDown} from 'react-native-reanimated';
import VerticalItemCard from './VerticalItemCard';
import HorizontalItemCard from './HorizontalItemCard';

const ListItem = ({item, theme, index, navigation, animate = true, horizontal = false, showFavorite = false}) => {
  const dispatch = useDispatch();
  const [isFavourite, setIsFavourite] = useState(item.isFavorite);

  const handleFavourite = async () => {
    const initialFavouriteState = isFavourite;
    try {
      setIsFavourite(!isFavourite);
      if (initialFavouriteState) {
        dispatch(removeFavourite(item));
        await dispatch(removeFromFavourites(item.id)).unwrap();
      } else {
        dispatch(addFavourite(item));
        await dispatch(addToFavourites(item.id)).unwrap();
      }
    } catch (error) {
      setIsFavourite(initialFavouriteState);
      console.log('error in handleFavourite', error);
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 1)}>
      { horizontal ? (
        <HorizontalItemCard
          item={item}
          theme={theme}
          navigation={navigation}
          isFavourite={isFavourite}
          handleFavourite={handleFavourite}
          showFavorite={showFavorite}
        />
      ) : (
        <VerticalItemCard
          item={item}
          theme={theme}
          navigation={navigation}
          isFavourite={isFavourite}
          handleFavourite={handleFavourite}
          showFavorite={showFavorite}
        />
      )}
    </Animated.View>
  );
};

export default ListItem;
