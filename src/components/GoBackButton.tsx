import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useTheme} from '../theme/ThemeProvider';

type GoBackButtonProps = {
  styles?: any;
}

function GoBackButton({styles}: GoBackButtonProps) {
  const navigation = useNavigation();
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 100,
        width: 40,
        position: 'absolute',
        left: 20,
        zIndex: 10,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        ...styles
      }}>
      <Icon name="angle-left" size={25} color={theme.colors.text.secondary} />
    </TouchableOpacity>
  );
}

export default GoBackButton;
