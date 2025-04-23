import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { selectFavouriteIds, toggleFavoriteStatus } from '../../store/itemsSlice';
import { useTheme } from '../theme/ThemeProvider';

const FavoriteButton = ({ item, size = 24, style }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  // Get favorite IDs directly from Redux
  const favouriteIds = useSelector(selectFavouriteIds);
  // Check if this item is in favorites
  const isFavorite = item && favouriteIds.includes(item.id);

  const handleToggleFavorite = () => {
    dispatch(toggleFavoriteStatus({
      item,
      isFavorite: isFavorite,
    }));
  };

  return (
    <TouchableOpacity
      onPress={handleToggleFavorite}
      style={[styles.container, style]}
    >
      <Icon
        name={isFavorite ? 'heart' : 'heart-o'}
        size={size}
        color={isFavorite ? theme.colors.primary : '#8E8E93'}
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
