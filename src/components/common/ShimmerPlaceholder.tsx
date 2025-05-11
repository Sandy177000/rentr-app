import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// Define valid dimensions type
type DimensionType = number | `${number}%`;

interface ShimmerPlaceholderProps {
  style?: ViewStyle;
  width: DimensionType;
  height: DimensionType;
  shimmerColors: string[];
  borderRadius?: number;
}

const ShimmerPlaceholder: React.FC<ShimmerPlaceholderProps> = ({
  style,
  width: itemWidth,
  height,
  shimmerColors,
  borderRadius = 0,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = () => {
      animatedValue.setValue(0);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }).start(() => shimmerAnimation());
    };

    shimmerAnimation();
    return () => animatedValue.stopAnimation();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View 
      style={[
        { 
          width: itemWidth,
          height,
          overflow: 'hidden',
          borderRadius 
        }, 
        style
      ]}
    >
      <View style={{ backgroundColor: shimmerColors[0], width: '100%', height: '100%' }} />
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }],
          },
        ]}>
        <LinearGradient
          colors={shimmerColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: '100%', height: '100%' }}
        />
      </Animated.View>
    </View>
  );
};

export default ShimmerPlaceholder; 