import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

const CustomModal = ({showModal, children}) => {
  if (!showModal) {
    return null;
  }
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={styles.modal}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3000,
  },
});

export default CustomModal;
