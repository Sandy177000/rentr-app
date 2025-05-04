import React from 'react';
import VerticalItemCard from './VerticalItemCard';
import HorizontalItemCard from './HorizontalItemCard';
import { View } from 'react-native';
import { TListItemProps } from './types';

const ListItem = ({item, theme, navigation, horizontal = false, showFavorite = false}: TListItemProps) => {
  return (
    <View>
      { horizontal ? (
        <HorizontalItemCard
          item={item}
          theme={theme}
          navigation={navigation}
          showFavorite={showFavorite}
        />
      ) : (
        <VerticalItemCard
          item={item}
          theme={theme}
          navigation={navigation}
          showFavorite={showFavorite}
        />
      )}
    </View>
  );
};

export default ListItem;
