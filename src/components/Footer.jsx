import {View, StyleSheet, Text} from 'react-native';
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
          backgroundColor: theme.colors.surface,
        },
      ]}>
      <CustomText
        bold={900}
        style={{color: theme.colors.primary, fontSize: 22, }}>
        Rentr. {';)'}
      </CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 30,
    height: 700,
  },
});
