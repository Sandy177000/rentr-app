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
          backgroundColor: theme.colors.primary + '50',
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
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 100,
  },
});
