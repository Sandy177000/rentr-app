import React from 'react';
import Animated, {FadeInDown} from 'react-native-reanimated';
import VerticalItemCard from './VerticalItemCard';
import HorizontalItemCard from './HorizontalItemCard';
import { View } from 'react-native';

const ListItem = ({item, theme, index, navigation, animate = true, horizontal = false, showFavorite = false}) => {
  return (
    <View entering={FadeInDown.delay(index * 1)}>
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
