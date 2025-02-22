import React from 'react';  
import {LinearGradient} from 'react-native-linear-gradient';

export const BottomGradient = ({theme, zIndex, children}) => {
  return (
    <LinearGradient
      colors={[
        theme.isDark ? 'transparent' : 'rgba(255, 255, 255, 1)',
        theme.isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 1)',
      ]}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 0.8}}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: zIndex,
      }}
      pointerEvents="none"
    >
      {children}
    </LinearGradient>
  );
};

