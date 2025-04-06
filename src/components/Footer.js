import {View, StyleSheet} from 'react-native';
import React from 'react';
import CustomText from './common/CustomText';
import {useTheme} from '../theme/ThemeProvider';
import { colors } from '../theme/theme';
export default function Footer({fullHeight = false}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.primary,
          height: fullHeight ? '100%' : 'auto',
          flex: fullHeight ? '' : 1,
        },
      ]}>
      <CustomText
        variant="h1"
        bold={600}
        style={{color:  colors.white}}>
        Rentr. {'\u2764'}
      </CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: '100%',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
});
