import React from 'react';  
import {LinearGradient} from 'react-native-linear-gradient';

export const BottomGradient = ({theme, zIndex}) => {
  return (
    <LinearGradient
      colors={[
        'transparent',
        'transparent',
        'transparent',
        'transparent',
        theme.colors.surface,
      ]}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: zIndex,
      }}
      pointerEvents="none"
    />
  );
};

