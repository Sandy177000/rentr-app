import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {FadeInDown} from 'react-native-reanimated';

const EmptyListComponent = ({children}) => {
  return (
    <Animated.View entering={FadeInDown} style={[styles.emptyContainer]}>
      {children}
    </Animated.View>
  );
};

export default EmptyListComponent;

const styles = StyleSheet.create({
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});
