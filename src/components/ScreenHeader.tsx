import {View} from 'react-native';
import React from 'react';
import GoBackButton from './GoBackButton';
import CustomText from './common/CustomText';
import { useTheme } from '../theme/ThemeProvider';

type ScreenHeaderProps = {
  children?: React.ReactNode;
  styles?: any;
  goBack?: boolean;
  title?: string;
}

const ScreenHeader = ({children, styles, goBack = true, title}: ScreenHeaderProps) => {
  const theme = useTheme();
  const getHeaderStyle = () => {
    const baseStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      height: 70,
    };
    if (!title) {
      return {
        ...baseStyle,
        ...styles,
      };
    }
    return {
      ...baseStyle,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.surface,
    };
  };

  return (
    <View
      style={getHeaderStyle()}>
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
