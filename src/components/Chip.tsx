import {TouchableOpacity, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import React, {useCallback} from 'react';
import CustomText from './common/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useTheme} from '../theme/ThemeProvider';
import { IconProps } from 'react-native-vector-icons/Icon';
type ChipProps = {
  item: any;
  navigation?: any;
  navigationData?: {
    navigateTo: string;
    data: any;
  };
  style?: ViewStyle;
  iconStyle?: IconProps;
  textStyle?: TextStyle;
};

const Chip = ({item, navigation, navigationData, style, iconStyle, textStyle}: ChipProps) => {
  const theme = useTheme();
  const handleNavigation = useCallback(() => {
    if (navigationData) {
      const {navigateTo, data} = navigationData;
      navigation.navigate(navigateTo, data);
    }
  }, [navigation, navigationData]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.categoryItem, {backgroundColor: theme.colors.surface}, style]}
      onPress={() => handleNavigation()}>
      {(item.icon || iconStyle?.name) && (
        <Icon name={iconStyle?.name || item.icon} size={iconStyle?.size || 20} color={iconStyle?.color || theme.colors.primary} />
      )}
      <CustomText
        bold={700}
        variant="h4"
        style={{color: theme.colors.text.primary, ...textStyle}}>
        {item.name}
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 120,
    gap: 10,
    borderRadius: 30,
  },
});

export default Chip;
