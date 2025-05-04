import React from 'react';
import {TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {selectFavouriteIds, toggleFavoriteStatus} from '../../store/itemsSlice';
import {useTheme} from '../theme/ThemeProvider';
import {colors} from '../theme/theme';
import {TItem} from './types';

type FavoriteButtonProps = {
  item: TItem;
  size?: number;
  style?: ViewStyle;
};

const FavoriteButton = ({item, size = 24, style}: FavoriteButtonProps) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const favouriteIds = useSelector(selectFavouriteIds);
  const isFavorite = item && favouriteIds.includes(item.id);

  const handleToggleFavorite = () => {
    dispatch(toggleFavoriteStatus({item, isFavorite}));
  };

  return (
    <TouchableOpacity
      onPress={handleToggleFavorite}
      style={[styles.container, style]}>
      <Icon
        name={isFavorite ? 'heart' : 'heart'}
        size={size}
        color={isFavorite ? theme.colors.primary : colors.white}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

export default FavoriteButton;
