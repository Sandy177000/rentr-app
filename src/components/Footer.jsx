import {View, StyleSheet} from 'react-native';
import React from 'react';
import CustomText from './common/CustomText';
import {useTheme} from '../theme/ThemeProvider';


export default function Footer() {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.primary,
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
    flex: 1,
    width: '100%',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.1,
    borderTopRightRadius: 100,
  },
});
