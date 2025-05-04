import {View} from 'react-native';
import React from 'react';
import GoBackButton from './GoBackButton';
import CustomText from './common/CustomText';

type ScreenHeaderProps = {
  children?: React.ReactNode;
  styles?: any;
  goBack?: boolean;
  title?: string;
}

const ScreenHeader = ({children, styles, goBack = true, title}: ScreenHeaderProps) => {

  const getHeaderStyle = () => {
    const baseStyle = {
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
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
      borderBottomColor: 'rgba(0, 0, 0, 0.2)',
      borderBottomWidth: 4,
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
