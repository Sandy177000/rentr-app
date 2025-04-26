import {View} from 'react-native';
import React from 'react';
import {useTheme} from '../theme/ThemeProvider';
import GoBackButton from './GoBackButton';
import CustomText from './common/CustomText';

const ScreenHeader = ({children, styles, goBack = true, title}) => {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        height: 70,
        ...styles,
      }}>
      {goBack && <GoBackButton />}
      {title && <View style={{flex: 1}}>
        <CustomText variant="h2" style={{textAlign: 'center'}}>
          {title}
        </CustomText>
      </View>}
      {children}
    </View>
  );
};

export default ScreenHeader;
