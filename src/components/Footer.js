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
          height: fullHeight ? '100%' : 300,
          flex: fullHeight ? 1 : 1,
          borderColor: theme.colors.secondary,
          borderWidth: 1,
        },
      ]}>
      <CustomText
        variant="h1"
        bold={900}
        style={{color: theme.colors.primary}}>
        Rentr. {';)'}
      </CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.1,
    borderTopRightRadius: 100,
  },
});
