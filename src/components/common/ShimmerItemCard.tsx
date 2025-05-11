import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShimmerPlaceholder from './ShimmerPlaceholder';
import { Dimensions } from 'react-native';
import { getShimmerColors } from '../../utils/utils';
const { width } = Dimensions.get('window');

interface ShimmerItemCardProps {
  theme: {
    isDark: boolean;
    colors: {
      primary: string;
      surface: string;
      text: {
        primary: string;
        secondary: string;
      };
    };
  };
}

const COLUMN_WIDTH = (width - 48) / 2;

const ShimmerItemCard: React.FC<ShimmerItemCardProps> = ({theme}) => {
  
  // Determine shimmer colors based on theme
  const shimmerColors = getShimmerColors(theme);

  return (
    <View style={styles.container}>
      {/* Image placeholder */}
      <ShimmerPlaceholder
        width={COLUMN_WIDTH}
        height={120}
        shimmerColors={shimmerColors}
        style={styles.imageShimmer}
        borderRadius={8}
      />
      
      {/* Title placeholder */}
      <ShimmerPlaceholder
        width={COLUMN_WIDTH}
        height={15}
        shimmerColors={shimmerColors}
        style={styles.titleShimmer}
        borderRadius={4}
      />
      
      {/* Price placeholder */}
      <ShimmerPlaceholder
        width={COLUMN_WIDTH}
        height={12}
        shimmerColors={shimmerColors}
        style={styles.priceShimmer}
        borderRadius={4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    backgroundColor: 'transparent',
    marginRight: 15,
    width: COLUMN_WIDTH,
    borderRadius: 20,
  },
  imageShimmer: {
    marginBottom: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleShimmer: {
    marginBottom: 6,
  },
  priceShimmer: {
    marginBottom: 6,
  },
});

export default ShimmerItemCard; 