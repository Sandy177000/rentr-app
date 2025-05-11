import React from 'react';
import {View, StyleSheet} from 'react-native';
import ShimmerPlaceholder from './ShimmerPlaceholder';
import {getShimmerColors} from '../../utils/utils';
import {useTheme} from '../../theme/ThemeProvider';

const ShimmerItemDetails = () => {
  const theme = useTheme();
  const shimmerColors = getShimmerColors(theme);
  return (
    <View style={styles.container}>
      <ShimmerPlaceholder
        width={'100%'}
        height={'45%'}
        shimmerColors={shimmerColors}
      />
      <View style={styles.row}>
        <ShimmerPlaceholder
          width={'100%'}
          height={70}
          shimmerColors={shimmerColors}
          borderRadius={10}
        />
        <ShimmerPlaceholder
          width={'100%'}
          height={100}
          shimmerColors={shimmerColors}
          borderRadius={10}
        />
        <ShimmerPlaceholder
          width={'100%'}
          height={50}
          shimmerColors={shimmerColors}
          borderRadius={10}
        />
        <ShimmerPlaceholder
          width={'100%'}
          height={70}
          shimmerColors={shimmerColors}
          borderRadius={10}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
  row: {
    flexDirection: 'column',
    gap: 10,
    paddingHorizontal: 10,
  },
});

export default ShimmerItemDetails;
